namespace eAccountNoteService.Models;

public class CummulativeChargePayTrans
{
    public decimal CummulativeChargePayTransId { get; set; }
    public decimal OrgId { get; set; }
    public DateTime AddedDt { get; set; }
    public decimal Amount { get; set; }
    public string Remark { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public decimal AccountId { get; set; }
    public decimal DrAccountId { get; set; }
    public decimal CrAccountId { get; set; }
    public string DrAccount { get; set; } = string.Empty;
    public string CrAccount { get; set; } = string.Empty;
    public decimal Status { get; set; }
    public decimal RefType { get; set; }
    public decimal RefId { get; set; }
    public decimal TransMode { get; set; }
    public decimal[] ChargePayeeDetailIds { get; set; } = Array.Empty<decimal>();
    public decimal BankStatementId { get; set; }
}
