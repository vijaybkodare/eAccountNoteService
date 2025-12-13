var ChargeTransRep = React.createClass({
    displayName: "ChargeTransRep",

    getInitialState: function () {
        return {
            Filter: { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 },
            Items: []
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Charge Trans Report" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ReportCommand, { ShowReportFilter: this.showReportFilter, DownloadReport: this.downloadReport, filterTitle: getFilterTitle(this.state.Filter) }),
                this.getList()
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (filter) {
        _Main.EAccountHome.hideAll();
        this.refreshData(filter);
        this.show();
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            return this.getRow(item);
        }.bind(this));
    },
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    },
    showReportFilter: function () {
        this.props.ShowReportFilter(this.props.ShowChargeTransRep, 1);
    },
    refreshDataAfterTransIdUpdted: function () {
        this.refreshData(this.state.Filter);
    },
    refreshData: function (filter) {
        if (!filter || typeof filter.AccountId == "undefined") {
            filter = { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 };
        }
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        urlParams += "&accountId=" + filter.AccountId;
        _ProgressBar.IMBusy();
        ajaxGet('Report/chargePayAndCummTrans' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
                Filter: filter
            });
        }.bind(this));
    },
    downloadReportCsv: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.state.Filter.FromDate;
        urlParams += "&toDate=" + this.state.Filter.ToDate;
        urlParams += "&accountId=" + this.state.Filter.AccountId;
        _ProgressBar.IMBusy();
        ajaxDownload('Report/downloadChargePayTransRep' + urlParams, function (data) {
            _ProgressBar.IMDone();
        }.bind(this), 'chargePayTransRep.csv');
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.state.Filter.FromDate;
        urlParams += "&toDate=" + this.state.Filter.ToDate;
        urlParams += "&accountId=" + this.state.Filter.AccountId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/chargeTrans' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'chargeTrans.pdf');
    },
    getRow: function (item) {
        return React.createElement(
            "div",
            { key: item.Id, className: "listItem4", style: { backgroundColor: getBGColorBySource(item.Source) } },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Account"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    item.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Payment Date"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5" },
                    getFormattedDate2(item.AddedDt)
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Trans ID"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5 fontWeightB" },
                    item.TransactionId,
                    " \xA0",
                    isAdmin() && React.createElement("span", { className: "glyphicon glyphicon-pencil glyphiconBtn", onClick: function () {
                            _UpdateTransNo.show(item, this.refreshDataAfterTransIdUpdted);
                        }.bind(this) })
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Amount"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5 fontWeightB" },
                    item.Amount
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Remark"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9" },
                    item.Remark
                )
            )
        );
    }
});