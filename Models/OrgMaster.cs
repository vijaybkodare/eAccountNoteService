namespace eAccountNoteService.Models;

public class OrgMaster
{
    public decimal OrgId { get; set; }
    public string OrgName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string MonthlyMaintItem { get; set; } = string.Empty;
    public decimal CutOffWeightInTransToken { get; set; }
    public string DefaultBankForBillPay { get; set; } = string.Empty;
    public bool AllowChargePayment { get; set; }
    public bool AllowAdvancePayment { get; set; }
}
