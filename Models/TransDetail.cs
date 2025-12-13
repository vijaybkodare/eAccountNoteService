namespace eAccountNoteService.Models;

public class TransDetail
{
    public decimal Amount { get; set; }
    public string Remark { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
}
