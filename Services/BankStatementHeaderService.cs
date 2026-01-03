using Dapper;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;
using System.Data;
using System.Globalization;
using System.IO;
using static Dapper.SqlMapper;

namespace eAccountNoteService.Services;

public class BankStatementHeaderService
{
    private readonly DapperService _dapperService;
    private readonly BankStatementService _bankStatementService;

    public BankStatementHeaderService(DapperService dapperService, BankStatementService bankStatementService)
    {
        _dapperService = dapperService;
        _bankStatementService = bankStatementService;
    }

    public async Task<BankStatementHeader> GetRecordAsync(decimal id, decimal orgId)
    {
        const string sql = @"SELECT * FROM BankStatementHeader WHERE BankStatementHeaderId = @Id";

        var header = await _dapperService.QuerySingleOrDefaultAsync<BankStatementHeader>(sql, new { Id = id });
        if (header == null)
        {
            header = new BankStatementHeader
            {
                BankStatementHeaderId = -1,
                OrgId = (int)orgId,
                BankStatementNo = await GetOrderNoAsync(orgId),
                AddedDt = DateTime.Now
            };
        }
        else
        {
            var details = await _bankStatementService.GetRecordsAsync(id, -1, null, null, -1, null);
            header.Details = details;
        }

        return header;
    }

    public async Task<IEnumerable<BankStatementHeader>> GetRecordsAsync(decimal orgId)
    {
        const string sql = @"SELECT * FROM BankStatementHeader WHERE OrgId = @OrgId";
        return await _dapperService.QueryAsync<BankStatementHeader>(sql, new { OrgId = orgId });
    }

    public async Task<bool> SaveAsync(BankStatementHeader entity)
    {
        if (entity.BankStatementHeaderId == -1 && string.IsNullOrWhiteSpace(entity.BankStatementNo))
        {
            entity.BankStatementNo = await GetOrderNoAsync(entity.OrgId);
        }

        var parameters = new DynamicParameters();
        parameters.Add("@BankStatementHeaderId", entity.BankStatementHeaderId, DbType.Decimal);
        parameters.Add("@OrgId", entity.OrgId, DbType.Int32);
        parameters.Add("@BankId", entity.BankId, DbType.Int32);
        parameters.Add("@BankStatementNo", entity.BankStatementNo, DbType.String);
        parameters.Add("@Remark", entity.Remark ?? string.Empty, DbType.String);
        parameters.Add("@WorksheetName", entity.WorksheetName ?? string.Empty, DbType.String);
        parameters.Add("@FromDt", entity.FromDt, DbType.DateTime);
        parameters.Add("@ToDt", entity.ToDt, DbType.DateTime);
        parameters.Add("@AddedDt", entity.AddedDt, DbType.DateTime);

        const string sql = @"IF @BankStatementHeaderId = -1
                             BEGIN
                                 INSERT INTO BankStatementHeader
                                     (OrgId, BankId, BankStatementNo, Remark, WorksheetName, FromDt, ToDt, AddedDt)
                                 VALUES
                                     (@OrgId, @BankId, @BankStatementNo, @Remark, @WorksheetName, @FromDt, @ToDt, @AddedDt)
                             END
                             ELSE
                             BEGIN
                                 UPDATE BankStatementHeader
                                 SET OrgId = @OrgId,
                                     BankId = @BankId,
                                     BankStatementNo = @BankStatementNo,
                                     Remark = @Remark,
                                     WorksheetName = @WorksheetName,
                                     FromDt = @FromDt,
                                     ToDt = @ToDt,
                                     AddedDt = @AddedDt
                                 WHERE BankStatementHeaderId = @BankStatementHeaderId
                             END";

        var rows = await _dapperService.ExecuteAsync(sql, parameters);
        return rows > 0;
    }

