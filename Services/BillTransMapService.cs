using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class BillTransMapService
{
    private readonly DapperService _dapperService;

    public BillTransMapService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task mapBankStatementToBillTrans(decimal bankStatementId, decimal billPayTransId)
    {
        await _dapperService.ExecuteInTransactionAsync<bool>(async (connection, transaction) =>
        {
            const string bankStatementSql = @"SELECT *
                                             FROM BankStatement
                                             WHERE BankStatementId = @BankStatementId
                                               AND Status = 0";

            const string billPayTransSql = @"SELECT *
                                             FROM BillPayTrans
                                             WHERE BillPayTransId = @BillPayTransId
                                               AND ReconcStatus <> 1";

            var bankStatement = await connection.QuerySingleOrDefaultAsync<BankStatement>(
                bankStatementSql,
                new { BankStatementId = bankStatementId },
                transaction);

            var billPayTrans = await connection.QuerySingleOrDefaultAsync<BillPayTrans>(
                billPayTransSql,
                new { BillPayTransId = billPayTransId },
                transaction);

            if (bankStatement == null || billPayTrans == null)
            {
                throw new InvalidOperationException("Transactions to map are not valid");
            }

            if (-bankStatement.Amount != billPayTrans.Amount)
            {
                throw new InvalidOperationException("Transactions to map are not valid");
            }

            const string updateBankStatementSql = @"UPDATE BankStatement
                                                    SET RefId = @RefId,
                                                        Status = 1
                                                    WHERE BankStatementId = @BankStatementId";

            const string updateBillPayTransSql = @"UPDATE BillPayTrans
                                                   SET ReconcStatus = 1
                                                   WHERE BillPayTransId = @BillPayTransId";

            await connection.ExecuteAsync(
                updateBankStatementSql,
                new
                {
                    RefId = billPayTransId,
                    BankStatementId = bankStatementId
                },
                transaction);

            await connection.ExecuteAsync(
                updateBillPayTransSql,
                new { BillPayTransId = billPayTransId },
                transaction);

            return true;
        });
    }
}

