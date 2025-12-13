using System.Data;
using System.Text.RegularExpressions;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class MLAutoTransService
{
    private readonly DapperService _dapperService;
    private readonly BankStatementService _bankStatementService;

    public MLAutoTransService(DapperService dapperService, BankStatementService bankStatementService)
    {
        _dapperService = dapperService;
        _bankStatementService = bankStatementService;
    }

    public async Task<bool> AddRecordAsync(AutoTransEntry entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", entity.OrgId, DbType.Decimal);
        parameters.Add("@BankStatementId", entity.BankStatementId, DbType.Decimal);
        parameters.Add("@AccountId", entity.AccountId, DbType.Decimal);
        parameters.Add("@Remark", entity.Remark ?? string.Empty, DbType.String);
        parameters.Add("@EntityName", entity.EntityName ?? string.Empty, DbType.String);
        parameters.Add("@Token", entity.Token ?? string.Empty, DbType.String);
        parameters.Add("@Weight", entity.Weight, DbType.Decimal);
        parameters.Add("@Amount", entity.Amount, DbType.Decimal);
        parameters.Add("@PendingAmount", entity.PendingAmount, DbType.Decimal);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_AutoTransEntry", parameters);
        return true;
    }

    public async Task<IEnumerable<AutoTransEntry>> GetRecordsAsync(decimal orgId)
    {
        const string sql = "SELECT * FROM AutoTransEntry WHERE OrgId = @OrgId";
        return await _dapperService.QueryAsync<AutoTransEntry>(sql, new { OrgId = orgId });
    }

    public async Task<Dictionary<BankStatement, List<MLEntity>>?> ProcessAutoTransAsync(int orgId, decimal accountId, string fromDate, string toDate)
    {
        var dtBankStatements = await _bankStatementService.GetRecordsAsync(-1, orgId, fromDate, toDate, 0);
        var mlEntityList = await PrepareMLModelDataAsync(orgId, accountId);

        var bankList = dtBankStatements.ToList();
        if (bankList.Count == 0 || mlEntityList.Count == 0)
        {
            return null;
        }

        var transMap = new Dictionary<BankStatement, List<MLEntity>>();

        foreach (var bs in bankList)
        {
            if (bs.Amount < 0)
                continue;

            var remarkOriginal = bs.Remark ?? string.Empty;
            var remark = FetchActualRemark(remarkOriginal);

            int maxWeight = 0;
            foreach (var mlEntity in mlEntityList)
            {
                mlEntity.Weight = 0;
                foreach (var token in mlEntity.Tokens)
                {
                    if (Regex.IsMatch(remark, token.Token, RegexOptions.IgnoreCase))
                    {
                        mlEntity.Weight += token.Weight;
                    }
                }
                if (maxWeight < mlEntity.Weight)
                {
                    maxWeight = mlEntity.Weight;
                }
            }

            var entityList = new List<MLEntity>();
            if (maxWeight > 0)
            {
                foreach (var mlEntity in mlEntityList)
                {
                    if (mlEntity.Weight == maxWeight)
                    {
                        entityList.Add(new MLEntity
                        {
                            AccountId = mlEntity.AccountId,
                            AccountName = mlEntity.AccountName,
                            RawToken = mlEntity.RawToken,
                            Tokens = mlEntity.Tokens.ToList(),
                            Weight = mlEntity.Weight,
                            PendingAmount = 0 // can be enriched using ChargePayeeDetailService if needed
                        });
                    }
                }
            }

            var key = new BankStatement
            {
                OrgId = orgId,
                BankStatementId = bs.BankStatementId,
                Amount = bs.Amount,
                Remark = remarkOriginal
            };
            transMap[key] = entityList;
        }

        return transMap;
    }

    public async Task StoreAutoTransEntryAsync(int orgId, Dictionary<BankStatement, List<MLEntity>> transMap)
    {
        const string deleteSql = "DELETE FROM AutoTransEntry WHERE OrgId = @OrgId";
        await _dapperService.ExecuteAsync(deleteSql, new { OrgId = orgId });

        foreach (var kvp in transMap)
        {
            var bs = kvp.Key;
            var list = kvp.Value;
            var baseEntity = new AutoTransEntry
            {
                OrgId = bs.OrgId,
                BankStatementId = bs.BankStatementId,
                Remark = bs.Remark ?? string.Empty,
                Amount = bs.Amount
            };

            if (list.Count == 0)
            {
                baseEntity.AccountId = 0;
                baseEntity.EntityName = string.Empty;
                baseEntity.Weight = 0;
                baseEntity.Token = string.Empty;
                baseEntity.PendingAmount = 0;
                await AddRecordAsync(baseEntity);
            }
            else
            {
                foreach (var ml in list)
                {
                    baseEntity.AccountId = ml.AccountId;
                    baseEntity.EntityName = ml.AccountName;
                    baseEntity.Weight = ml.Weight;
                    baseEntity.Token = ml.RawToken;
                    baseEntity.PendingAmount = ml.PendingAmount;
                    await AddRecordAsync(baseEntity);
                }
            }
        }
    }

    private string FetchActualRemark(string remark)
    {
        if (string.IsNullOrEmpty(remark))
            return remark;

        char c = '/';
        int firstIndex = remark.IndexOf(c);
        if (firstIndex == -1)
        {
            c = ':';
            firstIndex = remark.IndexOf(c);
            if (firstIndex == -1)
            {
                return remark;
            }
        }
        int secondIndex = remark.IndexOf(c, firstIndex + 1);
        if (secondIndex == -1)
        {
            return remark.Substring(firstIndex);
        }
        else
        {
            return remark.Substring(secondIndex);
        }
    }

    private async Task<List<MLEntity>> PrepareMLModelDataAsync(decimal orgId, decimal accountId)
    {
        var query = "SELECT * FROM AccountML WHERE OrgId = @OrgId";
        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);
        if (accountId != -1)
        {
            query += " AND AccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        var rows = await _dapperService.QueryAsync<dynamic>(query, parameters);
        var list = new List<MLEntity>();

        foreach (var dr in rows)
        {
            string accountName = dr.AccountName ?? string.Empty;
            string rawToken = dr.Token ?? string.Empty;
            if (string.IsNullOrWhiteSpace(accountName) || string.IsNullOrWhiteSpace(rawToken))
                continue;

            var mlEntity = new MLEntity
            {
                AccountId = (decimal)dr.AccountId,
                AccountName = accountName,
                RawToken = rawToken,
                Tokens = new List<MLToken>()
            };

            var tokens = rawToken.Split(',');
            foreach (var item in tokens)
            {
                var tokenData = item.Split('|');
                if (tokenData.Length == 2 && int.TryParse(tokenData[1], out var weight))
                {
                    mlEntity.Tokens.Add(new MLToken
                    {
                        Token = tokenData[0],
                        Weight = weight
                    });
                }
            }
            list.Add(mlEntity);
        }

        return list;
    }
}
