using System;

namespace eAccountNoteService.Models;

public class ReconciliationItem
{
    public string Source { get; set; } = string.Empty;
    public decimal Id { get; set; }
    public decimal AccountId { get; set; }
    public string AccountName { get; set; } = string.Empty;
    public DateTime AddedDt { get; set; }
    public decimal Amount { get; set; }
    public int TransMode { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;
    public int Status { get; set; }
    public string? BMRemark { get; set; }
    public string? ReconcRemark { get; set; }
    public int ReconcStatus { get; set; }
}
