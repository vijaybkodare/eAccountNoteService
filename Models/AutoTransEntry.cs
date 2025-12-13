namespace eAccountNoteService.Models;

public class AutoTransEntry
{
    public decimal OrgId { get; set; }
    public decimal BankStatementId { get; set; }
    public decimal AccountId { get; set; }
    public string Remark { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal Amount { get; set; }
    public decimal PendingAmount { get; set; }
}
