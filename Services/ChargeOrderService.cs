using System.Data;
using System.Linq;
using Dapper;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Services;

public class ChargeOrderService
{
    private readonly DapperService _dapperService;
    private readonly ReportUtility _reportUtility;

    public ChargeOrderService(DapperService dapperService, ReportUtility reportUtility)
    {
        _dapperService = dapperService;
        _reportUtility = reportUtility;
    }

    public async Task<IEnumerable<ChargeOrder>> GetRecordsAsync(int orgId, string? fromDate, string? toDate)
    {
        var sql = @"SELECT CO.ChargeOrderId, CO.OrgId, CO.ChargeOrderNo, CO.ChargeDt,
                           CO.ItemId, CO.AccountId, CO.Charges, CO.Amount, CO.PaidAmount, CO.Remark,
                           IM.ItemName, AM.AccountName
                    FROM ChargeOrder CO
                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                    INNER JOIN AccountMaster AM ON AM.AccountId = CO.AccountId
                    WHERE CO.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Int32);

        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND CO.ChargeDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND CO.ChargeDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY CO.ChargeOrderId DESC";

        return await _dapperService.QueryAsync<ChargeOrder>(sql, parameters);
    }

    public async Task<ChargeOrder> GetRecordAsync(decimal chargeOrderId, decimal orgId)
    {
        const string sqlHeader = @"SELECT CO.ChargeOrderId, CO.OrgId, CO.ChargeOrderNo, CO.ChargeDt,
                                          CO.ItemId, CO.AccountId, CO.Charges, CO.Amount, CO.PaidAmount, CO.Remark,
                                          IM.ItemName, AM.AccountName
                                   FROM ChargeOrder CO
                                   INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                                   INNER JOIN AccountMaster AM ON AM.AccountId = CO.AccountId
                                   WHERE CO.ChargeOrderId = @ChargeOrderId";

        var entity = await _dapperService.QuerySingleOrDefaultAsync<ChargeOrder>(sqlHeader, new { ChargeOrderId = chargeOrderId });
        if (entity == null)
        {
            entity = new ChargeOrder
            {
                ChargeOrderId = -1,
                OrgId = orgId,
                ChargeOrderNo = await GetChargeOrderNoAsync(orgId),
                ChargeDt = DateTime.Now,
                ChargePayeeDetails = new List<ChargePayeeDetail>()
            };
        }
        else
        {
            const string sqlDetails = @"SELECT CPD.*, AM.AccountName
                                       FROM ChargePayeeDetail CPD
                                       INNER JOIN AccountMaster AM ON AM.AccountId = CPD.AccountId
                                       WHERE CPD.ChargeOrderId = @ChargeOrderId";

            var details = await _dapperService.QueryAsync<ChargePayeeDetail>(sqlDetails, new { ChargeOrderId = chargeOrderId });
            entity.ChargePayeeDetails = details.ToList();
        }

        return entity;
    }

    public async Task<ChargeOrder?> GetLatestRecordAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 CO.ChargeOrderId, CO.OrgId, CO.ChargeOrderNo, CO.ChargeDt,
                                   CO.ItemId, CO.AccountId, CO.Charges, CO.Amount, CO.PaidAmount, CO.Remark,
                                   IM.ItemName, AM.AccountName
                            FROM ChargeOrder CO
                            INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                            INNER JOIN AccountMaster AM ON AM.AccountId = CO.AccountId
                            WHERE CO.OrgId = @OrgId
                            ORDER BY CO.ChargeOrderId DESC";

        return await _dapperService.QuerySingleOrDefaultAsync<ChargeOrder>(sql, new { OrgId = orgId });
    }

    public async Task<SummaryData> GetOrderSummaryAsync(decimal orgId, string? fromDate, string? toDate)
    {
        var entity = new SummaryData();

        var sql = @"SELECT SUM(Amount) AS Amount, SUM(PaidAmount) AS PaidAmount
                     FROM ChargeOrder CO
                     WHERE CO.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND CO.ChargeDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }

        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND CO.ChargeDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        var result = await _dapperService.QuerySingleOrDefaultAsync<dynamic>(sql, parameters);
        if (result != null)
        {
            // Use dynamic to avoid tight coupling to anonymous type
            try
            {
                entity.TotalChargeAmount = (decimal)(result.Amount ?? 0m);
                entity.TotalChargePaid = (decimal)(result.PaidAmount ?? 0m);
            }
            catch
            {
                // Fallback conversion if result comes back as dictionary-like
                var dict = (IDictionary<string, object>)result;
                if (dict.TryGetValue("Amount", out var amt) && amt != null)
                {
                    entity.TotalChargeAmount = Convert.ToDecimal(amt);
                }
                if (dict.TryGetValue("PaidAmount", out var paid) && paid != null)
                {
                    entity.TotalChargePaid = Convert.ToDecimal(paid);
                }
            }
        }

        return entity;
    }

    public async Task<bool> SaveAsync(ChargeOrder entity)
    {
        return await _dapperService.ExecuteInTransactionAsync<bool>(async (connection, transaction) =>
        {
            // Insert or update ChargeOrder header
            if (entity.ChargeOrderId == -1)
            {
                var parameters = new DynamicParameters();
                parameters.Add("OrgId", entity.OrgId, DbType.Decimal);
                parameters.Add("ChargeOrderNo", await GetChargeOrderNoAsync(entity.OrgId), DbType.String);
                parameters.Add("ItemId", entity.ItemId, DbType.Decimal);
                parameters.Add("AccountId", entity.AccountId, DbType.Decimal);
                parameters.Add("Charges", entity.Charges, DbType.Decimal);
                parameters.Add("Amount", entity.Amount, DbType.Decimal);
                parameters.Add("PaidAmount", entity.PaidAmount, DbType.Decimal);
                parameters.Add("Remark", entity.Remark ?? string.Empty, DbType.String);
                parameters.Add("RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

                await connection.ExecuteAsync(
                    "Proc_Insert_ChargeOrder",
                    parameters,
                    transaction,
                    commandType: CommandType.StoredProcedure);

                entity.ChargeOrderId = parameters.Get<decimal>("RecordId");
            }
            else
            {
                var parameters = new DynamicParameters();
                parameters.Add("ChargeOrderId", entity.ChargeOrderId, DbType.Decimal);
                parameters.Add("ItemId", entity.ItemId, DbType.Decimal);
                parameters.Add("AccountId", entity.AccountId, DbType.Decimal);
                parameters.Add("Charges", entity.Charges, DbType.Decimal);
                parameters.Add("Amount", entity.Amount, DbType.Decimal);
                parameters.Add("Remark", entity.Remark ?? string.Empty, DbType.String);

                await connection.ExecuteAsync(
                    "Proc_Update_ChargeOrder",
                    parameters,
                    transaction,
                    commandType: CommandType.StoredProcedure);
            }

            // Delete existing unpaid ChargePayeeDetail rows for this order
            const string deleteSql = "DELETE FROM ChargePayeeDetail WHERE PaidAmount = 0 AND ChargeOrderId = @ChargeOrderId";
            await connection.ExecuteAsync(deleteSql, new { ChargeOrderId = entity.ChargeOrderId }, transaction);

            // Insert new unpaid ChargePayeeDetail rows
            if (entity.ChargePayeeDetails != null)
            {
                foreach (var item in entity.ChargePayeeDetails)
                {
                    if (item.PaidAmount > 0) continue;

                    item.ChargeOrderId = entity.ChargeOrderId;

                    var dtlParams = new DynamicParameters();
                    dtlParams.Add("ChargeOrderId", item.ChargeOrderId, DbType.Decimal);
                    dtlParams.Add("AccountId", item.AccountId, DbType.Decimal);
                    dtlParams.Add("Amount", item.Amount, DbType.Decimal);
                    dtlParams.Add("PaidAmount", item.PaidAmount, DbType.Decimal);

                    await connection.ExecuteAsync(
                        "Proc_Insert_ChargePayeeDetail",
                        dtlParams,
                        transaction,
                        commandType: CommandType.StoredProcedure);
                }
            }

            return true;
        });
    }

    private async Task<string> GetChargeOrderNoAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 ChargeOrderNo
                             FROM ChargeOrder
                             WHERE OrgId = @OrgId
                             ORDER BY ChargeOrderId DESC";

        var lastNo = await _dapperService.QuerySingleOrDefaultAsync<string>(sql, new { OrgId = orgId });
        if (string.IsNullOrWhiteSpace(lastNo))
        {
            lastNo = "CH000";
        }

        var numericPart = 0m;
        if (lastNo.Length > 2)
        {
            decimal.TryParse(lastNo.Substring(2), out numericPart);
        }

        var nextNo = numericPart + 1;
        return $"CH{nextNo:000}";
    }

    public async Task<(byte[] Content, string FileName)> GenerateChargeOrderReportPdfAsync(
        decimal orgId,
        decimal chargeOrderId)
    {
        const string sqlHeader = @"SELECT CO.ChargeOrderId, CO.OrgId, CO.ChargeOrderNo, CO.ChargeDt,
                                          CO.ItemId, CO.AccountId, CO.Charges, CO.Amount, CO.PaidAmount, CO.Remark,
                                          IM.ItemName, AM.AccountName
                                   FROM ChargeOrder CO
                                   INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                                   INNER JOIN AccountMaster AM ON AM.AccountId = CO.AccountId
                                   WHERE CO.ChargeOrderId = @ChargeOrderId";

        const string sqlDetails = @"SELECT CPD.*, AM.AccountName
                                     FROM ChargePayeeDetail CPD
                                     INNER JOIN AccountMaster AM ON AM.AccountId = CPD.AccountId
                                     WHERE CPD.ChargeOrderId = @ChargeOrderId";

        var parameters = new DynamicParameters();
        parameters.Add("@ChargeOrderId", chargeOrderId, DbType.Decimal);

        var headerTable = await _dapperService.QueryToDataTableAsync(sqlHeader, parameters);
        var detailsTable = await _dapperService.QueryToDataTableAsync(sqlDetails, parameters);

        var dataSources = new Dictionary<string, DataTable>
        {
            { "Header", headerTable },
            { "Details", detailsTable }
        };

        return await _reportUtility.GenerateReportPdfAsync(
            dataSources,
            orgId,
            "ChargeOrder.frx",
            "Charge Order",
            string.Empty);
    }
}
