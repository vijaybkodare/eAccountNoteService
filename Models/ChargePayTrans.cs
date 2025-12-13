namespace eAccountNoteService.Models;

public class ChargePayTrans
{
    public decimal ChargePayTransId { get; set; }
    public decimal ChargePayeeDetailId { get; set; }
    public DateTime PaymentDt { get; set; }
    public decimal Amount { get; set; }
    public string Remark { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public decimal DrAccountId { get; set; }
    public decimal CrAccountId { get; set; }
    public string ChargeOrderNo { get; set; } = string.Empty;
    public DateTime ChargeDt { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string ChargeRemark { get; set; } = string.Empty;
    public string DrAccount { get; set; } = string.Empty;
    public string CrAccount { get; set; } = string.Empty;
    public decimal RefType { get; set; }
    public decimal TransMode { get; set; }
    public decimal RefId { get; set; }
    public decimal Status { get; set; }
    public decimal OrgId { get; set; }
    public decimal Id { get; set; }
    public string Source { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    public DateTime AddedDt { get; set; }
}
