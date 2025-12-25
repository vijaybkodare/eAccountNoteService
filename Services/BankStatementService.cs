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

    public async Task<IEnumerable<BankStatement>> GetRecordsAsync(decimal id, decimal orgId, string? fromDate, string? toDate, int status, string? remark = null)
    {
        var sql = @"SELECT BSH.BankStatementHeaderId, BSH.OrgId, BSH.BankStatementNo,
                             BSH.BankId, BSH.AddedDt, BSH.FromDt, BSH.ToDt,
                            BS.TransDt, BS.BankStatementId,
                             BS.Amount, BS.Remark, BS.TransactionId, BS.Balance,
                             BS.RefType, BS.RefId, BS.Status
                      FROM BankStatement BS
                      INNER JOIN BankStatementHeader BSH ON BSH.BankStatementHeaderId = BS.BankStatementHeaderId
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

    public async Task<(byte[] Content, string ContentType, string FileName)> GenerateStatementCsvAsync(
        decimal orgId,
        string fromDate,
        string toDate,
        int status,
        string? remark = null)
    {
        var records = await GetRecordsAsync(id: -1, orgId: orgId, fromDate: fromDate, toDate: toDate, status: status, remark: remark);
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
            csv.NextRecord();

            csv.WriteField(string.Empty);
            csv.WriteField("Total Debit");
            csv.WriteField(totalDebit);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.NextRecord();

            csv.WriteField(string.Empty);
            csv.WriteField("Credit - Debit");
            csv.WriteField(totalCredit - totalDebit);
            csv.WriteField(string.Empty);
            csv.WriteField(string.Empty);
            csv.NextRecord();

            writer.Flush();
        }

        var bytes = memoryStream.ToArray();
        return (bytes, "text/csv", "bankStatement.csv");
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

    // Core generator used by both range and single-header reports. Mirrors legacy GetRecords: data
    // query remains the same; only the reportFilter string differs.
    private async Task<(byte[] Content, string FileName)> GenerateBankStatementReportPdfCoreAsync(
        decimal id,
        decimal orgId,
        string? fromDate,
        string? toDate,
        string filter)
    {
        var sql = @"SELECT BSH.BankStatementHeaderId, BSH.OrgId, BSH.BankStatementNo,
                             BSH.BankId, BSH.AddedDt, BSH.FromDt, BSH.ToDt,
                             BS.TransDt, BS.BankStatementId,
                             BS.Amount, BS.Remark, BS.TransactionId, BS.Balance,
                             BS.RefType, BS.RefId, BS.Status
                      FROM BankStatement BS
                      INNER JOIN BankStatementHeader BSH ON BSH.BankStatementHeaderId = BS.BankStatementHeaderId
                      WHERE 1 = 1";

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
        else
        {
            if (!string.IsNullOrWhiteSpace(fromDate))
            {
                sql += " AND BS.TransDt >= @FromDate";
                parameters.Add("@FromDate", fromDate, DbType.String);
            }
            if (!string.IsNullOrWhiteSpace(toDate))
            {
                sql += " AND BS.TransDt <= @ToDate";
                parameters.Add("@ToDate", toDate, DbType.String);
            }
        }

        var data = await _dapperService.QueryToDataTableAsync(sql, parameters);

        return await _reportUtility.GenerateReportPdfAsync(
            data,
            "BankStatement",
            orgId,
            "BankStatement.frx",
            "Bank Statement Report",
            filter);
    }

    public async Task<(byte[] Content, string FileName)> GenerateBankStatementReportPdfAsync(
        decimal orgId,
        string fromDate,
        string toDate)
    {
        var filter = await _reportUtility.GetReportFilterAsync(-1, fromDate, toDate);

        return await GenerateBankStatementReportPdfCoreAsync(
            id: -1,
            orgId: orgId,
            fromDate: fromDate,
            toDate: toDate,
            filter: filter);
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

        return await GenerateBankStatementReportPdfCoreAsync(
            id: id,
            orgId: orgId,
            fromDate: null,
            toDate: null,
            filter: filter);
    }
}
