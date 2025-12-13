namespace eAccountNoteService.Models;

public class JVOrder
{
    public decimal JVOrderId { get; set; }
    public int OrgId { get; set; }
    public decimal DrAccountId { get; set; }
    public decimal CrAccountId { get; set; }
    public decimal Amount { get; set; }
    public DateTime AddedDt { get; set; }
    public string Remark { get; set; } = string.Empty;
    public string JVOrderNo { get; set; } = string.Empty;
    public string DrAccount { get; set; } = string.Empty;
    public string CrAccount { get; set; } = string.Empty;
}
