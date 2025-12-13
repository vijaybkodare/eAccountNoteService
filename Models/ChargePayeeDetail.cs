namespace eAccountNoteService.Models;

public class ChargePayeeDetail
{
    public string ItemName { get; set; } = string.Empty;
    public string ChargeOrderNo { get; set; } = string.Empty;
    public DateTime ChargeDt { get; set; }
    public decimal ChargePayeeDetailId { get; set; }
    public decimal ChargeOrderId { get; set; }
    public decimal AccountId { get; set; }
    public decimal ItemAccountId { get; set; }
    public decimal Amount { get; set; }
    public decimal PaidAmount { get; set; }
    public string AccountName { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;
}
