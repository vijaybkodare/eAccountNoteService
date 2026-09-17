using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class UserOrgService : IUserOrgService
{
    private readonly DapperService _dapperService;

    public UserOrgService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<UserOrgDto>> GetUserOrgsAsync(decimal userId)
    {
        const string checkSuperAdminSql = @"
            SELECT TOP 1 1
            FROM UserProfile UP
            INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
            WHERE UP.UserId = @UserId AND UPR.RoleId = 100";

        var isSuperAdmin = (await _dapperService.QuerySingleOrDefaultAsync<int?>(checkSuperAdminSql, new { UserId = userId })) == 1;

        if (isSuperAdmin)
        {
            // Super Admin has access to all organizations.
            // Return all organizations from OrgMaster without eagerly creating associations in DB.
            const string superAdminOrgsSql = @"
                SELECT 
                    O.OrgId, 
                    O.OrgName, 
                    O.Address, 
                    MAX(UP.ProfileId) AS ProfileId, 
                    100 AS RoleId
                FROM OrgMaster O
                LEFT JOIN UserProfile UP ON O.OrgId = UP.OrgId AND UP.UserId = @UserId
                GROUP BY O.OrgId, O.OrgName, O.Address
                ORDER BY O.OrgName";

            return await _dapperService.QueryAsync<UserOrgDto>(superAdminOrgsSql, new { UserId = userId });
        }

        const string sql = @"
            SELECT 
                O.OrgId, 
                O.OrgName, 
                O.Address, 
                MAX(UP.ProfileId) AS ProfileId, 
                ISNULL(MAX(UPR.RoleId), 2) AS RoleId
            FROM UserProfile UP
            INNER JOIN OrgMaster O ON UP.OrgId = O.OrgId
            LEFT JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
            WHERE UP.UserId = @UserId
            GROUP BY O.OrgId, O.OrgName, O.Address
            ORDER BY O.OrgName";

        return await _dapperService.QueryAsync<UserOrgDto>(sql, new { UserId = userId });
    }

    public async Task<object> SaveUserOrgsAsync(decimal userId, List<decimal> orgIds)
    {
        // Guard: Super Admin user cannot be restricted from any organizations
        const string checkSuperAdminSql = @"
            SELECT TOP 1 1
            FROM UserProfile UP
            INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
            WHERE UP.UserId = @UserId AND UPR.RoleId = 100";

        var isSuperAdmin = (await _dapperService.QuerySingleOrDefaultAsync<int?>(checkSuperAdminSql, new { UserId = userId })) == 1;
        if (isSuperAdmin)
        {
            return new { IsSuccess = false, Error = "Super Admin user is automatically a member of all organizations." };
        }

        orgIds ??= new List<decimal>();

        try
        {
            return await _dapperService.ExecuteInTransactionAsync<object>(async (conn, trans) =>
            {
                // 1. Fetch existing UserProfile records for this user
                const string selectExistingSql = "SELECT ProfileId, UserId, OrgId FROM UserProfile WHERE UserId = @UserId";
                var existingProfiles = (await conn.QueryAsync<UserProfile>(selectExistingSql, new { UserId = userId }, trans)).ToList();

                var existingOrgIds = existingProfiles.Select(p => p.OrgId).ToList();

                // 2. Remove orgs that are no longer assigned
                var toRemove = existingProfiles.Where(p => !orgIds.Contains(p.OrgId)).ToList();
                if (toRemove.Any())
                {
                    var profileIdsToRemove = toRemove.Select(p => p.ProfileId).ToList();

                    await conn.ExecuteAsync(
                        "DELETE FROM UserProfileRole WHERE UserProfileId IN @ProfileIds",
                        new { ProfileIds = profileIdsToRemove },
                        trans);

                    await conn.ExecuteAsync(
                        "DELETE FROM UserProfile WHERE ProfileId IN @ProfileIds",
                        new { ProfileIds = profileIdsToRemove },
                        trans);
                }

                // 3. Add newly assigned orgs
                var toAddOrgIds = orgIds.Where(id => !existingOrgIds.Contains(id)).Distinct().ToList();
                foreach (var orgId in toAddOrgIds)
                {
                    const string insertProfileSql = @"
                        INSERT INTO UserProfile (UserId, OrgId)
                        VALUES (@UserId, @OrgId);
                        SELECT CAST(SCOPE_IDENTITY() AS DECIMAL);";

                    var newProfileId = await conn.ExecuteScalarAsync<decimal>(
                        insertProfileSql, 
                        new { UserId = userId, OrgId = orgId }, 
                        trans);

                    const string insertRoleSql = @"
                        INSERT INTO UserProfileRole (UserProfileId, RoleId)
                        VALUES (@UserProfileId, @RoleId);";

                    await conn.ExecuteAsync(
                        insertRoleSql,
                        new { UserProfileId = newProfileId, RoleId = 2 },
                        trans);
                }

                return new { IsSuccess = true, Message = "User organizations saved successfully." };
            });
        }
        catch (Exception ex)
        {
            return new { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<IEnumerable<UserWithOrgCountDto>> GetAllUsersWithOrgCountAsync()
    {
        const string totalOrgCountSql = "SELECT COUNT(*) FROM OrgMaster";
        var totalOrgs = await _dapperService.QuerySingleOrDefaultAsync<int>(totalOrgCountSql);

        const string sql = @"
            SELECT 
                U.UserId,
                U.UserName,
                U.LoginId,
                U.EmailId,
                MAX(UPR.RoleId) AS RoleId,
                COUNT(DISTINCT UP.OrgId) AS OrgCount
            FROM UserMaster U
            LEFT JOIN UserProfile UP ON U.UserId = UP.UserId
            LEFT JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
            GROUP BY U.UserId, U.UserName, U.LoginId, U.EmailId
            ORDER BY U.UserName";

        var users = (await _dapperService.QueryAsync<UserWithOrgCountDto>(sql)).ToList();

        foreach (var user in users)
        {
            if (user.RoleId == 100)
            {
                user.OrgCount = Math.Max(user.OrgCount, totalOrgs);
            }
        }

        return users;
    }
}
