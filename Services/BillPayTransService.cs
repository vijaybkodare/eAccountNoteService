using System.Data;
using Dapper;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Services;

public class BillPayTransService
{
    private readonly DapperService _dapperService;
    private readonly ReportUtility _reportUtility;

    public BillPayTransService(DapperService dapperService, ReportUtility reportUtility)
    {
        _dapperService = dapperService;
        _reportUtility = reportUtility;
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

    public async Task<IEnumerable<BillPayTrans>> getRecordsAsync(
        decimal orgId,
        decimal accountId,
        string? fromDate,
        string? toDate,
        int status,
        int reconcStatus = -1)
    {
        var sql = @"SELECT BO.BillNo, BO.Remark AS BillRemark, BO.BillDt, BO.Amount AS BillAmount, BO.PaidAmount AS BillPaidAmount, BPT.*,
                           AM1.AccountName AS DrAccount, AM2.AccountName AS CrAccount, IM.ItemName
                    FROM BillPayTrans BPT
                    INNER JOIN AccountMaster AM1 ON AM1.AccountId = BPT.DrAccountId
                    INNER JOIN AccountMaster AM2 ON AM2.AccountId = BPT.CrAccountId
                    INNER JOIN BillOrder BO ON BO.BillOrderId = BPT.BillOrderId
                    INNER JOIN ItemMaster IM ON IM.ItemId = BO.ItemId
                    WHERE BO.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (status != -1)
        {
            sql += " AND BPT.Status = @Status";
            parameters.Add("@Status", status, DbType.Int32);
        }

        if (reconcStatus != -1)
        {
            sql += " AND BPT.ReconcStatus = @ReconcStatus";
            parameters.Add("@ReconcStatus", reconcStatus, DbType.Int32);
        }

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

    public async Task<IEnumerable<BillPayTrans>> GetRecordsToRevertAsync(decimal orgId, decimal accountId, string? fromDate, string? toDate)
    {
        return await getRecordsAsync(orgId, accountId, fromDate, toDate, 0);
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
        string toDate)
    {
        var data = await GetExpenseReportDataAsync(orgId, accountId, fromDate, toDate);

        var filter = await _reportUtility.GetReportFilterAsync(accountId, fromDate, toDate);

        return await _reportUtility.GenerateReportPdfAsync(
            data,
            "AccountExpense",
            orgId,
            "ExpenseReport.frx",
            "Expense Report",
            filter);
    }
}
