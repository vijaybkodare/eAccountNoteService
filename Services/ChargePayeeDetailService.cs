using System.Data;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class ChargePayeeDetailService
{
    private readonly DapperService _dapperService;

    public ChargePayeeDetailService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<ChargePayeeDetail>> GetMemberPendingChargesAsync(int orgId, decimal accountId)
    {
        var sql = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.AccountId AS ItemAccountId, CO.Remark,
+                           CPD.*, IM.ItemName, AM.AccountName
+                    FROM ChargePayeeDetail CPD
+                    INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
+                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
+                    INNER JOIN AccountMaster AM ON AM.AccountId = CPD.AccountId AND AM.AccountType = 1
+                    WHERE CPD.Amount > CPD.PaidAmount
+                      AND AM.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Int32);

        if (accountId != -1)
        {
            sql += " AND AM.AccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        return await _dapperService.QueryAsync<ChargePayeeDetail>(sql, parameters);
    }

    public async Task<IEnumerable<ChargePayeeDetail>> GetRecordsAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
    {
        var sql = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.AccountId AS ItemAccountId, CO.Remark,
                           CPD.*, IM.ItemName, AM.AccountName
                    FROM ChargePayeeDetail CPD
                    INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                    INNER JOIN AccountMaster AM ON AM.AccountId = CPD.AccountId
                    WHERE AM.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (accountId != -1)
        {
            sql += " AND CPD.AccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

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

        sql += " ORDER BY CO.ChargeOrderNo";

        return await _dapperService.QueryAsync<ChargePayeeDetail>(sql, parameters);
    }

    public async Task<decimal> GetTotalPendingChargesAsync(decimal accountId, decimal itemAccountId, decimal[] chargePayeeDetails)
    {
        const string sqlBase = @"SELECT SUM(CPD.Amount - CPD.PaidAmount) AS TotalPending
+                                 FROM ChargePayeeDetail CPD
+                                 INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
+                                 WHERE CPD.AccountId = @AccountId
+                                   AND CO.AccountId = @ItemAccountId
+                                   AND CPD.ChargePayeeDetailId IN ({0})";

        if (chargePayeeDetails.Length == 0)
        {
            return 0m;
        }

        var idParams = string.Join(",", chargePayeeDetails.Select((_, i) => "@Id" + i));
        var sql = string.Format(sqlBase, idParams);

        var parameters = new DynamicParameters();
        parameters.Add("@AccountId", accountId, DbType.Decimal);
        parameters.Add("@ItemAccountId", itemAccountId, DbType.Decimal);
        for (int i = 0; i < chargePayeeDetails.Length; i++)
        {
            parameters.Add("@Id" + i, chargePayeeDetails[i], DbType.Decimal);
        }

        var result = await _dapperService.QuerySingleOrDefaultAsync<decimal?>(sql, parameters);
        return result ?? 0m;
    }

    public async Task<IEnumerable<ChargePayeeDetail>> GetPendingChargesAsync(decimal accountId, decimal itemAccountId, decimal[] chargePayeeDetails)
    {
        const string sqlBase = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.AccountId AS ItemAccountId, CO.Remark,
+                                       CPD.*, IM.ItemName, AM.AccountName
+                                FROM ChargePayeeDetail CPD
+                                INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
+                                INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
+                                INNER JOIN AccountMaster AM ON AM.AccountId = CPD.AccountId
+                                WHERE CPD.AccountId = @AccountId
+                                  AND CO.AccountId = @ItemAccountId
+                                  AND CPD.PaidAmount < CPD.Amount
+                                  AND CPD.ChargePayeeDetailId IN ({0})
+                                ORDER BY CPD.ChargePayeeDetailId";

        if (chargePayeeDetails.Length == 0)
        {
            return Enumerable.Empty<ChargePayeeDetail>();
        }

        var idParams = string.Join(",", chargePayeeDetails.Select((_, i) => "@Id" + i));
        var sql = string.Format(sqlBase, idParams);

        var parameters = new DynamicParameters();
        parameters.Add("@AccountId", accountId, DbType.Decimal);
        parameters.Add("@ItemAccountId", itemAccountId, DbType.Decimal);
        for (int i = 0; i < chargePayeeDetails.Length; i++)
        {
            parameters.Add("@Id" + i, chargePayeeDetails[i], DbType.Decimal);
        }

        return await _dapperService.QueryAsync<ChargePayeeDetail>(sql, parameters);
    }

    public async Task<DataTable> GetMemberAccountStatusAsync(decimal orgId, decimal accountId)
    {
        var query = @"SELECT AccountId, AccountName,
+                             SUM(Amount) AS Amount,
+                             SUM(PaidAmount) AS PaidAmount,
+                             SUM(Amount - PaidAmount) AS PendingAmount
+                      FROM (
+                          SELECT AM.AccountId, AM.AccountName, CPD.Amount, CPD.PaidAmount
+                              FROM ChargePayeeDetail CPD INNER JOIN AccountMaster AM
+                                  ON CPD.AccountId = AM.AccountId
+                              WHERE AM.OrgId = @OrgId AND AM.AccountType = 1 {0}
+                          UNION ALL
+                          SELECT AM.AccountId, AM.AccountName, 0 AS Amount, AC.Amount - AC.SettleAmount AS PaidAmount
+                              FROM AdvCharge AC INNER JOIN AccountMaster AM
+                                  ON AC.DrAccountId = AM.AccountId
+                              WHERE AM.OrgId = @OrgId AND AM.AccountType = 1 {1}
+                      ) AS RESULT
+                      GROUP BY AccountId, AccountName
+                      ORDER BY AccountName";

        string filter = accountId != -1 ? " AND AM.AccountId = @AccountId" : string.Empty;
        query = string.Format(query, filter, filter);

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);
        if (accountId != -1)
        {
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        return await _dapperService.QueryToDataTableAsync(query, parameters);
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> GenerateMemberAccountStatusCsvAsync(decimal orgId)
    {
        var dt = await GetMemberAccountStatusAsync(orgId, -1);

        using var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
        using (var csv = new CsvWriter(writer, CultureInfo.GetCultureInfo("en-US")))
        {
            csv.WriteField("AccountName");
            csv.WriteField("TotalAmount");
            csv.WriteField("PaidAmount");
            csv.WriteField("PendingAmount");
            csv.NextRecord();

            decimal totalAmount = 0;
            decimal totalPaidAmount = 0;
            decimal totalPendingAmount = 0;

            foreach (DataRow row in dt.Rows)
            {
                var accountName = row["AccountName"]?.ToString() ?? string.Empty;
                var amount = row["Amount"] != DBNull.Value ? Convert.ToDecimal(row["Amount"]) : 0m;
                var paidAmount = row["PaidAmount"] != DBNull.Value ? Convert.ToDecimal(row["PaidAmount"]) : 0m;
                var pendingAmount = row["PendingAmount"] != DBNull.Value ? Convert.ToDecimal(row["PendingAmount"]) : 0m;

                csv.WriteField(accountName);
                csv.WriteField(amount);
                csv.WriteField(paidAmount);
                csv.WriteField(pendingAmount);
                csv.NextRecord();

                totalAmount += amount;
                totalPaidAmount += paidAmount;
                totalPendingAmount += pendingAmount;
            }

            csv.WriteField("TOTAL");
            csv.WriteField(totalAmount);
            csv.WriteField(totalPaidAmount);
            csv.WriteField(totalPendingAmount);
            csv.NextRecord();

            writer.Flush();
        }

        var bytes = memoryStream.ToArray();
        return (bytes, "text/csv", "memberAccountStatus.csv");
    }
}
