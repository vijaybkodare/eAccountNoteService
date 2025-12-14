using System.Data;

namespace eAccountNoteService.Models;

public class DonationHeader
{
    public decimal DonationHeaderId { get; set; }
    public decimal OrgId { get; set; }
    public string DonationNo { get; set; } = string.Empty;
    public DateTime DonationDt { get; set; }
    public decimal ItemId { get; set; }
    public decimal AccountId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    // For detail grid compatibility with legacy DataTable shape
    public DataTable? Details { get; set; }
}
