using System;
using System.Collections.Generic;

namespace eAccountNoteService.Models;

public class UserMaster
{
    public decimal OrgId { get; set; }
    public decimal UserId { get; set; }
    public decimal ProfileId { get; set; }
    public string LoginId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string MobileNo { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime AddedDt { get; set; }
    public string OrgName { get; set; } = string.Empty;
    public decimal RoleId { get; set; }
    public List<AccountMaster>? Accounts { get; set; }
    public string AccessKey { get; set; } = string.Empty;
    public decimal AccountId { get; set; }
    public string Address { get; set; } = string.Empty;
}
