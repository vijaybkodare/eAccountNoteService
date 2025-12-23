using System.Data;
using System.IO;
using FastReport;
using FastReport.Export.PdfSimple;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Hosting;

namespace eAccountNoteService.Utility
{
    public class ReportUtility
    {
        private readonly OrgMasterService _orgMasterService;
        private readonly IWebHostEnvironment _env;

        public ReportUtility(OrgMasterService orgMasterService, IWebHostEnvironment env)
        {
            _orgMasterService = orgMasterService;
            _env = env;
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
    }
}
