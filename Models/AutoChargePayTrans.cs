using System.Collections.Generic;

namespace eAccountNoteService.Models;

public class AutoChargePayTrans
{
    public BankStatement? BankStatement { get; set; }
    public List<AccountDto> AccountDtos { get; set; } = new();
}
