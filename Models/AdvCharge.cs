namespace eAccountNoteService.Models;

public class AdvCharge
{
    public decimal OrgId { get; set; }
    public decimal AdvChargeId { get; set; }
    public string AdvChargeNo { get; set; } = string.Empty;
    public DateTime AdvChargeDt { get; set; }
    public decimal DrAccountId { get; set; }
    public decimal ItemId { get; set; }
    public decimal CrAccountId { get; set; }
    public decimal Amount { get; set; }
    public decimal SettleAmount { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;
    public string DrAccount { get; set; } = string.Empty;
    public string CrAccount { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public decimal Status { get; set; }
    public decimal RefType { get; set; }
    public decimal RefId { get; set; }
}
