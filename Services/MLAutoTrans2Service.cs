using System.Data;
using System.Text.RegularExpressions;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class MLAutoTrans2Service
{
    private readonly AppSettingService _appSettingService;
    private readonly BankStatementService _bankStatementService;
    private readonly ChargePayeeDetailService _chargePayeeDetailService;
    private readonly DapperService _dapperService;
    private readonly AccountTransTokenService _accountTransTokenService;

    public MLAutoTrans2Service(
        AppSettingService appSettingService,
        BankStatementService bankStatementService,
        ChargePayeeDetailService chargePayeeDetailService,
        DapperService dapperService,
        AccountTransTokenService accountTransTokenService)
    {
        _appSettingService = appSettingService;
        _bankStatementService = bankStatementService;
        _chargePayeeDetailService = chargePayeeDetailService;
        _dapperService = dapperService;
        _accountTransTokenService = accountTransTokenService;
    }

    public async Task<List<AutoChargePayTrans>?> GetAutoTransAsync(int orgId, decimal bankStatementHeaderId, decimal accountId, string fromDate, string toDate)
    {
        var cutOff = await _appSettingService.GetNumberValueAsync(orgId, "CutoffWeightInTransToken");
        if (cutOff == 0)
            cutOff = 7;

        var autoList = new List<AutoChargePayTrans>();
        var bankStatements = await _bankStatementService.GetRecordsAsync(bankStatementHeaderId, orgId, fromDate, toDate, 0);
        var bankList = bankStatements.ToList();
        if (bankList.Count == 0)
            return null;

        var accountDtos = await GetAccountDtosAsync(orgId, accountId);

        foreach (var bankStatement in bankList)
        {
            if (bankStatement.Amount < 0)
                continue;

            decimal maxWeight = 0;
            foreach (var accountDto in accountDtos)
            {
                accountDto.Weight = 0;
                foreach (var token in accountDto.AccountTransTokens)
                {
                    token.IsMatch = false;
                    if (Regex.IsMatch(bankStatement.Remark ?? string.Empty, token.TokenValue, RegexOptions.IgnoreCase))
                    {
                        accountDto.Weight += token.TokenWeight;
                        token.IsMatch = true;
                    }
                }
                if (maxWeight < accountDto.Weight)
                {
                    maxWeight = accountDto.Weight;
                }
            }

            var auto = new AutoChargePayTrans
            {
                BankStatement = bankStatement
            };

            if (maxWeight > cutOff)
            {
                var temp = accountDtos.Where(x => x.Weight > cutOff).ToList();
                // deep clone via JSON to avoid reference sharing like legacy
                var json = System.Text.Json.JsonSerializer.Serialize(temp);
                auto.AccountDtos = System.Text.Json.JsonSerializer.Deserialize<List<AccountDto>>(json) ?? new List<AccountDto>();
            }

            if (accountId > 0)
            {
                if (maxWeight > cutOff)
                    autoList.Add(auto);
            }
            else
            {
                autoList.Add(auto);
            }
        }

        return autoList;
    }

    public async Task<List<AccountDto>> GetAccountDtosAsync(int orgId, decimal accountId, bool addCharges = true)
    {
        // Approximate GetMemberAccounts via direct query
        var sqlAccounts = "SELECT * FROM AccountMaster WHERE OrgId = @OrgId AND AccountType = 1";
        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Int32);
        if (accountId != -1)
        {
            sqlAccounts += " AND AccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        var memberAccounts = await _dapperService.QueryAsync<AccountMaster>(sqlAccounts, parameters);

        var chargePayeeDetails = new List<ChargePayeeDetail>();
        if (addCharges)
        {
            chargePayeeDetails = (await _chargePayeeDetailService.GetMemberPendingChargesAsync(orgId, accountId)).ToList();
        }

        var accountTransTokens = (await _accountTransTokenService.GetTransTokensAsync(orgId, accountId)).ToList();

        var list = new List<AccountDto>();
        foreach (var accountMaster in memberAccounts)
        {
            var dto = new AccountDto
            {
                AccountMaster = accountMaster,
                ChargePayeeDetails = chargePayeeDetails.Where(x => x.AccountId == accountMaster.AccountId).ToList(),
                AccountTransTokens = accountTransTokens.Where(x => x.AccountId == accountMaster.AccountId).ToList(),
                Weight = 0
            };
            list.Add(dto);
        }
        return list;
    }
}
