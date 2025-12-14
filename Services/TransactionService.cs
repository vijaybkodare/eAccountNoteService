using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class TransactionService
{
    private readonly DapperService _dapperService;

    public TransactionService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<SummaryData> GetIncomeExpenseAsync(decimal orgId, string fromDate, string toDate)
    {
        var summary = new SummaryData();

        const string baseSql = @"SELECT ISNULL(SUM(TR.Amount), 0) AS Total
                                 FROM [Transaction] TR
                                 INNER JOIN AccountMaster AM ON AM.AccountId = TR.AccountId
                                 WHERE AM.OrgId = @OrgId
                                   AND AM.AccountType = 2
                                   AND TR.TransDt >= @FromDate
                                   AND TR.TransDt <= @ToDate";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);
        parameters.Add("@FromDate", fromDate, DbType.String);
        parameters.Add("@ToDate", toDate, DbType.String);

        var incomeSql = baseSql + " AND TR.Amount > 0";
        var expenseSql = baseSql + " AND TR.Amount < 0";

        summary.TotalIncome = await _dapperService.QuerySingleOrDefaultAsync<decimal>(incomeSql, parameters);
        var totalExpense = await _dapperService.QuerySingleOrDefaultAsync<decimal>(expenseSql, parameters);
        summary.TotalExpense = totalExpense; // keep sign consistent with legacy (negative values)

        return summary;
    }

    public async Task<IReadOnlyList<PeriodIncomeExpense>> GetMonthlyIncomeExpenseAsync(decimal orgId, DateTime fromDate, DateTime toDate)
    {
        var result = new List<PeriodIncomeExpense>();

        DateTime currentDate = new DateTime(fromDate.Year, fromDate.Month, 1);
        DateTime endDate = new DateTime(toDate.Year, toDate.Month, 1);

        while (currentDate <= endDate)
        {
            DateTime monthStart = currentDate;
            DateTime monthEnd = monthStart.AddMonths(1).AddDays(-1);

            if (monthEnd > toDate)
                monthEnd = toDate;
            if (monthStart < fromDate)
                monthStart = fromDate;

            const string baseSql = @"SELECT ISNULL(SUM(TR.Amount), 0) AS Total
                                     FROM [Transaction] TR
                                     INNER JOIN AccountMaster AM ON AM.AccountId = TR.AccountId
                                     WHERE AM.OrgId = @OrgId
                                       AND AM.AccountType = 2
                                       AND TR.TransDt >= @FromDate
                                       AND TR.TransDt <= @ToDate";

            var parameters = new DynamicParameters();
            parameters.Add("@OrgId", orgId, DbType.Decimal);
            parameters.Add("@FromDate", monthStart.ToString("yyyy-MM-dd"), DbType.String);
            parameters.Add("@ToDate", monthEnd.ToString("yyyy-MM-dd"), DbType.String);

            var incomeSql = baseSql + " AND TR.Amount > 0";
            var expenseSql = baseSql + " AND TR.Amount < 0";

            var income = await _dapperService.QuerySingleOrDefaultAsync<decimal>(incomeSql, parameters);
            var expense = await _dapperService.QuerySingleOrDefaultAsync<decimal>(expenseSql, parameters);

            result.Add(new PeriodIncomeExpense
            {
                TotalIncome = income,
                TotalExpense = Math.Abs(expense),
                Period = currentDate.ToString("MMM yy")
            });

            currentDate = currentDate.AddMonths(1);
        }

        return result;
    }
}
