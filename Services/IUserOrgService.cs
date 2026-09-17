using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public interface IUserOrgService
{
    Task<IEnumerable<UserOrgDto>> GetUserOrgsAsync(decimal userId);
    Task<object> SaveUserOrgsAsync(decimal userId, List<decimal> orgIds);
    Task<IEnumerable<UserWithOrgCountDto>> GetAllUsersWithOrgCountAsync();
}
