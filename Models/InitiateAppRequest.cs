namespace eAccountNoteService.Models;

public class InitiateAppRequest
{
    public string OrgName { get; set; } = string.Empty;
    public string? Address { get; set; } = string.Empty;
    public string LoginId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? EmailId { get; set; } = string.Empty;
    public string? MobileNo { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public byte RoleId { get; set; } = 100;
    public decimal AccountId { get; set; } = 0;
}
