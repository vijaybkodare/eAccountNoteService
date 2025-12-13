namespace eAccountNoteService.Models;

public class BankStatementHeader
{
    public decimal BankStatementHeaderId { get; set; }
    public int OrgId { get; set; }
    public int BankId { get; set; }
    public string BankStatementNo { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;
    public string WorksheetName { get; set; } = string.Empty;
    public DateTime FromDt { get; set; }
    public DateTime ToDt { get; set; }
    public DateTime AddedDt { get; set; }
    public IEnumerable<BankStatement>? Details { get; set; }
}
