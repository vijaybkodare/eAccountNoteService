using System.Data;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class BillOrderService
{
    private readonly DapperService _dapperService;

    public BillOrderService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<BillOrder> GetRecordAsync(decimal billOrderId, decimal orgId)
    {
        const string sql = @"SELECT BO.*, AM1.AccountName, AM2.AccountName AS BankAccount, IM.ItemName
+                             FROM BillOrder BO
+                             INNER JOIN AccountMaster AM1 ON AM1.AccountId = BO.AccountId
+                             INNER JOIN AccountMaster AM2 ON AM2.AccountId = BO.BankAccountId
+                             INNER JOIN ItemMaster IM ON IM.ItemId = BO.ItemId
+                             WHERE BO.BillOrderId = @BillOrderId";

        var entity = await _dapperService.QuerySingleOrDefaultAsync<BillOrder>(sql, new { BillOrderId = billOrderId });
        if (entity == null)
        {
            entity = new BillOrder
            {
                BillOrderId = -1,
                OrgId = orgId,
                BillNo = await GetOrderNoAsync(orgId),
                BillDt = DateTime.Now
            };
        }
        return entity;
    }

    public async Task<IEnumerable<BillOrder>> GetRecordsAsync(decimal orgId)
    {
        const string sql = @"SELECT BO.*, AM1.AccountName, AM2.AccountName AS BankAccount, IM.ItemName
+                             FROM BillOrder BO
+                             INNER JOIN AccountMaster AM1 ON AM1.AccountId = BO.AccountId
+                             INNER JOIN AccountMaster AM2 ON AM2.AccountId = BO.BankAccountId
+                             INNER JOIN ItemMaster IM ON IM.ItemId = BO.ItemId
+                             WHERE BO.OrgId = @OrgId
+                             ORDER BY BO.BillOrderId DESC";

        return await _dapperService.QueryAsync<BillOrder>(sql, new { OrgId = orgId });
    }

    public async Task<bool> AddUpdateAsync(BillOrder entity)
    {
        if (entity.BillOrderId == -1)
        {
            entity.BillNo = await GetOrderNoAsync(entity.OrgId);
            return await AddAsync(entity);
        }
        else
        {
            return await UpdateAsync(entity);
        }
    }

    private async Task<bool> AddAsync(BillOrder entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", entity.OrgId, DbType.Int32);
        parameters.Add("@BillNo", entity.BillNo, DbType.String);
        parameters.Add("@ItemId", entity.ItemId, DbType.Int32);
        parameters.Add("@AccountId", entity.AccountId, DbType.Int32);
        parameters.Add("@BankAccountId", entity.BankAccountId, DbType.Int32);
        parameters.Add("@Amount", entity.Amount, DbType.Decimal);
        parameters.Add("@Remark", entity.Remark, DbType.String);
        parameters.Add("@FilePath", entity.FilePath ?? string.Empty, DbType.String);

        var rows = await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_BillOrder", parameters);
        return rows > 0;
    }

    private async Task<bool> UpdateAsync(BillOrder entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@BillOrderId", entity.BillOrderId, DbType.Int32);
        parameters.Add("@ItemId", entity.ItemId, DbType.Int32);
        parameters.Add("@AccountId", entity.AccountId, DbType.Int32);
        parameters.Add("@BankAccountId", entity.BankAccountId, DbType.Int32);
        parameters.Add("@Amount", entity.Amount, DbType.Decimal);
        parameters.Add("@Remark", entity.Remark, DbType.String);

        var rows = await _dapperService.ExecuteStoredProcedureAsync("Proc_Update_BillOrder", parameters);
        return rows > 0;
    }

    private async Task<string> GetOrderNoAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 BillNo
+                             FROM BillOrder
+                             WHERE OrgId = @OrgId
+                             ORDER BY BillOrderId DESC";

        var lastNo = await _dapperService.QuerySingleOrDefaultAsync<string>(sql, new { OrgId = orgId });
        if (string.IsNullOrWhiteSpace(lastNo))
        {
            lastNo = "BL000";
        }

        var numericPart = 0m;
        if (lastNo.Length > 2)
        {
            decimal.TryParse(lastNo.Substring(2), out numericPart);
        }

        var nextNo = numericPart + 1;
        return $"BL{nextNo:000}";
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> GenerateBillReportCsvAsync(decimal orgId)
    {
        var list = (await GetRecordsAsync(orgId)).ToList();

        using var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
        using (var csv = new CsvWriter(writer, CultureInfo.GetCultureInfo("en-US")))
        {
            // Header row: BillNo,BillDt,ItemName,AccountName,Amount,PaidAmount,Remark
            csv.WriteField("BillNo");
            csv.WriteField("BillDt");
            csv.WriteField("ItemName");
            csv.WriteField("AccountName");
            csv.WriteField("Amount");
            csv.WriteField("PaidAmount");
            csv.WriteField("Remark");
            csv.NextRecord();

            decimal totalAmount = 0;
            decimal totalPaidAmount = 0;

            foreach (var item in list)
            {
                csv.WriteField(item.BillNo);
                csv.WriteField(item.BillDt.ToString("yyyy-MM-dd"));
                csv.WriteField(item.ItemName);
                csv.WriteField(item.AccountName);
                csv.WriteField(item.Amount);
                csv.WriteField(item.PaidAmount);
                csv.WriteField(item.Remark);
                csv.NextRecord();

                totalAmount += item.Amount;
                totalPaidAmount += item.PaidAmount;
            }

            // Total row similar to legacy implementation
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.WriteField("TOTAL");
            csv.WriteField(totalAmount);
            csv.WriteField(totalPaidAmount);
            csv.WriteField(string.Empty);
            csv.NextRecord();

            writer.Flush();
        }

        var bytes = memoryStream.ToArray();
        return (bytes, "text/csv", "billReport.csv");
    }
}