    public async Task<bool> UploadBankStatementAsync(BankStatementHeader header, Stream fileStream)
    {
        const string NOTRANSNOFOUND = "NoTransNoFound";
        var table = ExcelUtility.ReadExcelInDataTable(fileStream, header.WorksheetName);
        if (table == null || table.Rows.Count == 0)
        {
            return false;
        }

        // Validate required columns
        string[] requiredColumns = { "Date", "Amount", "Remark", "Balance" };
        foreach (var col in requiredColumns)
        {
            if (!table.Columns.Contains(col))
            {
                throw new InvalidOperationException($"Required column '{col}' not found in Excel file.");
            }
        }

        if (!table.Columns.Contains("TransactionId"))
        {
            table.Columns.Add("TransactionId", typeof(string));
        }
        if (!table.Columns.Contains("Process"))
        {
            table.Columns.Add(new DataColumn("Process", typeof(bool)) { DefaultValue = false });
        }

        var evaluator = new TransNoEvaluator(_dapperService);
        evaluator.EvaluateTransactionId(table, "Remark", "TransactionId");

        return await _dapperService.ExecuteInTransactionAsync<bool>(async (connection, transaction) =>
        {
            header.BankStatementNo = await GetOrderNoAsync(header.OrgId);
            header.AddedDt = DateTime.Now;

            var headerParameters = new DynamicParameters();
            headerParameters.Add("BankStatementNo", header.BankStatementNo, DbType.String);
            headerParameters.Add("OrgId", header.OrgId, DbType.Decimal);
            headerParameters.Add("BankId", header.BankId, DbType.Decimal);
            headerParameters.Add("Remark", header.Remark ?? string.Empty, DbType.String);
            headerParameters.Add("AddedDt", header.AddedDt, DbType.DateTime);
            headerParameters.Add("FromDt", header.FromDt, DbType.DateTime);
            headerParameters.Add("ToDt", header.ToDt, DbType.DateTime);
            headerParameters.Add("RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "Proc_Insert_BankStatementHeader",
                headerParameters,
                transaction,
                commandType: CommandType.StoredProcedure);

            var headerId = headerParameters.Get<decimal>("RecordId");

            foreach (DataRow row in table.Rows)
            {
                var transDtText = row["Date"]?.ToString() ?? string.Empty;
                var amountText = row["Amount"]?.ToString() ?? "0";
                var balanceText = table.Columns.Contains("Balance") ? row["Balance"]?.ToString() ?? "0" : "0";
                string transactionId = row["TransactionId"]?.ToString() ?? string.Empty;
                string remark = row["Remark"]?.ToString() ?? string.Empty;

                var transDt = DateTime.Parse(transDtText, CultureInfo.InvariantCulture);
                var amount = decimal.Parse(amountText, CultureInfo.InvariantCulture);
                var balance = decimal.Parse(balanceText, CultureInfo.InvariantCulture);

                if(transactionId == string.Empty || transactionId == NOTRANSNOFOUND)
                {
                    Guid guid = Guid.NewGuid();
                    transactionId = guid.ToString("N");
                    remark += ":" + transactionId;
                }

                var detailParameters = new DynamicParameters();
                detailParameters.Add("BankStatementHeaderId", headerId, DbType.Decimal);
                detailParameters.Add("TransDt", transDt, DbType.DateTime);
                detailParameters.Add("Amount", amount, DbType.Decimal);
                detailParameters.Add("Remark", remark, DbType.String);
                detailParameters.Add("TransactionId", transactionId, DbType.String);
                detailParameters.Add("Balance", balance, DbType.Decimal);
                detailParameters.Add("RefType", 0m, DbType.Decimal);
                detailParameters.Add("RefId", 0m, DbType.Decimal);
                detailParameters.Add("Status", 0m, DbType.Decimal);

                await connection.ExecuteAsync(
                    "Proc_Insert_BankStatement",
                    detailParameters,
                    transaction,
                    commandType: CommandType.StoredProcedure);
            }

            return true;
        });
    }

    private async Task<string> GetOrderNoAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 BankStatementNo
                             FROM BankStatementHeader
                             WHERE OrgId = @OrgId
                             ORDER BY BankStatementHeaderId DESC";

        var lastNo = await _dapperService.QuerySingleOrDefaultAsync<string>(sql, new { OrgId = orgId });
        if (string.IsNullOrWhiteSpace(lastNo))
        {
            lastNo = "BNKST000";
        }

        var numericPart = 0m;
        if (lastNo.Length > 5)
        {
            decimal.TryParse(lastNo.Substring(5), out numericPart);
        }

        var nextNo = numericPart + 1;
        return $"BNKST{nextNo:000}";
    }
}
