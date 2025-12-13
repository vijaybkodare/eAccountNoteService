namespace eAccountNoteService.Models;

public class BillOrder
{
    public decimal BillOrderId { get; set; }
    public decimal OrgId { get; set; }
    public string BillNo { get; set; } = string.Empty;
    public DateTime BillDt { get; set; }
    public decimal ItemId { get; set; }
    public decimal AccountId { get; set; }
    public decimal Amount { get; set; }
    public decimal PaidAmount { get; set; }
    public string Remark { get; set; } = string.Empty;
    public decimal BankAccountId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    public string BankAccount { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
}
