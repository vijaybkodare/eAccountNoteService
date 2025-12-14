namespace eAccountNoteService.Models;

public class DonationDetail
{
    public decimal DonationDetailId { get; set; }
    public decimal DonationHeaderId { get; set; }
    public DateTime PaymentDt { get; set; }
    public decimal Amount { get; set; }
    public string Remark { get; set; } = string.Empty;
    public short TransMode { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public decimal DrAccountId { get; set; }
    public decimal CrAccountId { get; set; }
    public short RefType { get; set; }
    public decimal RefId { get; set; }
    public short Status { get; set; }
    public string ReconcRemark { get; set; } = string.Empty;
    public short ReconcStatus { get; set; }
    public decimal OrgId { get; set; }

    // Additional fields used in detail report queries
    public string DonationNo { get; set; } = string.Empty;
    public string HeaderRemark { get; set; } = string.Empty;
    public string DrAccount { get; set; } = string.Empty;
    public string CrAccount { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
}
