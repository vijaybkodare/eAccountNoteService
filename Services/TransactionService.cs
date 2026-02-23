using Dapper;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;
using System.Data;

namespace eAccountNoteService.Services;

public class TransactionService
{
    private readonly DapperService _dapperService;
    private readonly ReportUtility _reportUtility;

    public TransactionService(DapperService dapperService, ReportUtility reportUtility)
    {
        _dapperService = dapperService;
        _reportUtility = reportUtility;
    }

    public async Task<SummaryData> GetIncomeExpenseAsync(decimal orgId, string fromDate, string toDate)
    {
        var summary = new SummaryData();

        const string baseSql = @"SELECT ISNULL(SUM(TR.Amount), 0) AS Total
                                 FROM [Transaction] TR
                                 INNER JOIN AccountMaster AM ON AM.AccountId = TR.AccountId
                                 WHERE AM.OrgId = @OrgId
                                   AND TR.TransDt >= @FromDate
                                   AND TR.TransDt <= @ToDate";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);
        parameters.Add("@FromDate", fromDate, DbType.String);
        parameters.Add("@ToDate", toDate, DbType.String);

        var incomeSql = baseSql + " AND AM.AccountType = 1 AND TR.Amount < 0";
        var expenseSql = baseSql + " AND AM.AccountType = 4 AND TR.Amount > 0";

        summary.TotalIncome = Math.Abs(await _dapperService.QuerySingleOrDefaultAsync<decimal>(incomeSql, parameters));
        summary.TotalExpense = await _dapperService.QuerySingleOrDefaultAsync<decimal>(expenseSql, parameters);

        return summary;
    }

    public async Task<IReadOnlyList<PeriodIncomeExpense>> GetMonthlyIncomeExpenseAsync(decimal orgId, DateTime fromDate, DateTime toDate)
    {
        var result = new List<PeriodIncomeExpense>();

        DateTime currentDate = new DateTime(fromDate.Year, fromDate.Month, 1);
        DateTime endDate = new DateTime(toDate.Year, toDate.Month, toDate.Day);

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
                                       AND TR.TransDt >= @FromDate
                                       AND TR.TransDt <= @ToDate";

            var parameters = new DynamicParameters();
            parameters.Add("@OrgId", orgId, DbType.Decimal);
            parameters.Add("@FromDate", _reportUtility.getStartDate(monthStart), DbType.String);
            parameters.Add("@ToDate", _reportUtility.getEndDate(monthEnd), DbType.String);

            var incomeSql = baseSql + " AND AM.AccountType = 1 AND TR.Amount < 0";
            var expenseSql = baseSql + " AND AM.AccountType = 4 AND TR.Amount > 0";

            var income = await _dapperService.QuerySingleOrDefaultAsync<decimal>(incomeSql, parameters);
            var expense = await _dapperService.QuerySingleOrDefaultAsync<decimal>(expenseSql, parameters);

            result.Add(new PeriodIncomeExpense
            {
                TotalIncome = Math.Abs(income),
                TotalExpense = expense,
                Period = currentDate.ToString("MMM yy")
            });

            currentDate = currentDate.AddMonths(1);
        }

        return result;
    }
}
