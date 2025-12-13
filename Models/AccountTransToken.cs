namespace eAccountNoteService.Models;

public class AccountTransToken
{
    public decimal AccountId { get; set; }
    public int TokenTypeId { get; set; }
    public string TokenName { get; set; } = string.Empty;
    public string TokenValue { get; set; } = string.Empty;
    public int TokenWeight { get; set; }
    public bool IsMatch { get; set; }
}
