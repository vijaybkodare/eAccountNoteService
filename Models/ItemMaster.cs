namespace eAccountNoteService.Models;

public class ItemMaster
{
    public decimal ItemId { get; set; }
    public decimal OrgId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public decimal AccountId { get; set; }
    public bool Active { get; set; }
    public string AccountName { get; set; } = string.Empty;
}
