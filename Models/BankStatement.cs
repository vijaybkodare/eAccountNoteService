namespace eAccountNoteService.Models;

public class BankStatement
{
    public decimal BankStatementId { get; set; }
    public decimal BankStatementHeaderId { get; set; }
    public int OrgId { get; set; }
    public int BankId { get; set; }
    public DateTime TransDt { get; set; }
    public string TransType { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Balance { get; set; }
    public int RefType { get; set; }
    public decimal RefId { get; set; }
    public int Status { get; set; }
}
