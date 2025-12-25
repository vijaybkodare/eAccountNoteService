using System.Data;
using Dapper;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Services;

public class ReconciliationService
{
    private readonly DapperService _dapperService;
    private readonly ReportUtility _reportUtility;
    private readonly BankStatementService _bankStatementService;

    public ReconciliationService(
        DapperService dapperService,
        ReportUtility reportUtility,
        BankStatementService bankStatementService)
    {
        _dapperService = dapperService;
        _reportUtility = reportUtility;
        _bankStatementService = bankStatementService;
    }

    public async Task<IEnumerable<ReconciliationItem>> GetRecordsAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate,
        int status = -1)
    {
        var sql = @"SELECT 'CPT' AS Source,
                             CPT.ChargePayTransId AS Id,
                             AM.AccountId,
                             AM.AccountName,
                             CPT.PaymentDt AS AddedDt,
                             CPT.Amount,
                             CPT.TransMode,
                             CPT.TransactionId,
                             CPT.Remark,
                             CPT.Status,
                             BM.Remark AS BMRemark,
                             CPT.ReconcRemark,
                             CPT.ReconcStatus
                      FROM ChargePayTrans CPT
                      INNER JOIN AccountMaster AM ON CPT.DrAccountId = AM.AccountId
                      INNER JOIN ChargePayeeDetail CPD ON CPD.ChargePayeeDetailId = CPT.ChargePayeeDetailId
                      INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                      LEFT OUTER JOIN BankStatement BM ON BM.RefType = 2 AND BM.RefId = CPT.ChargePayTransId
                      WHERE CO.OrgId = @OrgId
                        AND CPT.RefType = 0
                        AND CPT.TransMode <> 2
                        AND ( (@Status = -1 AND (CPT.Status = 0 OR CPT.Status = 1)) OR (@Status <> -1 AND CPT.Status = @Status) )
                        AND (@AccountId = -1 OR CPT.DrAccountId = @AccountId)
                        AND (@FromDate IS NULL OR CPT.PaymentDt >= @FromDate)
                        AND (@ToDate IS NULL OR CPT.PaymentDt <= @ToDate)

                      UNION ALL

                      SELECT 'CCPT' AS Source,
                             CCPT.CummulativeChargePayTransId AS Id,
                             AM.AccountId,
                             AM.AccountName,
                             CCPT.AddedDt AS AddedDt,
                             CCPT.Amount,
                             CCPT.TransMode,
                             CCPT.TransactionId,
                             CCPT.Remark,
                             CCPT.Status,
                             BM.Remark AS BMRemark,
                             CCPT.ReconcRemark,
                             CCPT.ReconcStatus
                      FROM CummulativeChargePayTrans CCPT
                      INNER JOIN AccountMaster AM ON AM.AccountId = CCPT.DrAccountId
                      LEFT OUTER JOIN BankStatement BM ON BM.RefType = 1 AND BM.RefId = CCPT.CummulativeChargePayTransId
                      WHERE CCPT.OrgId = @OrgId
                        AND CCPT.TransMode <> 2
                        AND ( (@Status = -1 AND (CCPT.Status = 0 OR CCPT.Status = 1)) OR (@Status <> -1 AND CCPT.Status = @Status) )
                        AND (@AccountId = -1 OR CCPT.DrAccountId = @AccountId)
                        AND (@FromDate IS NULL OR CCPT.AddedDt >= @FromDate)
                        AND (@ToDate IS NULL OR CCPT.AddedDt <= @ToDate)

                      UNION ALL

                      SELECT 'ADVC' AS Source,
                             ADVC.AdvChargeId AS Id,
                             AM.AccountId,
                             AM.AccountName,
                             ADVC.AdvChargeDt AS AddedDt,
                             ADVC.Amount,
                             0 AS TransMode,
                             ADVC.TransactionId,
                             ADVC.Remark,
                             ADVC.Status,
                             BM.Remark AS BMRemark,
                             ADVC.ReconcRemark,
                             ADVC.ReconcStatus
                      FROM AdvCharge ADVC
                      INNER JOIN AccountMaster AM ON AM.AccountId = ADVC.DrAccountId
                      LEFT OUTER JOIN BankStatement BM ON BM.RefType = 3 AND BM.RefId = ADVC.AdvChargeId
                      WHERE ADVC.OrgId = @OrgId
                        AND ( (@Status = -1 AND ADVC.Status = 0) OR (@Status <> -1 AND ADVC.Status = @Status) )
                        AND (@AccountId = -1 OR ADVC.DrAccountId = @AccountId)
                        AND (@FromDate IS NULL OR ADVC.AdvChargeDt >= @FromDate)
                        AND (@ToDate IS NULL OR ADVC.AdvChargeDt <= @ToDate)

                      ORDER BY AccountName, AddedDt";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);
        parameters.Add("@AccountId", accountId, DbType.Decimal);
        parameters.Add("@FromDate", string.IsNullOrWhiteSpace(fromDate) ? null : fromDate, DbType.String);
        parameters.Add("@ToDate", string.IsNullOrWhiteSpace(toDate) ? null : toDate, DbType.String);
        parameters.Add("@Status", status, DbType.Int32);

        return await _dapperService.QueryAsync<ReconciliationItem>(sql, parameters);
    }

    private async Task<DataTable> GetRecordsDataTableAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate,
        int status = -1)
    {
        var sql = @"SELECT 'CPT' AS Source,
                             CPT.ChargePayTransId AS Id,
                             AM.AccountId,
                             AM.AccountName,
                             CPT.PaymentDt AS AddedDt,
                             CPT.Amount,
                             CPT.TransMode,
                             CPT.TransactionId,
                             CPT.Remark,
                             CPT.Status,
                             BM.Remark AS BMRemark,
                             CPT.ReconcRemark,
                             CPT.ReconcStatus
                      FROM ChargePayTrans CPT
                      INNER JOIN AccountMaster AM ON CPT.DrAccountId = AM.AccountId
                      INNER JOIN ChargePayeeDetail CPD ON CPD.ChargePayeeDetailId = CPT.ChargePayeeDetailId
                      INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                      LEFT OUTER JOIN BankStatement BM ON BM.RefType = 2 AND BM.RefId = CPT.ChargePayTransId
                      WHERE CO.OrgId = @OrgId
                        AND CPT.RefType = 0
                        AND CPT.TransMode <> 2
                        AND ( (@Status = -1 AND (CPT.Status = 0 OR CPT.Status = 1)) OR (@Status <> -1 AND CPT.Status = @Status) )
                        AND (@AccountId = -1 OR CPT.DrAccountId = @AccountId)
                        AND (@FromDate IS NULL OR CPT.PaymentDt >= @FromDate)
                        AND (@ToDate IS NULL OR CPT.PaymentDt <= @ToDate)

                      UNION ALL

                      SELECT 'CCPT' AS Source,
                             CCPT.CummulativeChargePayTransId AS Id,
                             AM.AccountId,
                             AM.AccountName,
                             CCPT.AddedDt AS AddedDt,
                             CCPT.Amount,
                             CCPT.TransMode,
                             CCPT.TransactionId,
                             CCPT.Remark,
                             CCPT.Status,
                             BM.Remark AS BMRemark,
                             CCPT.ReconcRemark,
                             CCPT.ReconcStatus
                      FROM CummulativeChargePayTrans CCPT
                      INNER JOIN AccountMaster AM ON AM.AccountId = CCPT.DrAccountId
                      LEFT OUTER JOIN BankStatement BM ON BM.RefType = 1 AND BM.RefId = CCPT.CummulativeChargePayTransId
                      WHERE CCPT.OrgId = @OrgId
                        AND CCPT.TransMode <> 2
                        AND ( (@Status = -1 AND (CCPT.Status = 0 OR CCPT.Status = 1)) OR (@Status <> -1 AND CCPT.Status = @Status) )
                        AND (@AccountId = -1 OR CCPT.DrAccountId = @AccountId)
                        AND (@FromDate IS NULL OR CCPT.AddedDt >= @FromDate)
                        AND (@ToDate IS NULL OR CCPT.AddedDt <= @ToDate)

                      UNION ALL

                      SELECT 'ADVC' AS Source,
                             ADVC.AdvChargeId AS Id,
                             AM.AccountId,
                             AM.AccountName,
                             ADVC.AdvChargeDt AS AddedDt,
                             ADVC.Amount,
                             0 AS TransMode,
                             ADVC.TransactionId,
                             ADVC.Remark,
                             ADVC.Status,
                             BM.Remark AS BMRemark,
                             ADVC.ReconcRemark,
                             ADVC.ReconcStatus
                      FROM AdvCharge ADVC
                      INNER JOIN AccountMaster AM ON AM.AccountId = ADVC.DrAccountId
                      LEFT OUTER JOIN BankStatement BM ON BM.RefType = 3 AND BM.RefId = ADVC.AdvChargeId
                      WHERE ADVC.OrgId = @OrgId
                        AND ( (@Status = -1 AND ADVC.Status = 0) OR (@Status <> -1 AND ADVC.Status = @Status) )
                        AND (@AccountId = -1 OR ADVC.DrAccountId = @AccountId)
                        AND (@FromDate IS NULL OR ADVC.AdvChargeDt >= @FromDate)
                        AND (@ToDate IS NULL OR ADVC.AdvChargeDt <= @ToDate)

                      ORDER BY AccountName, AddedDt";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);
        parameters.Add("@AccountId", accountId, DbType.Decimal);
        parameters.Add("@FromDate", string.IsNullOrWhiteSpace(fromDate) ? null : fromDate, DbType.String);
        parameters.Add("@ToDate", string.IsNullOrWhiteSpace(toDate) ? null : toDate, DbType.String);
        parameters.Add("@Status", status, DbType.Int32);

        return await _dapperService.QueryToDataTableAsync(sql, parameters);
    }

    public async Task<(byte[] Content, string FileName)> GenerateReconciliationReportPdfAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate)
    {
        var data = await GetRecordsDataTableAsync(orgId, accountId, fromDate, toDate, -1);
        var filter = await _reportUtility.GetReportFilterAsync(accountId, fromDate, toDate);

        return await _reportUtility.GenerateReportPdfAsync(
            data,
            "Reconciliation",
            orgId,
            "ReconciliationReportNew.frx",
            "Transactions Reconciliation Report",
            filter);
    }

    public async Task<(byte[] Content, string FileName)> ProcessReconciliationAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate,
        bool useStoredBankStatement,
        Stream? fileStream = null,
        string? fileName = null)
    {
        if (useStoredBankStatement)
        {
            await RunBankReconciliationAsync(orgId, accountId, fromDate, toDate);
        }

        // For uploaded files (Excel-based reconciliation), the detailed logic from
        // legacy ProcessReconciliation(orgId, accountId, fromDate, toDate, file)
        // has not yet been ported. For now we still return the main reconciliation report.

        return await GenerateReconciliationReportPdfAsync(orgId, accountId, fromDate, toDate);
    }

    private async Task RunBankReconciliationAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate)
    {
        // Pull pending app transactions (status = 0) using existing union query
        var appItems = (await GetRecordsAsync(orgId, accountId, fromDate, toDate, status: 0)).ToList();

        // Pull pending bank statement records (status = 0), no header filter on id
        var bankItems = (await _bankStatementService
            .GetRecordsAsync(id: -1, orgId: orgId, fromDate: fromDate, toDate: toDate, status: 0, remark: null))
            .ToList();

        // Local state flags mirroring legacy DataTable columns Done/Process
        var appStates = appItems.Select(i => new ReconciliationAppState
        {
            Item = i,
            Process = false,
            Done = false
        }).ToList();

        var bankStates = bankItems.Select(b => new ReconciliationBankState
        {
            Item = b,
            Process = false,
            Done = false
        }).ToList();

        const string UPDATE_RECOC_REMARK = "UPDATE {0} SET ReconcRemark = @ReconcRemark WHERE {1} = @Id";
        const string RECONC_REMARK_AMOUNT_MISMATCH = "Reconciliation mismatch with Amount: {0} != {1}";
        const string RECONC_REMARK_TRANSID_PROCESSED = "Reconciliation failed. TransactionId: {0} is already processed.";
        const string RECONC_REMARK_TRANSID_EXIST_MULTIPLE = "Reconciliation failed. TransactionId: {0} is exitst multiple times in Bank Statement.";

        await _dapperService.ExecuteInTransactionAsync<object>(async (connection, transaction) =>
        {
            foreach (var app in appStates)
            {
                var drApp = app.Item;

                // Skip TransMode == 1 like legacy code
                if (drApp.TransMode == 1)
                {
                    continue;
                }

                if (app.Process)
                {
                    continue;
                }

                string tableName;
                string tableId;
                switch (drApp.Source)
                {
                    case "CCPT":
                        tableName = "CummulativeChargePayTrans";
                        tableId = "CummulativeChargePayTransId";
                        break;
                    case "CPT":
                        tableName = "ChargePayTrans";
                        tableId = "ChargePayTransId";
                        break;
                    case "ADVC":
                        tableName = "AdvCharge";
                        tableId = "AdvChargeId";
                        break;
                    default:
                        continue;
                }

                var ids = (drApp.TransactionId ?? string.Empty).Split(',');
                var transNo = ids.Length > 0 ? ids[0] : string.Empty;
                var utrNo = ids.Length > 1 ? ids[1] : string.Empty;

                IEnumerable<ReconciliationBankState> candidateBank;
                if (string.IsNullOrEmpty(utrNo))
                {
                    candidateBank = bankStates.Where(b => b.Item.TransactionId == transNo);
                }
                else
                {
                    candidateBank = bankStates.Where(b =>
                        b.Item.TransactionId == transNo || b.Item.TransactionId == utrNo);
                }

                var candidates = candidateBank.ToList();

                if (candidates.Count > 1)
                {
                    foreach (var bank in candidates)
                    {
                        bank.Process = true;
                        bank.Done = false;
                    }

                    var reconcRemark = string.Format(RECONC_REMARK_TRANSID_EXIST_MULTIPLE, drApp.TransactionId ?? string.Empty);
                    await UpdateReconciliationRemarkAsync(connection, transaction, tableName, tableId, drApp.Id, reconcRemark, UPDATE_RECOC_REMARK);

                    app.Process = true;
                    app.Done = false;
                    continue;
                }

                if (candidates.Count == 1)
                {
                    var bank = candidates[0];

                    if (bank.Process)
                    {
                        var reconcRemark = string.Format(RECONC_REMARK_TRANSID_PROCESSED, drApp.TransactionId ?? string.Empty);
                        await UpdateReconciliationRemarkAsync(connection, transaction, tableName, tableId, drApp.Id, reconcRemark, UPDATE_RECOC_REMARK);

                        app.Process = true;
                        app.Done = false;
                        continue;
                    }

                    if (drApp.Amount == bank.Item.Amount)
                    {
                        app.Done = true;
                        bank.Done = true;

                        decimal refType = drApp.Source == "CCPT" ? 1m : drApp.Source == "CPT" ? 2m : drApp.Source == "ADVC" ? 3m : 0m;

                        if (refType != 0m)
                        {
                            await BankStatementService.UpdateReconciliationStatusAsync(
                                bankStatementId: bank.Item.BankStatementId,
                                refType: refType,
                                refId: drApp.Id,
                                status: 1m,
                                connection: connection,
                                transaction: transaction);
                        }
                    }
                    else
                    {
                        var reconcRemark = string.Format(RECONC_REMARK_AMOUNT_MISMATCH, drApp.Amount, bank.Item.Amount);
                        await UpdateReconciliationRemarkAsync(connection, transaction, tableName, tableId, drApp.Id, reconcRemark, UPDATE_RECOC_REMARK);

                        app.Done = false;
                        bank.Done = false;
                    }

                    app.Process = true;
                    bank.Process = true;
                }
            }

            return null!;
        });
    }

    private static async Task UpdateReconciliationRemarkAsync(
        IDbConnection connection,
        IDbTransaction transaction,
        string tableName,
        string idColumnName,
        decimal id,
        string reconcRemark,
        string updateTemplate)
    {
        var sql = string.Format(updateTemplate, tableName, idColumnName);
        var parameters = new DynamicParameters();
        parameters.Add("@ReconcRemark", reconcRemark, DbType.String);
        parameters.Add("@Id", id, DbType.Decimal);

        await connection.ExecuteAsync(sql, parameters, transaction, commandType: CommandType.Text);
    }

    private sealed class ReconciliationAppState
    {
        public ReconciliationItem Item { get; set; } = default!;
        public bool Process { get; set; }
        public bool Done { get; set; }
    }

    private sealed class ReconciliationBankState
    {
        public BankStatement Item { get; set; } = default!;
        public bool Process { get; set; }
        public bool Done { get; set; }
    }
}
