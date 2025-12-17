using System.Data;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class ChargePayTransService
{
    private readonly DapperService _dapperService;
    private readonly TransactionService _transactionService;
    private readonly ChargePayeeDetailService _chargePayeeDetailService;
    private readonly AdvChargeService _advChargeService;
    private readonly BankStatementService _bankStatementService;
    private readonly CummulativeChargePayTransService _cummulativeChargePayTransService;

    public ChargePayTransService(
        DapperService dapperService,
        TransactionService transactionService,
        ChargePayeeDetailService chargePayeeDetailService,
        AdvChargeService advChargeService,
        BankStatementService bankStatementService,
        CummulativeChargePayTransService cummulativeChargePayTransService)
    {
        _dapperService = dapperService;
        _transactionService = transactionService;
        _chargePayeeDetailService = chargePayeeDetailService;
        _advChargeService = advChargeService;
        _bankStatementService = bankStatementService;
        _cummulativeChargePayTransService = cummulativeChargePayTransService;
    }

    public async Task<IEnumerable<ChargePayTrans>> GetAllRecordsAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
        => await GetRecordsAsync(orgId, status: -1, refId: -1, accountId, fromDate, toDate);

    public async Task<IEnumerable<ChargePayTrans>> GetNormalRecordsAsync(decimal orgId, decimal accountId, string fromDate, string toDate)
        => await GetRecordsAsync(orgId, status: 0, refId: -1, accountId, fromDate, toDate);

    public async Task<IEnumerable<ChargePayTrans>> GetRecordsAsync(
        decimal orgId,
        int status,
        int refId,
        decimal accountId,
        string? fromDate,
        string? toDate)
    {
        var sql = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.Remark AS ChargeRemark, CPT.*,
                           AMDr.AccountName AS DrAccount, AMCr.AccountName AS CrAccount, IM.ItemName
                    FROM ChargePayTrans CPT
                    INNER JOIN AccountMaster AMDr ON CPT.DrAccountId = AMDr.AccountId
                    INNER JOIN AccountMaster AMCr ON CPT.CrAccountId = AMCr.AccountId
                    INNER JOIN ChargePayeeDetail CPD ON CPD.ChargePayeeDetailId = CPT.ChargePayeeDetailId
                    INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                    WHERE CO.OrgId = @OrgId";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (status != -1)
        {
            sql += " AND CPT.Status = @Status";
            parameters.Add("@Status", status, DbType.Int32);
        }

        if (refId != -1)
        {
            sql += " AND CPT.RefId = @RefId";
            parameters.Add("@RefId", refId, DbType.Int32);
        }

        if (accountId != -1)
        {
            sql += " AND CPT.DrAccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND CPT.PaymentDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }

        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND CPT.PaymentDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY CPT.ChargePayTransId DESC";

        return await _dapperService.QueryAsync<ChargePayTrans>(sql, parameters);
    }

    public async Task<IEnumerable<ChargePayTrans>> GetRecordsToRevertAsync(decimal orgId, decimal accountId, string? fromDate, string? toDate)
    {
        var sql = @"SELECT CO.ChargeOrderNo, CO.ChargeDt, CO.Remark AS ChargeRemark, CPT.*,
                           AMDr.AccountName AS DrAccount, AMCr.AccountName AS CrAccount, IM.ItemName
                    FROM ChargePayTrans CPT
                    INNER JOIN AccountMaster AMDr ON CPT.DrAccountId = AMDr.AccountId
                    INNER JOIN AccountMaster AMCr ON CPT.CrAccountId = AMCr.AccountId
                    INNER JOIN ChargePayeeDetail CPD ON CPD.ChargePayeeDetailId = CPT.ChargePayeeDetailId
                    INNER JOIN ChargeOrder CO ON CO.ChargeOrderId = CPD.ChargeOrderId
                    INNER JOIN ItemMaster IM ON IM.ItemId = CO.ItemId
                    WHERE CO.OrgId = @OrgId AND CPT.Status = 0";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (accountId != -1)
        {
            sql += " AND CPT.DrAccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }
        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND CPT.PaymentDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND CPT.PaymentDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY CPT.ChargePayTransId DESC";

        return await _dapperService.QueryAsync<ChargePayTrans>(sql, parameters);
    }

    public async Task<(bool Success, string ErrorMessage)> RevertAsync(decimal id)
    {
        try
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ChargePayTransId", id, DbType.Decimal);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Revert_ChargePayTrans", parameters);
            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> GenerateChargePayTransCsvAsync(
        decimal orgId,
        decimal accountId,
        string fromDate,
        string toDate)
    {
        var records = await GetAllRecordsAsync(orgId, accountId, fromDate, toDate);

        using var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
        using (var csv = new CsvWriter(writer, CultureInfo.GetCultureInfo("en-US")))
        {
            // Header
            csv.WriteField("DrAccount");
            csv.WriteField("ChargeOrderNo");
            csv.WriteField("PaymentDt");
            csv.WriteField("ItemName");
            csv.WriteField("CrAccount");
            csv.WriteField("TransactionId");
            csv.WriteField("Amount");
            csv.WriteField("TransMode");
            csv.WriteField("Remark");
            csv.NextRecord();

            foreach (var item in records)
            {
                csv.WriteField(item.DrAccount);
                csv.WriteField(item.ChargeOrderNo);
                csv.WriteField(item.PaymentDt);
                csv.WriteField(item.ItemName);
                csv.WriteField(item.CrAccount);
                csv.WriteField(item.TransactionId);
                csv.WriteField(item.Amount);
                csv.WriteField(item.TransMode);
                csv.WriteField(item.Remark);
                csv.NextRecord();
            }

            writer.Flush();
        }

        var bytes = memoryStream.ToArray();
        return (bytes, "text/csv", "chargePayTrans.csv");
    }

    public async Task<bool> UpdateChargePayTransAsync(ChargePayTrans entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("ChargePayTransId", entity.Id, DbType.Decimal);
        parameters.Add("TransMode", entity.TransMode, DbType.Decimal);
        parameters.Add("Remark", entity.Remark ?? string.Empty, DbType.String);
        parameters.Add("TransactionId", entity.TransactionId ?? string.Empty, DbType.String);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Update_ChargePayTrans", parameters);
        return true;
    }

    public async Task<bool> ChargePaymentAsync(ChargePayTrans entity)
    {
        // Port of legacy ChargePayTransService.chargePayment using DapperService transaction
        return await _dapperService.ExecuteInTransactionAsync<bool>(async (connection, transaction) =>
        {
            // 1) Insert ChargePayTrans row via Proc_Insert_ChargePayTrans
            var cptParams = new DynamicParameters();
            cptParams.Add("ChargePayeeDetailId", entity.ChargePayeeDetailId, DbType.Decimal);
            cptParams.Add("Amount", entity.Amount, DbType.Decimal);
            cptParams.Add("Remark", entity.Remark ?? string.Empty, DbType.String);
            cptParams.Add("TransactionId", entity.TransactionId ?? string.Empty, DbType.String);
            cptParams.Add("DrAccountId", entity.DrAccountId, DbType.Decimal);
            cptParams.Add("CrAccountId", entity.CrAccountId, DbType.Decimal);
            cptParams.Add("Status", entity.Status, DbType.Decimal);
            cptParams.Add("TransMode", entity.TransMode, DbType.Decimal);
            cptParams.Add("RefType", entity.RefType, DbType.Decimal);
            cptParams.Add("RefId", entity.RefId, DbType.Decimal);
            cptParams.Add("RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "Proc_Insert_ChargePayTrans",
                cptParams,
                transaction,
                commandType: CommandType.StoredProcedure);

            entity.ChargePayTransId = cptParams.Get<decimal>("RecordId");

            // 2) Insert two Transaction rows (one debit, one credit) via Proc_Insert_Transaction
            var transParams = new DynamicParameters();
            transParams.Add("RefType", 1m, DbType.Decimal); // 1 = ChargePayTrans
            transParams.Add("RefId", entity.ChargePayTransId, DbType.Decimal);
            transParams.Add("AccountId", entity.DrAccountId, DbType.Decimal);
            transParams.Add("Amount", -entity.Amount, DbType.Decimal);

            await connection.ExecuteAsync(
                "Proc_Insert_Transaction",
                transParams,
                transaction,
                commandType: CommandType.StoredProcedure);

            transParams = new DynamicParameters();
            transParams.Add("RefType", 1m, DbType.Decimal);
            transParams.Add("RefId", entity.ChargePayTransId, DbType.Decimal);
            transParams.Add("AccountId", entity.CrAccountId, DbType.Decimal);
            transParams.Add("Amount", entity.Amount, DbType.Decimal);

            await connection.ExecuteAsync(
                "Proc_Insert_Transaction",
                transParams,
                transaction,
                commandType: CommandType.StoredProcedure);

            return true;
        });
    }

    public async Task<bool> CummulativeChargePaymentAsync(CummulativeChargePayTrans entity)
    {
        // 1) Pre‑validation using existing async services
        var detailIds = entity.ChargePayeeDetailIds ?? Array.Empty<decimal>();

        var totalPendingCharges = await _chargePayeeDetailService
            .GetTotalPendingChargesAsync(entity.DrAccountId, entity.CrAccountId, detailIds);

        if (entity.Amount > totalPendingCharges)
        {
            throw new Exception("Amount is greater than totalPendingCharges");
        }

        var pendingDetails = (await _chargePayeeDetailService
            .GetPendingChargesAsync(entity.DrAccountId, entity.CrAccountId, detailIds)).ToList();

        if (entity.TransMode == 2)
        {
            var advCharge = await _advChargeService.GetAccountSummaryAsync(entity.DrAccountId);
            if (advCharge.Amount - advCharge.SettleAmount < entity.Amount)
            {
                throw new Exception("Amount is greater than totalAdvPendingSettles");
            }

            entity.RefId = advCharge.AdvChargeId;
            entity.RefType = 2;
        }

        // 2) Transactional DB work mirroring legacy CummulativeChargePayment
        return await _dapperService.ExecuteInTransactionAsync<bool>(async (connection, transaction) =>
        {
            // 2.1 Insert CummulativeChargePayTrans via dedicated service
            await _cummulativeChargePayTransService.AddAsync(entity, connection, transaction);

            // 2.2 Create ChargePayTrans rows that consume pending charges
            decimal totalAmountToPay = entity.Amount;
            foreach (var item in pendingDetails)
            {
                if (totalAmountToPay == 0)
                {
                    break;
                }

                var payAmount = item.Amount - item.PaidAmount;
                if (totalAmountToPay < payAmount)
                {
                    payAmount = totalAmountToPay;
                }
                totalAmountToPay -= payAmount;

                var chargePayTrans = new ChargePayTrans
                {
                    ChargePayeeDetailId = item.ChargePayeeDetailId,
                    Amount = payAmount,
                    Remark = entity.Remark ?? string.Empty,
                    TransactionId = entity.TransactionId ?? string.Empty,
                    DrAccountId = entity.DrAccountId,
                    CrAccountId = entity.CrAccountId,
                    Status = 0,
                    TransMode = entity.TransMode,
                    RefType = 1,
                    RefId = entity.CummulativeChargePayTransId
                };

                await AddAsync(chargePayTrans, connection, transaction);
            }

            // 2.3 Update bank statement reconciliation if needed
            if (entity.BankStatementId > 0)
            {
                await BankStatementService.UpdateReconciliationStatusAsync(
                    bankStatementId: entity.BankStatementId,
                    refType: 1m,
                    refId: entity.CummulativeChargePayTransId,
                    status: 1m,
                    connection: connection,
                    transaction: transaction);
            }

            return true;
        });
    }

    public static async Task AddAsync(ChargePayTrans entity, IDbConnection connection, IDbTransaction transaction)
    {
        var cptParams = new DynamicParameters();
        cptParams.Add("ChargePayeeDetailId", entity.ChargePayeeDetailId, DbType.Decimal);
        cptParams.Add("Amount", entity.Amount, DbType.Decimal);
        cptParams.Add("Remark", entity.Remark ?? string.Empty, DbType.String);
        cptParams.Add("TransactionId", entity.TransactionId ?? string.Empty, DbType.String);
        cptParams.Add("DrAccountId", entity.DrAccountId, DbType.Decimal);
        cptParams.Add("CrAccountId", entity.CrAccountId, DbType.Decimal);
        cptParams.Add("Status", entity.Status, DbType.Decimal);
        cptParams.Add("TransMode", entity.TransMode, DbType.Decimal);
        cptParams.Add("RefType", entity.RefType, DbType.Decimal);
        cptParams.Add("RefId", entity.RefId, DbType.Decimal);
        cptParams.Add("RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "Proc_Insert_ChargePayTrans",
            cptParams,
            transaction,
            commandType: CommandType.StoredProcedure);

        entity.ChargePayTransId = cptParams.Get<decimal>("RecordId");
    }
}
