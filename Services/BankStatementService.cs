using System.Data;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;
using Dapper;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Services;

public class BankStatementService
{
    private readonly DapperService _dapperService;
    private readonly ReportUtility _reportUtility;

    public BankStatementService(DapperService dapperService, ReportUtility reportUtility)
    {
        _dapperService = dapperService;
        _reportUtility = reportUtility;
    }

    public async Task<IEnumerable<BankStatement>> GetRecordsAsync(
        decimal id,
        decimal orgId,
        string? fromDate,
        string? toDate,
        int status,
        string? remark = null,
        int amountFlag = 0)
    {
        var sql = @"SELECT BSH.BankStatementHeaderId, BSH.OrgId, BSH.BankStatementNo,
                             BSH.BankId, BSH.AddedDt, BSH.FromDt, BSH.ToDt,
                             BS.TransDt, BS.BankStatementId,
                             BS.Amount, BS.Remark, BS.TransactionId, BS.Balance,
                             BS.RefType, BS.RefId, BS.Status,
                             COALESCE(am_ccpt.AccountName, am_cpt.AccountName, am_ac.AccountName) AS DR_Account,
                             COALESCE(am_ccpt_cr.AccountName, am_cpt_cr.AccountName, am_ac_cr.AccountName, am_bp_cr.AccountName) AS CR_Account
                      FROM BankStatement BS
                      INNER JOIN BankStatementHeader BSH ON BSH.BankStatementHeaderId = BS.BankStatementHeaderId
                      LEFT OUTER JOIN CummulativeChargePayTrans ccpt ON BS.RefType = 2 AND ccpt.CummulativeChargePayTransId = BS.RefId 
                      LEFT OUTER JOIN ChargePayTrans cpt ON BS.RefType = 1 AND cpt.ChargePayTransId = BS.RefId
                      LEFT OUTER JOIN AdvCharge ac ON BS.RefType = 3 AND ac.AdvChargeId = BS.RefId
                      LEFT OUTER JOIN BillPayTrans bpt ON BS.RefType = 0 AND bpt.BillPayTransId = BS.RefId 
                      LEFT OUTER JOIN AccountMaster am_ccpt ON ccpt.DrAccountId = am_ccpt.AccountId 
                      LEFT OUTER JOIN AccountMaster am_cpt ON cpt.DrAccountId = am_cpt.AccountId
                      LEFT OUTER JOIN AccountMaster am_ac ON ac.DrAccountId = am_ac.AccountId
                      LEFT OUTER JOIN AccountMaster am_ccpt_cr ON ccpt.CrAccountId = am_ccpt_cr.AccountId 
                      LEFT OUTER JOIN AccountMaster am_cpt_cr ON cpt.CrAccountId = am_cpt_cr.AccountId
                      LEFT OUTER JOIN AccountMaster am_ac_cr ON ac.CrAccountId = am_ac_cr.AccountId
                      LEFT OUTER JOIN AccountMaster am_bp_cr ON bpt.CrAccountId = am_bp_cr.AccountId
                      WHERE 1=1";

        var parameters = new DynamicParameters();

        if (orgId != -1)
        {
            sql += " AND BSH.OrgId = @OrgId";
            parameters.Add("@OrgId", orgId, DbType.Decimal);
        }
        if (id != -1)
        {
            sql += " AND BSH.BankStatementHeaderId = @HeaderId";
            parameters.Add("@HeaderId", id, DbType.Decimal);
        }
        if (status != -1)
        {
            sql += " AND BS.Status = @Status";
            parameters.Add("@Status", status, DbType.Int32);
        }
        if (!string.IsNullOrWhiteSpace(fromDate) && id == -1)
        {
            sql += " AND BS.TransDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(toDate) && id == -1)
        {
            sql += " AND BS.TransDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(remark))
        {
            sql += " AND BS.Remark LIKE @Remark";
            parameters.Add("@Remark", "%" + remark + "%", DbType.String);
        }

        if (amountFlag == 1)
        {
            sql += " AND BS.Amount >= 0";
        }
        else if (amountFlag == -1)
        {
            sql += " AND BS.Amount < 0";
        }
        sql += " ORDER BY BS.BankStatementId DESC";
        return await _dapperService.QueryAsync<BankStatement>(sql, parameters);
    }

    public async Task<bool> AddRecordAsync(BankStatement entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@BankStatementHeaderId", entity.BankStatementHeaderId, DbType.Decimal);
        parameters.Add("@TransDt", entity.TransDt, DbType.DateTime);
        parameters.Add("@Amount", entity.Amount, DbType.Decimal);
        parameters.Add("@Remark", entity.Remark ?? string.Empty, DbType.String);
        parameters.Add("@TransactionId", entity.TransactionId ?? string.Empty, DbType.String);
        parameters.Add("@Balance", entity.Balance, DbType.Decimal);
        parameters.Add("@RefType", entity.RefType, DbType.Decimal);
        parameters.Add("@RefId", entity.RefId, DbType.Decimal);
        parameters.Add("@Status", entity.Status, DbType.Decimal);

        var rows = await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_BankStatement", parameters);
        return rows > 0;
    }

    private DataTable ConvertToDataTable(IEnumerable<BankStatement> items)
    {
        var dt = new DataTable("BankStatement");
        dt.Columns.Add("TransDt", typeof(DateTime));
        dt.Columns.Add("Remark", typeof(string));
        dt.Columns.Add("TransactionId", typeof(string));
        dt.Columns.Add("Amount", typeof(decimal));
        dt.Columns.Add("Balance", typeof(decimal));
        dt.Columns.Add("DR_Account", typeof(string));
        dt.Columns.Add("CR_Account", typeof(string));
        dt.Columns.Add("Status", typeof(decimal));

        foreach (var item in items)
        {
            dt.Rows.Add(
                item.TransDt,
                item.Remark ?? string.Empty,
                item.TransactionId ?? string.Empty,
                item.Amount,
                item.Balance,
                item.DR_Account ?? string.Empty,
                item.CR_Account ?? string.Empty,
                item.Status
            );
        }
        return dt;
    }

    public Task<(byte[] Content, string ContentType, string FileName)> GenerateStatementCsvAsync(
        IEnumerable<BankStatement> records)
    {
        var list = records.ToList();

        using var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
        using (var csv = new CsvWriter(writer, CultureInfo.GetCultureInfo("en-US")))
        {
            csv.WriteField("TransDt");
            csv.WriteField("Remark");
            csv.WriteField("Amount");
            csv.WriteField("TransactionId");
            csv.WriteField("Status");
            csv.WriteField("DR Account");
            csv.WriteField("CR Account");
            csv.NextRecord();

            decimal totalCredit = 0;
            decimal totalDebit = 0;

            foreach (var item in list)
            {
                csv.WriteField(item.TransDt);
                csv.WriteField(item.Remark);
                csv.WriteField(item.Amount);
                csv.WriteField(item.TransactionId);
                csv.WriteField(item.Status == 1 ? "Mapped" : "Not Mapped");
                csv.WriteField(item.DR_Account ?? string.Empty);
                csv.WriteField(item.CR_Account ?? string.Empty);
                csv.NextRecord();

                if (item.Amount < 0)
                {
                    totalDebit += -item.Amount;
                }
                else
                {
                    totalCredit += item.Amount;
                }
            }

            csv.WriteField(string.Empty);
            csv.WriteField("Total Credit");
            csv.WriteField(totalCredit);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.NextRecord();

            csv.WriteField(string.Empty);
            csv.WriteField("Total Debit");
            csv.WriteField(totalDebit);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.NextRecord();

            csv.WriteField(string.Empty);
            csv.WriteField("Credit - Debit");
            csv.WriteField(totalCredit - totalDebit);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.NextRecord();

            writer.Flush();
        }

        var bytes = memoryStream.ToArray();
        return Task.FromResult((bytes, "text/csv", "bankStatement.csv"));
    }

    public static async Task UpdateReconciliationStatusAsync(
        decimal bankStatementId,
        decimal refType,
        decimal refId,
        decimal status,
        IDbConnection connection,
        IDbTransaction transaction)
    {
        var parameters = new DynamicParameters();
        parameters.Add("BankStatementId", bankStatementId, DbType.Decimal);
        parameters.Add("RefType", refType, DbType.Decimal);
        parameters.Add("RefId", refId, DbType.Decimal);
        parameters.Add("Status", status, DbType.Decimal);

        await connection.ExecuteAsync(
            "Proc_Update_ReconciliationStatus",
            parameters,
            transaction,
            commandType: CommandType.StoredProcedure);
    }

    public async Task<(byte[] Content, string FileName)> GenerateBankStatementReportPdfAsync(
        IEnumerable<BankStatement> records,
        decimal orgId,
        string fromDate,
        string toDate,
        int status = -1,
        string? remark = null,
        int transType = 0,
        string reportFile = "BankStatementMapping.frx")
    {
        var filter = await _reportUtility.GetReportFilterAsync(-1, fromDate, toDate);

        var extraFilters = new List<string>();

        if (status == 1)
            extraFilters.Add("Mapped");
        else if (status == 0)
            extraFilters.Add("Not Mapped");

        if (transType == 1)
            extraFilters.Add("Credit(CR)");
        else if (transType == -1)
            extraFilters.Add("Debit(DR)");

        if (!string.IsNullOrWhiteSpace(remark))
            extraFilters.Add($"Remark: {remark}");

        if (extraFilters.Count > 0)
        {
            if (string.IsNullOrEmpty(filter))
                filter = string.Join(", ", extraFilters);
            else
                filter += ", " + string.Join(", ", extraFilters);
        }

        var data = ConvertToDataTable(records);

        return await _reportUtility.GenerateReportPdfAsync(
            data,
            "BankStatement",
            orgId,
            reportFile,
            "Bank Statement Report",
            filter);
    }

    public async Task<(byte[] Content, string FileName)> GenerateSingleBankStatementReportPdfAsync(
        decimal id,
        decimal orgId)
    {
        const string headerSql = @"SELECT TOP 1 BankStatementNo
                                  FROM BankStatementHeader
                                  WHERE BankStatementHeaderId = @HeaderId AND OrgId = @OrgId";

        var bankStatementNo = await _dapperService.QuerySingleOrDefaultAsync<string>(
            headerSql,
            new { HeaderId = id, OrgId = orgId });

        var filter = string.IsNullOrWhiteSpace(bankStatementNo)
            ? string.Empty
            : "Bank Statement: " + bankStatementNo;

        var records = await GetRecordsAsync(id: id, orgId: orgId, fromDate: null, toDate: null, status: -1, remark: null, amountFlag: 0);

        var data = ConvertToDataTable(records);

        return await _reportUtility.GenerateReportPdfAsync(
            data,
            "BankStatement",
            orgId,
            "BankStatement.frx",
            "Bank Statement Report",
            filter);
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> DownloadBankStatMapRepAsync(
        decimal orgId,
        string fromDate,
        string toDate,
        int status,
        int transType,
        string? remark,
        string repType)
    {
        var records = await GetRecordsAsync(id: -1, orgId: orgId, fromDate: fromDate, toDate: toDate, status: status, remark: remark, amountFlag: transType);

        if (repType.Equals("csv", StringComparison.OrdinalIgnoreCase))
        {
            var csvResult = await GenerateStatementCsvAsync(records);
            return csvResult;
        }
        else
        {
            var pdfResult = await GenerateBankStatementReportPdfAsync(records, orgId, fromDate, toDate, status, remark, transType, "BankStatementMapping.frx");
            return (pdfResult.Content, "application/pdf", pdfResult.FileName);
        }
    }
}
