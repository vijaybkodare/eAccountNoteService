namespace eAccountNoteService.Models;

public class SummaryData
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal TotalBalance { get; set; }
    public decimal TotalChargePaid { get; set; }
    public decimal TotalChargeUnpaid { get; set; }
    public decimal TotalBillPaid { get; set; }
    public decimal TotalBillUnpaid { get; set; }
    public decimal TotalChargeAmount { get; set; }
    public List<PeriodIncomeExpense> PeriodIncomeExpenses { get; set; } = new();
}

public class PeriodIncomeExpense
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public string Period { get; set; } = string.Empty;
}
