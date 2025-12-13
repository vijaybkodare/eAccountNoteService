using System.Collections.Generic;

namespace eAccountNoteService.Models;

public class ChargeOrder
{
    public decimal ChargeOrderId { get; set; }
    public decimal OrgId { get; set; }
    public string ChargeOrderNo { get; set; } = string.Empty;
    public DateTime ChargeDt { get; set; }
    public decimal ItemId { get; set; }
    public decimal AccountId { get; set; }
    public decimal Charges { get; set; }
    public decimal Amount { get; set; }
    public decimal PaidAmount { get; set; }
    public string Remark { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    // For now we omit ChargePayeeDetails details handling in the API implementation
}
