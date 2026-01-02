using System.Data;
using System.Text.RegularExpressions;
using Dapper;
using eAccountNoteService.Services;

namespace eAccountNoteService.Utility;

public class TransNoEvaluator
{
    private readonly DapperService _dapperService;

    public TransNoEvaluator(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    // Async version of legacy evaluateUtrNo
    public async Task EvaluateUtrNoAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
    {
        const string selectSql = @"SELECT CummulativeChargePayTransId, Remark, TransactionId
                                   FROM CummulativeChargePayTrans
                                   WHERE OrgId = @OrgId
                                     AND (@AccountId = -1 OR DrAccountId = @AccountId)
                                     AND (@FromDate IS NULL OR AddedDt >= @FromDate)
                                     AND (@ToDate IS NULL OR AddedDt <= @ToDate)";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId);
        parameters.Add("@AccountId", accountId);
        parameters.Add("@FromDate", string.IsNullOrWhiteSpace(fromDate) ? null : fromDate);
        parameters.Add("@ToDate", string.IsNullOrWhiteSpace(toDate) ? null : toDate);

        var table = await _dapperService.QueryToDataTableAsync(selectSql, parameters);

        foreach (DataRow dr in table.Rows)
        {
            var id = (decimal)dr["CummulativeChargePayTransId"];
            var remark = dr["Remark"]?.ToString() ?? string.Empty;
            var existingTransNo = dr["TransactionId"]?.ToString() ?? string.Empty;

            var newTransNo = ExtractUtrNoFromText(remark, existingTransNo);
            if (!string.Equals(newTransNo, existingTransNo, StringComparison.Ordinal))
            {
                const string updateSql = @"UPDATE CummulativeChargePayTrans
                                           SET TransactionId = @TransactionId
                                           WHERE CummulativeChargePayTransId = @Id";

                await _dapperService.ExecuteAsync(updateSql, new { TransactionId = newTransNo, Id = id });
            }
        }
    }

    public string ExtractTransNoFromText(string[] words)
    {
        string transNo = string.Empty;
        const string TRANSACTIION = "transaction";
        const string TRANS = "trans";
        const string REFERENCE = "reference";
        const string ID = "id";
        const string UTR = "utr:";
        string utrNo = string.Empty;
        string transactionId = string.Empty;
        string referenceId = string.Empty;
        string transId = string.Empty;
        for (int i = 0; i < words.Length; i++)
        {
            var lword = words[i].ToLower();
            if ((lword == TRANSACTIION) && transactionId == string.Empty &&
                i + 2 < words.Length &&
                Regex.Replace(words[i + 1].ToLower(), @"[^a-zA-Z]", string.Empty) == ID)
            {
                transactionId = words[i + 2];
            }
            if ((lword == REFERENCE) &&
                i + 2 < words.Length &&
                Regex.Replace(words[i + 1].ToLower(), @"[^a-zA-Z]", string.Empty) == ID)
            {
                referenceId = words[i + 2];
            }
            if ((lword == TRANS) &&
                i + 2 < words.Length &&
                Regex.Replace(words[i + 1].ToLower(), @"[^a-zA-Z]", string.Empty) == ID)
            {
                transId = words[i + 2];
            }
            if (words[i].ToLower() == UTR)
            {
                if (i + 1 < words.Length)
                {
                    utrNo = words[i + 1];
                }
            }
        }
        if(utrNo != string.Empty)
        {
            return utrNo;
        }
        if (transactionId != string.Empty)
        {
            return transactionId;
        }
        if (referenceId != string.Empty)
        {
            return referenceId;
        }
        return transId;
    }

    public string ExtractUtrNoFromText(string text, string existingTransNo)
    {
        var words = text.Split(new[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        for (int i = 0; i < words.Length; i++)
        {
            if (words[i].ToLower() == "utr:" && i + 1 < words.Length)
            {
                if (string.IsNullOrEmpty(existingTransNo))
                {
                    existingTransNo = words[i + 1];
                }
                else
                {
                    existingTransNo += "," + words[i + 1];
                }
                break;
            }
        }

        return existingTransNo;
    }

    public void EvaluateTransactionId(DataTable dt, string srcCol, string dstCol)
    {
        char[] delimiters = new char[] { '/', ':' };
        foreach (DataRow dr in dt.Rows)
        {
            var remark = dr[srcCol]?.ToString() ?? string.Empty;
            var remarks = remark.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
            if (remarks.Length > 1 && remarks[1].Length > 6)
            {
                dr[dstCol] = remarks[1];
            }
            else
            {
                dr[dstCol] = "NoTransNoFound";
            }
        }
    }

    public async Task<bool> IsTransactionIdExistAsync(decimal orgId, string transactionId, decimal id, string source)
    {
        decimal chargePayTransId = source == "CPT" ? id : -1;
        decimal cummulativeChargePayTransId = source == "CCPT" ? id : -1;

        // Check ChargePayTrans
        var sql1 = @"SELECT COUNT(*)
                     FROM ChargePayTrans CPT
                     INNER JOIN ChargePayeeDetail CPD ON CPT.ChargePayeeDetailId = CPD.ChargePayeeDetailId
                     INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                     WHERE CO.OrgId = @OrgId
                       AND CPT.Status = 0
                       AND CPT.RefType <> 1
                       AND CPT.TransactionId = @TransactionId
                       AND CPT.ChargePayTransId <> @ChargePayTransId";

        var count1 = await _dapperService.QuerySingleOrDefaultAsync<int>(sql1,
            new { OrgId = orgId, TransactionId = transactionId, ChargePayTransId = chargePayTransId });
        if (count1 > 0) return true;

        // Check CummulativeChargePayTrans
        var sql2 = @"SELECT COUNT(*)
                     FROM CummulativeChargePayTrans
                     WHERE OrgId = @OrgId
                       AND Status = 0
                       AND TransactionId = @TransactionId
                       AND CummulativeChargePayTransId <> @CummulativeChargePayTransId";

        var count2 = await _dapperService.QuerySingleOrDefaultAsync<int>(sql2,
            new { OrgId = orgId, TransactionId = transactionId, CummulativeChargePayTransId = cummulativeChargePayTransId });
        if (count2 > 0) return true;

        // Check AdvCharge
        var sql3 = @"SELECT COUNT(*)
                     FROM AdvCharge
                    WHERE OrgId = @OrgId
                       AND Status = 0
                       AND TransactionId = @TransactionId";

        var count3 = await _dapperService.QuerySingleOrDefaultAsync<int>(sql3,
            new { OrgId = orgId, TransactionId = transactionId });

        return count3 > 0;
    }
}
