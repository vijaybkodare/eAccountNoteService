using System.Data;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;
using Dapper;
using FastReport;
using FastReport.Export.PdfSimple;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Services;

public class ChargePayeeDetailService
{
    private readonly DapperService _dapperService;
    private readonly ReportUtility _reportUtility;

    public ChargePayeeDetailService(DapperService dapperService, ReportUtility reportUtility)
    {
        _dapperService = dapperService;
        _reportUtility = reportUtility;
    }

    public async Task<IEnumerable<ChargePayeeDetail>> GetMemberPendingChargesAsync(decimal orgId, decimal accountId)
    {
        var sql = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.AccountId AS ItemAccountId, CO.Remark,
                           CPD.*, IM.ItemName, AM.AccountName
                    FROM ChargePayeeDetail CPD
                    INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                    INNER JOIN AccountMaster AM ON AM.AccountId = CPD.AccountId AND AM.AccountType = 1
                    WHERE CPD.Amount > CPD.PaidAmount
                      AND AM.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Int32);

        if (accountId != -1)
        {
            sql += " AND AM.AccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        return await _dapperService.QueryAsync<ChargePayeeDetail>(sql, parameters);
    }

    public async Task<IEnumerable<ChargePayeeDetail>> GetRecordsAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
    {
        var sql = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.AccountId AS ItemAccountId, CO.Remark,
                           CPD.*, IM.ItemName, AM.AccountName
                    FROM ChargePayeeDetail CPD
                    INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                    INNER JOIN AccountMaster AM ON AM.AccountId = CPD.AccountId
                    WHERE AM.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (accountId != -1)
        {
            sql += " AND CPD.AccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND CO.ChargeDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }

        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND CO.ChargeDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY CO.ChargeOrderNo";

        return await _dapperService.QueryAsync<ChargePayeeDetail>(sql, parameters);
    }

    public async Task<decimal> GetTotalPendingChargesAsync(decimal accountId, decimal itemAccountId, decimal[] chargePayeeDetails)
    {
        const string sqlBase = @"SELECT SUM(CPD.Amount - CPD.PaidAmount) AS TotalPending
                                 FROM ChargePayeeDetail CPD
                                 INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                                 WHERE CPD.AccountId = @AccountId
                                   AND CO.AccountId = @ItemAccountId
                                   AND CPD.ChargePayeeDetailId IN ({0})";

        if (chargePayeeDetails.Length == 0)
        {
            return 0m;
        }

        var idParams = string.Join(",", chargePayeeDetails.Select((_, i) => "@Id" + i));
        var sql = string.Format(sqlBase, idParams);

        var parameters = new DynamicParameters();
        parameters.Add("@AccountId", accountId, DbType.Decimal);
        parameters.Add("@ItemAccountId", itemAccountId, DbType.Decimal);
        for (int i = 0; i < chargePayeeDetails.Length; i++)
        {
            parameters.Add("@Id" + i, chargePayeeDetails[i], DbType.Decimal);
        }

        var result = await _dapperService.QuerySingleOrDefaultAsync<decimal?>(sql, parameters);
        return result ?? 0m;
    }

    public async Task<IEnumerable<ChargePayeeDetail>> GetPendingChargesAsync(decimal accountId, decimal itemAccountId, decimal[] chargePayeeDetails)
    {
        const string sqlBase = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.AccountId AS ItemAccountId, CO.Remark,
                                       CPD.*, IM.ItemName, AM.AccountName
                                FROM ChargePayeeDetail CPD
                                INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                                INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                                INNER JOIN AccountMaster AM ON AM.AccountId = CPD.AccountId
                                WHERE CPD.AccountId = @AccountId
                                  AND CO.AccountId = @ItemAccountId
                                  AND CPD.PaidAmount < CPD.Amount
                                  AND CPD.ChargePayeeDetailId IN ({0})
                                ORDER BY CPD.ChargePayeeDetailId";

        if (chargePayeeDetails.Length == 0)
        {
            return Enumerable.Empty<ChargePayeeDetail>();
        }

        var idParams = string.Join(",", chargePayeeDetails.Select((_, i) => "@Id" + i));
        var sql = string.Format(sqlBase, idParams);

        var parameters = new DynamicParameters();
        parameters.Add("@AccountId", accountId, DbType.Decimal);
        parameters.Add("@ItemAccountId", itemAccountId, DbType.Decimal);
        for (int i = 0; i < chargePayeeDetails.Length; i++)
        {
            parameters.Add("@Id" + i, chargePayeeDetails[i], DbType.Decimal);
        }

        return await _dapperService.QueryAsync<ChargePayeeDetail>(sql, parameters);
    }

    public async Task<DataTable> GetMemberAccountStatusAsync(decimal orgId, decimal accountId)
    {
        var query = @"SELECT AccountId, AccountName,
                             SUM(Amount) AS Amount,
                             SUM(PaidAmount) AS PaidAmount,
                             SUM(Amount - PaidAmount) AS PendingAmount
                      FROM (
                          SELECT AM.AccountId, AM.AccountName, CPD.Amount, CPD.PaidAmount
                              FROM ChargePayeeDetail CPD INNER JOIN AccountMaster AM
                                  ON CPD.AccountId = AM.AccountId
                              WHERE AM.OrgId = @OrgId AND AM.AccountType = 1 {0}
                          UNION ALL
                          SELECT AM.AccountId, AM.AccountName, 0 AS Amount, AC.Amount - AC.SettleAmount AS PaidAmount
                              FROM AdvCharge AC INNER JOIN AccountMaster AM
                                  ON AC.DrAccountId = AM.AccountId
                              WHERE AM.OrgId = @OrgId AND AM.AccountType = 1 {1}
                      ) AS RESULT
                      GROUP BY AccountId, AccountName
                      ORDER BY AccountName";

        string filter = accountId != -1 ? " AND AM.AccountId = @AccountId" : string.Empty;
        query = string.Format(query, filter, filter);

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);
        if (accountId != -1)
        {
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        return await _dapperService.QueryToDataTableAsync(query, parameters);
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> GenerateMemberAccountStatusCsvAsync(decimal orgId)
    {
        var dt = await GetMemberAccountStatusAsync(orgId, -1);

        using var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
        using (var csv = new CsvWriter(writer, CultureInfo.GetCultureInfo("en-US")))
        {
            csv.WriteField("AccountName");
            csv.WriteField("TotalAmount");
            csv.WriteField("PaidAmount");
            csv.WriteField("PendingAmount");
            csv.NextRecord();

            decimal totalAmount = 0;
            decimal totalPaidAmount = 0;
            decimal totalPendingAmount = 0;

            foreach (DataRow row in dt.Rows)
            {
                var accountName = row["AccountName"]?.ToString() ?? string.Empty;
                var amount = row["Amount"] != DBNull.Value ? Convert.ToDecimal(row["Amount"]) : 0m;
                var paidAmount = row["PaidAmount"] != DBNull.Value ? Convert.ToDecimal(row["PaidAmount"]) : 0m;
                var pendingAmount = row["PendingAmount"] != DBNull.Value ? Convert.ToDecimal(row["PendingAmount"]) : 0m;

                csv.WriteField(accountName);
                csv.WriteField(amount);
                csv.WriteField(paidAmount);
                csv.WriteField(pendingAmount);
                csv.NextRecord();

                totalAmount += amount;
                totalPaidAmount += paidAmount;
                totalPendingAmount += pendingAmount;
            }

            csv.WriteField("TOTAL");
            csv.WriteField(totalAmount);
            csv.WriteField(totalPaidAmount);
            csv.WriteField(totalPendingAmount);
            csv.NextRecord();

            writer.Flush();
        }

        var bytes = memoryStream.ToArray();
        return (bytes, "text/csv", "memberAccountStatus.csv");
    }

    public async Task<(byte[] Content, string FileName)> GenerateAccountsReportPdfAsync(decimal orgId)
    {
        var dt = await GetMemberAccountStatusAsync(orgId, -1);

        return await _reportUtility.GenerateReportPdfAsync(
            dt,
            "AccountStatus",
            orgId,
            "AccountReport.frx",
            "Account Status",
            System.DateTime.Now.ToString("dd-MMM-yyyy"));
    }

    public async Task<DataTable> GetMemberAccountPendingSummaryAsync(decimal orgId)
    {
        var query = @"SELECT AccountId, AccountName,
                             SUM(Amount) AS Amount,
                             SUM(PaidAmount) AS PaidAmount,
                             SUM(Amount - PaidAmount) AS PendingAmount
                      FROM (
                          SELECT AM.AccountId, AM.AccountName, CPD.Amount, CPD.PaidAmount
                              FROM ChargePayeeDetail CPD INNER JOIN AccountMaster AM
                                  ON CPD.AccountId = AM.AccountId
                              WHERE AM.OrgId = @OrgId AND AM.AccountType = 1
                          UNION ALL
                          SELECT AM.AccountId, AM.AccountName, 0 AS Amount, AC.Amount - AC.SettleAmount AS PaidAmount
                              FROM AdvCharge AC INNER JOIN AccountMaster AM
                                  ON AC.DrAccountId = AM.AccountId
                              WHERE AM.OrgId = @OrgId AND AM.AccountType = 1
                      ) AS RESULT
                      GROUP BY AccountId, AccountName
                      ORDER BY AccountName";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        return await _dapperService.QueryToDataTableAsync(query, parameters);
    }

    public async Task<(byte[] Content, string FileName)> GenerateAccountPendingSummaryReportPdfAsync(decimal orgId)
    {
        var sourceTable = await GetMemberAccountPendingSummaryAsync(orgId);

        var summaryTable = new DataTable();
        summaryTable.Columns.Add("BucketName", typeof(string));
        summaryTable.Columns.Add("Accounts", typeof(string));
        summaryTable.Columns.Add("PendingAmount", typeof(double));
        summaryTable.Columns.Add("TotalAccouts", typeof(double));
        summaryTable.Columns.Add("ColorCode", typeof(string));

        AddPendingSummaryRow(summaryTable, sourceTable, 30001, int.MaxValue, "Above 30,000", "red");
        AddPendingSummaryRow(summaryTable, sourceTable, 20001, 30000, "Between 20,001 to 30,000", "orange");
        AddPendingSummaryRow(summaryTable, sourceTable, 10001, 20000, "Between 10,001 to 20,000", "olive");
        AddPendingSummaryRow(summaryTable, sourceTable, 5001, 10000, "Between 5,001 to 10,000", "green");
        AddPendingSummaryRow(summaryTable, sourceTable, 2001, 5000, "Between 2,001 to 5,000", "blue");
        AddPendingSummaryRow(summaryTable, sourceTable, 1, 2000, "Between 1 to 2,000", "black");
        AddPendingSummaryRow(summaryTable, sourceTable, -int.MaxValue, 0, "0", "black");

        return await _reportUtility.GenerateReportPdfAsync(
            summaryTable,
            "AccountPendingSummary",
            orgId,
            "AccountPendingSummary.frx",
            "Account Pending Status Report",
            System.DateTime.Now.ToString("dd-MMM-yyyy"));
    }

    private static void AddPendingSummaryRow(DataTable targetTable, DataTable sourceTable, int minLimit, int maxLimit, string bucketName, string colorCode)
    {
        var row = targetTable.NewRow();
        row["BucketName"] = bucketName;
        row["ColorCode"] = colorCode;

        var view = new DataView(sourceTable)
        {
            RowFilter = $"PendingAmount >= {minLimit} AND PendingAmount <= {maxLimit}"
        };

        var sb = new StringBuilder();
        decimal totalPending = 0;

        foreach (DataRowView drv in view)
        {
            var accountName = drv["AccountName"]?.ToString() ?? string.Empty;
            if (!string.IsNullOrEmpty(accountName))
            {
                sb.Append(accountName);
                sb.Append(", ");
            }

            var amount = drv["PendingAmount"] != DBNull.Value ? Convert.ToDecimal(drv["PendingAmount"]) : 0m;
            if (amount > 0)
            {
                totalPending += amount;
            }
        }

        row["Accounts"] = sb.ToString();
        row["PendingAmount"] = (double)totalPending;
        row["TotalAccouts"] = view.Count;

        targetTable.Rows.Add(row);
    }

    public async Task<(byte[] Content, string FileName)> GenerateAccountChargesReportPdfAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate)
    {
        var records = await GetRecordsAsync(orgId, accountId, fromDate, toDate);

        // Convert IEnumerable<ChargePayeeDetail> to DataTable for FastReport
        var dataTable = new DataTable();
        dataTable.Columns.Add("ChargeOrderNo", typeof(string));
        dataTable.Columns.Add("ChargeDt", typeof(string));
        dataTable.Columns.Add("ItemAccountId", typeof(decimal));
        dataTable.Columns.Add("Remark", typeof(string));
        dataTable.Columns.Add("ChargePayeeDetailId", typeof(decimal));
        dataTable.Columns.Add("ChargeOrderId", typeof(decimal));
        dataTable.Columns.Add("AccountId", typeof(decimal));
        dataTable.Columns.Add("Amount", typeof(decimal));
        dataTable.Columns.Add("PaidAmount", typeof(decimal));
        dataTable.Columns.Add("PendingAmount", typeof(decimal));
        dataTable.Columns.Add("ItemName", typeof(string));
        dataTable.Columns.Add("AccountName", typeof(string));

        foreach (var item in records)
        {
            var row = dataTable.NewRow();
            row["ChargeOrderNo"] = item.ChargeOrderNo ?? string.Empty;
            row["ChargeDt"] = item.ChargeDt.ToString("yyyy-MM-dd");
            row["ItemAccountId"] = item.ItemAccountId;
            row["Remark"] = item.Remark ?? string.Empty;
            row["ChargePayeeDetailId"] = item.ChargePayeeDetailId;
            row["ChargeOrderId"] = item.ChargeOrderId;
            row["AccountId"] = item.AccountId;
            row["Amount"] = item.Amount;
            row["PaidAmount"] = item.PaidAmount;
            row["PendingAmount"] = item.Amount - item.PaidAmount;
            row["ItemName"] = item.ItemName ?? string.Empty;
            row["AccountName"] = item.AccountName ?? string.Empty;
            dataTable.Rows.Add(row);
        }

        var filter = await _reportUtility.GetReportFilterAsync(accountId, fromDate, toDate);

        return await _reportUtility.GenerateReportPdfAsync(
            dataTable,
            "AccountChargeReport",
            orgId,
            "AccountChargeReport.frx",
            "Account Charges",
            filter);
    }

    public async Task<(byte[] Content, string FileName)> GenerateChargeOrdersReportPdfAsync(
        decimal orgId,
        string fromDate,
        string toDate)
    {
        var records = await GetRecordsAsync(orgId, -1, fromDate, toDate);

        var dataTable = new DataTable();
        dataTable.Columns.Add("ChargeOrderNo", typeof(string));
        dataTable.Columns.Add("ChargeDt", typeof(string));
        dataTable.Columns.Add("ItemAccountId", typeof(decimal));
        dataTable.Columns.Add("Remark", typeof(string));
        dataTable.Columns.Add("ChargePayeeDetailId", typeof(decimal));
        dataTable.Columns.Add("ChargeOrderId", typeof(decimal));
        dataTable.Columns.Add("AccountId", typeof(decimal));
        dataTable.Columns.Add("Amount", typeof(decimal));
        dataTable.Columns.Add("PaidAmount", typeof(decimal));
        dataTable.Columns.Add("ItemName", typeof(string));
        dataTable.Columns.Add("AccountName", typeof(string));

        foreach (var item in records)
        {
            var row = dataTable.NewRow();
            row["ChargeOrderNo"] = item.ChargeOrderNo ?? string.Empty;
            row["ChargeDt"] = item.ChargeDt.ToString("yyyy-MM-dd");
            row["ItemAccountId"] = item.ItemAccountId;
            row["Remark"] = item.Remark ?? string.Empty;
            row["ChargePayeeDetailId"] = item.ChargePayeeDetailId;
            row["ChargeOrderId"] = item.ChargeOrderId;
            row["AccountId"] = item.AccountId;
            row["Amount"] = item.Amount;
            row["PaidAmount"] = item.PaidAmount;
            row["ItemName"] = item.ItemName ?? string.Empty;
            row["AccountName"] = item.AccountName ?? string.Empty;
            dataTable.Rows.Add(row);
        }

        var filter = await _reportUtility.GetReportFilterAsync(-1, fromDate, toDate);

        return await _reportUtility.GenerateReportPdfAsync(
            dataTable,
            "ChargeReport",
            orgId,
            "ChargeReport.frx",
            "Charge Orders Report",
            filter);
    }

    public async Task<IEnumerable<AccountMaster>> GetPayAccountsAsync(decimal profileId)
    {
        // Port of legacy GetPayAccounts: determine role, then return accounts with pending amount
        const string roleSql = @"SELECT UPR.RoleId
                                  FROM UserProfile UP
                                  INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
                                  WHERE UP.ProfileId = @ProfileId";

        var roleId = await _dapperService.QuerySingleOrDefaultAsync<decimal>(roleSql, new { ProfileId = profileId });

        string sql;
        object parameters;

        if (roleId != 0 && IsAdminRole(roleId))
        {
            const string orgSql = "SELECT OrgId FROM UserProfile WHERE ProfileId = @ProfileId";
            var orgId = await _dapperService.QuerySingleOrDefaultAsync<decimal>(orgSql, new { ProfileId = profileId });

            sql = @"SELECT AM.AccountId, AM.AccountName, SUM(CPD.Amount - CPD.PaidAmount) AS PendingAmount
                     FROM ChargePayeeDetail CPD
                     INNER JOIN AccountMaster AM ON CPD.AccountId = AM.AccountId
                     WHERE AM.OrgId = @OrgId
                     GROUP BY AM.AccountId, AM.AccountName
                     ORDER BY AM.AccountName";

            parameters = new { OrgId = orgId };
        }
        else
        {
            sql = @"SELECT AM.AccountId, AM.AccountName, SUM(CPD.Amount - CPD.PaidAmount) AS PendingAmount
                     FROM UserAccount UA
                     INNER JOIN AccountMaster AM ON UA.AccountId = AM.AccountId
                     INNER JOIN ChargePayeeDetail CPD ON CPD.AccountId = AM.AccountId
                     WHERE UA.UserProfileId = @ProfileId
                     GROUP BY AM.AccountId, AM.AccountName
                     ORDER BY AM.AccountName";

            parameters = new { ProfileId = profileId };
        }

        return await _dapperService.QueryAsync<AccountMaster>(sql, parameters);
    }

    private bool IsAdminRole(decimal roleId)
    {
        return roleId == 1 || roleId == 100;
    }

    public async Task<bool> UpdateAmountAsync(decimal chargePayeeDetailId, decimal newAmount)
    {
        var parameters = new DynamicParameters();
        parameters.Add("ChargePayeeDetailId", chargePayeeDetailId, DbType.Decimal);
        parameters.Add("NewAmount", newAmount, DbType.Decimal);

        var rows = await _dapperService.ExecuteStoredProcedureAsync("Proc_Update_ChargePayeeDetail", parameters);
        return rows > 0;
    }
}
