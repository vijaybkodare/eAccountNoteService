using System.Data;
using Dapper;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Services;

public class ChargeTransMapService
{
    private readonly DapperService _dapperService;
    private readonly BankStatementService _bankStatementService;
    private readonly ReconciliationService _reconciliationService;
    private readonly MLAutoTrans2Service _mlAutoTrans2Service;
    private readonly AppSettingService _appSettingService;
    private readonly TransNoEvaluator _transNoEvaluator;

    public ChargeTransMapService(
        DapperService dapperService,
        BankStatementService bankStatementService,
        ReconciliationService reconciliationService,
        MLAutoTrans2Service mlAutoTrans2Service,
        AppSettingService appSettingService,
        TransNoEvaluator transNoEvaluator)
    {
        _dapperService = dapperService;
        _bankStatementService = bankStatementService;
        _reconciliationService = reconciliationService;
        _mlAutoTrans2Service = mlAutoTrans2Service;
        _appSettingService = appSettingService;
        _transNoEvaluator = transNoEvaluator;
    }

    public async Task<IEnumerable<BankStatement>> GetBankStatementsAsync(decimal orgId, string fromDate, string toDate, decimal accountId)
    {
        var records = (await _bankStatementService.GetRecordsAsync(
            id: -1,
            orgId: orgId,
            fromDate: fromDate,
            toDate: toDate,
            status: 0,
            remark: null,
            amountFlag: 1)).ToList(); // 1 for inflow/income

        if (accountId != -1)
        {
            var cutOff = await _appSettingService.GetNumberValueAsync((int)orgId, "CutoffWeightInTransToken");
            if (cutOff == 0) cutOff = 7;

            var accountDtos = await _mlAutoTrans2Service.GetAccountDtosAsync((int)orgId, accountId, addCharges: false);
            var filteredRecords = new List<BankStatement>();

            foreach (var bankStatement in records)
            {
                decimal maxWeight = 0;
                foreach (var accountDto in accountDtos)
                {
                    decimal weight = 0;
                    foreach (var token in accountDto.AccountTransTokens)
                    {
                        if (System.Text.RegularExpressions.Regex.IsMatch(bankStatement.Remark ?? string.Empty, token.TokenValue, System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                        {
                            weight += token.TokenWeight;
                        }
                    }
                    if (maxWeight < weight) maxWeight = weight;
                }

                if (maxWeight > cutOff)
                {
                    filteredRecords.Add(bankStatement);
                }
            }
            return filteredRecords;
        }

        return records;
    }

    public async Task<IEnumerable<ReconciliationItem>> GetChargeTransactionsAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
    {
        var records = await _reconciliationService.GetRecordsAsync(
            orgId: orgId,
            accountId: accountId,
            fromDate: fromDate,
            toDate: toDate,
            status: 0);

        return records.Where(x => x.ReconcStatus == 0).OrderByDescending(x => x.AddedDt);
    }

    public async Task mapBankStatementToChargeTrans(decimal bankStatementId, decimal chargePayTransId, string source)
    {
        await _dapperService.ExecuteInTransactionAsync<bool>(async (connection, transaction) =>
        {
            const string bankStatementSql = @"SELECT *
                                             FROM BankStatement
                                             WHERE BankStatementId = @BankStatementId
                                               AND Status = 0";

            var bankStatement = await connection.QuerySingleOrDefaultAsync<BankStatement>(
                bankStatementSql,
                new { BankStatementId = bankStatementId },
                transaction);

            if (bankStatement == null)
            {
                throw new InvalidOperationException("Bank Statement item is not valid or already mapped");
            }

            string tableName;
            string idColumn;
            decimal refType;

            switch (source)
            {
                case "CPT":
                    tableName = "ChargePayTrans";
                    idColumn = "ChargePayTransId";
                    refType = 2;
                    break;
                case "CCPT":
                    tableName = "CummulativeChargePayTrans";
                    idColumn = "CummulativeChargePayTransId";
                    refType = 1;
                    break;
                case "ADVC":
                    tableName = "AdvCharge";
                    idColumn = "AdvChargeId";
                    refType = 3;
                    break;
                default:
                    throw new InvalidOperationException("Invalid source");
            }

            string appTransSql = $@"SELECT * FROM {tableName} WHERE {idColumn} = @Id";
            var appTrans = await connection.QuerySingleOrDefaultAsync<dynamic>(
                appTransSql,
                new { Id = chargePayTransId },
                transaction);

            if (appTrans == null)
            {
                throw new InvalidOperationException("App Transaction not found");
            }

            if (bankStatement.Amount != (decimal)appTrans.Amount)
            {
                throw new InvalidOperationException("Amount mismatch");
            }

            // Check if TransactionId already exists using TransNoEvaluator
            if (await _transNoEvaluator.IsTransactionIdExistAsync(bankStatement.OrgId, bankStatement.TransactionId, chargePayTransId, source))
            {
                throw new InvalidOperationException("TransactionId is already mapped");
            }

            // Update BankStatement
            await BankStatementService.UpdateReconciliationStatusAsync(
                bankStatementId: bankStatementId,
                refType: refType,
                refId: chargePayTransId,
                status: 1,
                connection: connection,
                transaction: transaction);

            // Update App Transaction table (ChargePayTrans, CCPT, or ADVC)
            // SET Status = 1 and TransactionId. 
            // Note: ReconcStatus = 1 is already handled by the Proc_Update_ReconciliationStatus called via UpdateReconciliationStatusAsync.
            string updateAppSql = $@"UPDATE {tableName}
                                    SET Status = 1, TransactionId = @TransactionId
                                    WHERE {idColumn} = @Id";

            await connection.ExecuteAsync(
                updateAppSql,
                new { Id = chargePayTransId, TransactionId = bankStatement.TransactionId },
                transaction);

            return true;
        });
    }
}
