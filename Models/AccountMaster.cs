namespace eAccountNoteService.Models;

public class AccountMaster
{
    public decimal OrgId { get; set; }
    public decimal AccountId { get; set; }
    public int AccountType { get; set; }
    public string AccountName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public bool Active { get; set; }
    public decimal PendingAmount { get; set; }
    public decimal PaidAmount { get; set; }
}
