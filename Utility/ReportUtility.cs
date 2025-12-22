using eAccountNoteService.Services;

namespace eAccountNoteService.Utility
{
    public class ReportUtility
    {
        private readonly OrgMasterService _orgMasterService;

        public ReportUtility(OrgMasterService orgMasterService)
        {
            _orgMasterService = orgMasterService;
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
    }
}
