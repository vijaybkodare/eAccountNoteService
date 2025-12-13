namespace eAccountNoteService.Models;

public class MLEntity
{
    public decimal AccountId { get; set; }
    public string AccountName { get; set; } = string.Empty;
    public string RawToken { get; set; } = string.Empty;
    public List<MLToken> Tokens { get; set; } = new();
    public int Weight { get; set; }
    public decimal PendingAmount { get; set; }
}
