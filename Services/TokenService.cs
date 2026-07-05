using Microsoft.AspNetCore.DataProtection;

namespace eAccountNoteService.Services;

public class TokenService
{
    private readonly IDataProtector _protector;

    public TokenService(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("eAccountNoteService.Auth.v1");
    }

    public string GenerateToken(decimal userId, decimal orgId, decimal roleId)
    {
        var expiry = DateTime.UtcNow.AddMinutes(Utility.AppConstants.bearerTokenExpiryMinutes).Ticks;
        var payload = $"{userId}:{orgId}:{roleId}:{expiry}";
        return _protector.Protect(payload);
    }

    public TokenClaims? ValidateToken(string token)
    {
        try
        {
            var decrypted = _protector.Unprotect(token);
            var parts = decrypted.Split(':');
            if (parts.Length == 4 &&
                decimal.TryParse(parts[0], out var userId) &&
                decimal.TryParse(parts[1], out var orgId) &&
                decimal.TryParse(parts[2], out var roleId) &&
                long.TryParse(parts[3], out var expiryTicks))
            {
                var expiry = new DateTime(expiryTicks, DateTimeKind.Utc);
                if (expiry > DateTime.UtcNow)
                {
                    return new TokenClaims
                    {
                        UserId = userId,
                        OrgId = orgId,
                        RoleId = roleId
                    };
                }
            }
        }
        catch
        {
            // Token is invalid, corrupted, or expired
        }
        return null;
    }
}

public class TokenClaims
{
    public decimal UserId { get; set; }
    public decimal OrgId { get; set; }
    public decimal RoleId { get; set; }
}
