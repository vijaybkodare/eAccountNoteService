using System.Collections.Generic;

namespace eAccountNoteService.Models;

public class AccountDto
{
    public AccountMaster? AccountMaster { get; set; }
    public List<AccountTransToken> AccountTransTokens { get; set; } = new();
    public List<ChargePayeeDetail> ChargePayeeDetails { get; set; } = new();
    public decimal Weight { get; set; }
}
