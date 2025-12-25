using System.Data;
using System.IO;
using FastReport;
using FastReport.Export.PdfSimple;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Hosting;
using System.Text;
using System.Collections.Generic;

namespace eAccountNoteService.Utility
{
    public class ReportUtility
    {
        private readonly OrgMasterService _orgMasterService;
        private readonly IWebHostEnvironment _env;
        private readonly AccountMasterService _accountMasterService;

        public ReportUtility(OrgMasterService orgMasterService, AccountMasterService accountMasterService, IWebHostEnvironment env)
        {
            _orgMasterService = orgMasterService;
            _accountMasterService = accountMasterService;
            _env = env;
        }
        public String getCurrentDate()
        {
            return System.DateTime.Now.ToString("dd-MMM-yyyy");
        }
        public async Task<FastReport.Report> setReportParameters(FastReport.Report report, decimal orgId, string reportTitle, string reportFilter)
        {
            var org = await _orgMasterService.GetRecordAsync((int)orgId);

            var orgName = org?.OrgName ?? string.Empty;
            var address = org?.Address ?? string.Empty;

            report.SetParameterValue("reportTitle", reportTitle);
            report.SetParameterValue("OrgName", orgName);
            report.SetParameterValue("address", address);
            report.SetParameterValue("reportFilter", reportFilter);

            return report;
        }

        public async Task<string> GetReportFilterAsync(decimal accountId, string fromDate, string toDate)
        {
            var repFilter = new StringBuilder();

            if (accountId != -1)
            {
                var account = await _accountMasterService.GetRecordAsync(accountId);
                var accountName = account?.AccountName;
                if (!string.IsNullOrWhiteSpace(accountName))
                {
                    repFilter.Append(accountName);
                }
            }

            if (!string.IsNullOrEmpty(fromDate))
            {
                if (repFilter.Length > 0)
                {
                    repFilter.Append(", ");
                }

                repFilter.Append(fromDate);
            }

            if (!string.IsNullOrEmpty(toDate))
            {
                // keep legacy behavior of trimming possible time suffix like " 23:59:59"
                var normalizedToDate = toDate.Replace(" 23:59:59", string.Empty);
                repFilter.Append(" To ");
                repFilter.Append(normalizedToDate);
            }

            return repFilter.ToString();
        }

        public async Task<(byte[] Content, string FileName)> GenerateReportPdfAsync(
            DataTable data,
            string dataSourceName,
            decimal orgId,
            string reportFileName,
            string reportTitle,
            string reportFilter)
        {
            var reportPath = Path.Combine(_env.ContentRootPath, "wwwroot/reports", reportFileName);

            using var report = new Report();
            report.Load(reportPath);

            report.RegisterData(data, dataSourceName);

            await setReportParameters(report, orgId, reportTitle, reportFilter);

            report.Prepare();
            using var ms = new MemoryStream();
            using (var pdfExport = new PDFSimpleExport())
            {
                pdfExport.Export(report, ms);
                ms.Position = 0;
                var fileName = $"{reportTitle.Replace(" ", string.Empty)}_{DateTime.Now:yyyyMMddHHmmss}.pdf";
                return (ms.ToArray(), fileName);
            }
        }

        public async Task<(byte[] Content, string FileName)> GenerateReportPdfAsync(
            IDictionary<string, DataTable> dataSources,
            decimal orgId,
            string reportFileName,
            string reportTitle,
            string reportFilter)
        {
            var reportPath = Path.Combine(_env.ContentRootPath, "wwwroot/reports", reportFileName);

            using var report = new Report();
            report.Load(reportPath);

            foreach (var kvp in dataSources)
            {
                report.RegisterData(kvp.Value, kvp.Key);
            }

            await setReportParameters(report, orgId, reportTitle, reportFilter);

            report.Prepare();
            using var ms = new MemoryStream();
            using (var pdfExport = new PDFSimpleExport())
            {
                pdfExport.Export(report, ms);
                ms.Position = 0;
                var fileName = $"{reportTitle.Replace(" ", string.Empty)}_{DateTime.Now:yyyyMMddHHmmss}.pdf";
                return (ms.ToArray(), fileName);
            }
        }
    }
}
