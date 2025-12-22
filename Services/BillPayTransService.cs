using System.Data;
using System.IO;
using Dapper;
using FastReport;
using FastReport.Export.PdfSimple;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class BillPayTransService
{
    private readonly DapperService _dapperService;

    public BillPayTransService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<(bool Success, string ErrorMessage)> AddAsync(BillPayTrans entity)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(entity.TransactionId))
            {
                entity.TransactionId = "N.A.";
            }

            var parameters = new DynamicParameters();
            parameters.Add("@RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);
            parameters.Add("@BillOrderId", entity.BillOrderId, DbType.Int32);
            parameters.Add("@Amount", entity.Amount, DbType.Decimal);
            parameters.Add("@Remark", entity.Remark ?? string.Empty, DbType.String);
            parameters.Add("@TransactionId", entity.TransactionId, DbType.String);
            parameters.Add("@DrAccountId", entity.DrAccountId, DbType.Decimal);
            parameters.Add("@CrAccountId", entity.CrAccountId, DbType.Decimal);
            parameters.Add("@Status", entity.Status, DbType.Int32);
            parameters.Add("@RefType", entity.RefType, DbType.Int32);
            parameters.Add("@RefId", entity.RefId, DbType.Decimal);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_BillPayTrans", parameters);

            entity.BillPayTransId = parameters.Get<decimal>("@RecordId");
            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<IEnumerable<BillPayTrans>> GetRecordsToRevertAsync(decimal orgId, decimal accountId, string? fromDate, string? toDate)
    {
        var sql = @"SELECT BO.BillNo, BO.Remark AS BillRemark, BO.BillDt, BPT.*,
                           AM1.AccountName AS DrAccount, AM2.AccountName AS CrAccount, IM.ItemName
                    FROM BillPayTrans BPT
                    INNER JOIN AccountMaster AM1 ON AM1.AccountId = BPT.DrAccountId
                    INNER JOIN AccountMaster AM2 ON AM2.AccountId = BPT.CrAccountId
                    INNER JOIN BillOrder BO ON BO.BillOrderId = BPT.BillOrderId
                    INNER JOIN ItemMaster IM ON IM.ItemId = BO.ItemId
                    WHERE BPT.Status = 0 AND BO.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (accountId != -1)
        {
            sql += " AND BPT.DrAccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }
        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND BPT.PaymentDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND BPT.PaymentDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY BPT.BillPayTransId DESC";

        return await _dapperService.QueryAsync<BillPayTrans>(sql, parameters);
    }

    public async Task<(bool Success, string ErrorMessage)> RevertAsync(decimal id)
    {
        try
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BillPayTransId", id, DbType.Decimal);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Revert_BillPayTrans", parameters);
            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<DataTable> GetExpenseReportDataAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
    {
        var sql = @"SELECT AM.AccountId, AM.AccountName, IM.ItemName, BO.BillNo, BO.Remark AS BORemark,
                            BPT.PaymentDt, BPT.Amount, BPT.Remark
                     FROM BillPayTrans BPT
                     INNER JOIN BillOrder BO ON BO.BillOrderId = BPT.BillOrderId
                     INNER JOIN AccountMaster AM ON AM.AccountId = BO.AccountId
                     INNER JOIN ItemMaster IM ON IM.ItemId = BO.ItemId
                     WHERE BO.OrgId = @OrgId
                       AND BPT.Status = 0";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (accountId != -1)
        {
            sql += " AND BO.AccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }
        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND BPT.PaymentDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND BPT.PaymentDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        return await _dapperService.QueryToDataTableAsync(sql, parameters);
    }

    public async Task<(byte[] Content, string FileName)> GenerateExpenseReportPdfAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate,
        string reportPath)
    {
        var data = await GetExpenseReportDataAsync(orgId, accountId, fromDate, toDate);

        using var report = new Report();
        report.Load(reportPath);

        report.RegisterData(data, "MyDS");

        report.Prepare();
        using var ms = new MemoryStream();
        using (var pdfExport = new PDFSimpleExport())
        {
            pdfExport.Export(report, ms);
            ms.Position = 0;
            var fileName = $"ExpenseReport_{DateTime.Now:yyyyMMddHHmmss}.pdf";
            return (ms.ToArray(), fileName);
        }
    }
}
