namespace eAccountNoteService.Models;

public class BillPayTrans
{
    public decimal BillPayTransId { get; set; }
    public decimal BillOrderId { get; set; }
    public DateTime PaymentDt { get; set; }
    public decimal Amount { get; set; }
    public string Remark { get; set; } = string.Empty;
    public string BillRemark { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public decimal DrAccountId { get; set; }
    public decimal CrAccountId { get; set; }
    public decimal Status { get; set; }
    public decimal RefType { get; set; }
    public decimal RefId { get; set; }
    public string DrAccount { get; set; } = string.Empty;
    public string CrAccount { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string BillNo { get; set; } = string.Empty;
    public DateTime BillDt { get; set; }
    public decimal BillAmount { get; set; }
    public decimal BillPaidAmount { get; set; }
    public decimal ReconcStatus { get; set; }
}
