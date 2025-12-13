using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class ChargeOrderService
{
    private readonly DapperService _dapperService;

    public ChargeOrderService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<ChargeOrder>> GetRecordsAsync(int orgId, string? fromDate, string? toDate)
    {
        var sql = @"SELECT CO.ChargeOrderId, CO.OrgId, CO.ChargeOrderNo, CO.ChargeDt,
+                           CO.ItemId, CO.AccountId, CO.Charges, CO.Amount, CO.PaidAmount, CO.Remark,
+                           IM.ItemName, AM.AccountName
+                    FROM ChargeOrder CO
+                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
+                    INNER JOIN AccountMaster AM ON AM.AccountId = CO.AccountId
+                    WHERE CO.OrgId = @OrgId";

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
        const string sql = @"SELECT CO.ChargeOrderId, CO.OrgId, CO.ChargeOrderNo, CO.ChargeDt,
+                                   CO.ItemId, CO.AccountId, CO.Charges, CO.Amount, CO.PaidAmount, CO.Remark,
+                                   IM.ItemName, AM.AccountName
+                            FROM ChargeOrder CO
+                            INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
+                            INNER JOIN AccountMaster AM ON AM.AccountId = CO.AccountId
+                            WHERE CO.ChargeOrderId = @ChargeOrderId";

        var entity = await _dapperService.QuerySingleOrDefaultAsync<ChargeOrder>(sql, new { ChargeOrderId = chargeOrderId });
        if (entity == null)
        {
            entity = new ChargeOrder
            {
                ChargeOrderId = -1,
                OrgId = orgId,
                ChargeOrderNo = await GetChargeOrderNoAsync(orgId),
                ChargeDt = DateTime.Now
            };
        }

        return entity;
    }

    public async Task<ChargeOrder?> GetLatestRecordAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 CO.ChargeOrderId, CO.OrgId, CO.ChargeOrderNo, CO.ChargeDt,
+                                   CO.ItemId, CO.AccountId, CO.Charges, CO.Amount, CO.PaidAmount, CO.Remark,
+                                   IM.ItemName, AM.AccountName
+                            FROM ChargeOrder CO
+                            INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
+                            INNER JOIN AccountMaster AM ON AM.AccountId = CO.AccountId
+                            WHERE CO.OrgId = @OrgId
+                            ORDER BY CO.ChargeOrderId DESC";

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

    private async Task<string> GetChargeOrderNoAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 ChargeOrderNo
+                             FROM ChargeOrder
+                             WHERE OrgId = @OrgId
+                             ORDER BY ChargeOrderId DESC";

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
}
