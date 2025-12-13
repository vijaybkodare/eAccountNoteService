using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Services;

public class DapperService
{
    private readonly string _connectionString;
    private readonly ILogger<DapperService> _logger;

    public DapperService(IConfiguration configuration, ILogger<DapperService> logger)
    {
        _logger = logger;
        _connectionString = configuration.GetConnectionString("DefaultConnection")
                         ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found");
    }

    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? parameters = null, CommandType commandType = CommandType.Text)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            return await connection.QueryAsync<T>(sql, parameters, commandType: commandType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing QueryAsync: {Sql}", sql);
            throw;
        }
    }

    /*public async Task<decimal> QuerySingleOrDefaultNumberAsync(string sql, object? parameters = null, CommandType commandType = CommandType.Text)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            return await connection.QuerySingleOrDefaultAsync<decimal>(sql, parameters, commandType: commandType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing QuerySingleOrDefaultAsync: {Sql}", sql);
            return 0;
        }
    }*/
    public async Task<T?> QuerySingleOrDefaultAsync<T>(string sql, object? parameters = null, CommandType commandType = CommandType.Text)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            return await connection.QuerySingleOrDefaultAsync<T>(sql, parameters, commandType: commandType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing QuerySingleOrDefaultAsync: {Sql}", sql);
            throw;
        }
    }

    public async Task<int> ExecuteAsync(string sql, object? parameters = null, CommandType commandType = CommandType.Text)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            return await connection.ExecuteAsync(sql, parameters, commandType: commandType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing ExecuteAsync: {Sql}", sql);
            throw;
        }
    }

    public async Task<int> ExecuteStoredProcedureAsync(string procedureName, DynamicParameters parameters)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            return await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing stored procedure: {ProcedureName}", procedureName);
            throw;
        }
    }

    public async Task<DataTable> QueryToDataTableAsync(string sql, object? parameters = null, CommandType commandType = CommandType.Text)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var reader = await connection.ExecuteReaderAsync(sql, parameters, commandType: commandType);
            var table = new DataTable();
            table.Load(reader);
            return table;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing QueryToDataTableAsync: {Sql}", sql);
            throw;
        }
    }

    public async Task<T> ExecuteInTransactionAsync<T>(Func<IDbConnection, IDbTransaction, Task<T>> operation)
    {
        try
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                var result = await operation(connection, transaction);
                await transaction.CommitAsync();
                _logger.LogInformation("Transaction committed successfully");
                return result;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Transaction rolled back due to error");
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing transaction");
            throw;
        }
    }
}
