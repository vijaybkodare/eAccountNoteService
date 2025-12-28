using System.Data;
using System.IO;
using System.Text;
using ExcelDataReader;

namespace eAccountNoteService.Utility;

public static class ExcelUtility
{
    public static DataTable ReadExcelInDataTable(Stream fileStream, string? sheetName)
    {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

        using var reader = ExcelReaderFactory.CreateReader(fileStream);

        var conf = new ExcelDataSetConfiguration
        {
            ConfigureDataTable = _ => new ExcelDataTableConfiguration
            {
                UseHeaderRow = true
            }
        };

        var dataSet = reader.AsDataSet(conf);
        if (dataSet == null || dataSet.Tables.Count == 0)
        {
            return new DataTable();
        }

        if (!string.IsNullOrWhiteSpace(sheetName) && dataSet.Tables.Contains(sheetName))
        {
            return dataSet.Tables[sheetName]!;
        }

        return dataSet.Tables[0];
    }
}
