using System.Data;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class ChargePayTransService
{
    private readonly DapperService _dapperService;

    public ChargePayTransService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<ChargePayTrans>> GetAllRecordsAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
        => await GetRecordsAsync(orgId, status: -1, refId: -1, accountId, fromDate, toDate);

    public async Task<IEnumerable<ChargePayTrans>> GetNormalRecordsAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
        => await GetRecordsAsync(orgId, status: 0, refId: -1, accountId, fromDate, toDate);

    public async Task<IEnumerable<ChargePayTrans>> GetRecordsAsync(
        decimal orgId,
        int status,
        int refId,
        decimal accountId,
        string? fromDate,
        string? toDate)
    {
        var sql = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.Remark AS ChargeRemark, CPT.*,
                           AMDr.AccountName AS DrAccount, AMCr.AccountName AS CrAccount, IM.ItemName
                    FROM ChargePayTrans CPT
                    INNER JOIN AccountMaster AMDr ON CPT.DrAccountId = AMDr.AccountId
                    INNER JOIN AccountMaster AMCr ON CPT.CrAccountId = AMCr.AccountId
                    INNER JOIN ChargePayeeDetail CPD ON CPD.ChargePayeeDetailId = CPT.ChargePayeeDetailId
                    INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                    WHERE CO.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (status != -1)
        {
            sql += " AND CPT.Status = @Status";
            parameters.Add("@Status", status, DbType.Int32);
        }

        if (refId != -1)
        {
            sql += " AND CPT.RefId = @RefId";
            parameters.Add("@RefId", refId, DbType.Int32);
        }

        if (accountId != -1)
        {
            sql += " AND CPT.DrAccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND CPT.PaymentDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }

        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND CPT.PaymentDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY CPT.ChargePayTransId DESC";

        return await _dapperService.QueryAsync<ChargePayTrans>(sql, parameters);
    }

    public async Task<IEnumerable<ChargePayTrans>> GetRecordsToRevertAsync(decimal orgId, decimal accountId, string? fromDate, string? toDate)
    {
        var sql = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.Remark AS ChargeRemark, CPT.*,
+                           AMDr.AccountName AS DrAccount, AMCr.AccountName AS CrAccount, IM.ItemName
+                    FROM ChargePayTrans CPT
+                    INNER JOIN AccountMaster AMDr ON CPT.DrAccountId = AMDr.AccountId
+                    INNER JOIN AccountMaster AMCr ON CPT.CrAccountId = AMCr.AccountId
+                    INNER JOIN ChargePayeeDetail CPD ON CPD.ChargePayeeDetailId = CPT.ChargePayeeDetailId
+                    INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
+                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
+                    WHERE CO.OrgId = @OrgId AND CPT.Status = 0";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (accountId != -1)
        {
            sql += " AND CPT.DrAccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }
        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND CPT.PaymentDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND CPT.PaymentDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY CPT.ChargePayTransId DESC";

        return await _dapperService.QueryAsync<ChargePayTrans>(sql, parameters);
    }

    public async Task<(bool Success, string ErrorMessage)> RevertAsync(decimal id)
    {
        try
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ChargePayTransId", id, DbType.Decimal);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Revert_ChargePayTrans", parameters);
            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> GenerateChargePayTransCsvAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate)
    {
        var records = await GetAllRecordsAsync(orgId, accountId, fromDate, toDate);

        using var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
        using (var csv = new CsvWriter(writer, CultureInfo.GetCultureInfo("en-US")))
        {
            // Header
            csv.WriteField("DrAccount");
            csv.WriteField("ChargeOrderNo");
            csv.WriteField("PaymentDt");
            csv.WriteField("ItemName");
            csv.WriteField("CrAccount");
            csv.WriteField("TransactionId");
            csv.WriteField("Amount");
            csv.WriteField("TransMode");
            csv.WriteField("Remark");
            csv.NextRecord();

            foreach (var item in records)
            {
                csv.WriteField(item.DrAccount);
                csv.WriteField(item.ChargeOrderNo);
                csv.WriteField(item.PaymentDt);
                csv.WriteField(item.ItemName);
                csv.WriteField(item.CrAccount);
                csv.WriteField(item.TransactionId);
                csv.WriteField(item.Amount);
                csv.WriteField(item.TransMode);
                csv.WriteField(item.Remark);
                csv.NextRecord();
            }

            writer.Flush();
        }

        var bytes = memoryStream.ToArray();
        return (bytes, "text/csv", "chargePayTrans.csv");
    }
}
