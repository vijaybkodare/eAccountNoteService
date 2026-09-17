namespace eAccountNoteService.Models;

public class UserOrgDto
{
    public decimal OrgId { get; set; }
    public string OrgName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public decimal? ProfileId { get; set; }
    public decimal? RoleId { get; set; }
}

public class SaveUserOrgsRequest
{
    public decimal UserId { get; set; }
    public List<decimal> OrgIds { get; set; } = new List<decimal>();
}

public class UserWithOrgCountDto
{
    public decimal UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string LoginId { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public decimal? RoleId { get; set; }
    public int OrgCount { get; set; }
}
