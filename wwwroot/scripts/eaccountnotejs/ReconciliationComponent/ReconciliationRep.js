var ReconciliationRep = React.createClass({
    displayName: "ReconciliationRep",

    getInitialState: function () {
        return {
            Filter: { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 },
            Items: []
        };
    },
    counter: 0,
    render: function () {
        let result = this.getResult();
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Reconciliation Report" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ReportCommand, { ShowReportFilter: this.showReportFilter, DownloadReport: this.downloadReport, filterTitle: getFilterTitle(this.state.Filter) }),
                result.List,
                result.Summary
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
    getResult: function () {
        let total = 0;
        let list = this.state.Items.map(function (item) {
            total += item.Amount;
            return this.getRow(item);
        }.bind(this));

        return {
            List: list,
            Summary: this.getSummaryRow(total)
        };
    },
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    },
    showReportFilter: function () {
        this.props.ShowReportFilter(this.props.ShowReconciliationRep, 1);
    },
    refreshData: function (filter) {
        if (!filter || typeof filter.AccountId == "undefined") {
            filter = { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 };
        }
        if (_LoginAccount.RoleId == 2) {
            filter.AccountId = _LoginAccount.AccountId;
        }
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        urlParams += "&accountId=" + filter.AccountId;
        _ProgressBar.IMBusy();
        ajaxGet('api/Reconciliation/reconciliation' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
                Filter: filter
            });
        }.bind(this));
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.state.Filter.FromDate;
        urlParams += "&toDate=" + this.state.Filter.ToDate;
        urlParams += "&accountId=" + this.state.Filter.AccountId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/Reconciliation/reconciliationrep' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'Reconciliation.pdf');
    },
    getRow: function (item) {
        return React.createElement(
            "div",
            { key: item.Id, className: "listItem6" },
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
                    { className: "col col-xs-3 paddingL5" },
                    item.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Date"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5" },
                    item.AddedDt.substring(0, 10)
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
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    item.TransactionId
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
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    item.Amount
                ),
                item.ReconcStatus == 1 && React.createElement(
                    "div",
                    { className: "col col-xs-6 textAlignR selIcon colorGreen" },
                    React.createElement("span", { className: "glyphicon glyphicon-ok-circle" })
                )
            )
        );
    },
    getSummaryRow: function (total) {
        return React.createElement(
            "div",
            { className: "listItem1" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-6" },
                    "Total"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-6 textAlignR fontWeightB" },
                    numberWithCommas(total)
                )
            )
        );
    }
});