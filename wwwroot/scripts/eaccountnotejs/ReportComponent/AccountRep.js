var AccountRep = React.createClass({
    displayName: "AccountRep",

    getInitialState: function () {
        return {
            Items: []
        };
    },
    counter: 0,
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Account Report" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ReportCommand, { downloadText: " Account Status", ShowFilter: false, DownloadReport: this.downloadAccountStatusReport }),
                React.createElement(ReportCommand, { downloadText: " Pending Summary", ShowFilter: false, DownloadReport: this.downloadPendingSummaryReport }),
                React.createElement(
                    "div",
                    { className: "listHeader2" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-4" },
                            "Account Name"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-3 textAlignR" },
                            "Total"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-2 textAlignR" },
                            "Paid"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-3 textAlignR" },
                            "Pending"
                        )
                    )
                ),
                this.getList(),
                this.getSummaryRow()
            )
        );
    },
    showMe: function () {
        _Main.EAccountHome.hideAll();
        this.refreshData();
        this.show();
    },
    refreshData: function () {
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('Report/memberAccountStatus' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    downloadReportCsv: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownload('Report/downloadMemberAccountStatus' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'memberAccountStatus.csv');
    },
    downloadAccountStatusReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/accounts' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'memberAccountStatus.pdf');
    },
    downloadPendingSummaryReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/accountpendingsummary' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'memberAccountPendingSummary.pdf');
    },
    componentDidMount: function () {
        setComponent(this);
    },
    getList: function () {
        var srNo = 0;
        return this.state.Items.map(function (item) {
            srNo += 1;
            return this.getRow(item, srNo);
        }.bind(this));
    },
    getRow: function (item, srNo) {
        return React.createElement(
            "div",
            { key: item.AccountId, className: "listItem" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-4" },
                    React.createElement(
                        "span",
                        { className: "badge badge-dark", style: { marginRight: 4 } },
                        item.SrNo
                    ),
                    item.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-3 textAlignR" },
                    Math.abs(item.Amount)
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-2 textAlignR" },
                    Math.abs(item.PaidAmount)
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-3 textAlignR" },
                    item.PendingAmount
                )
            )
        );
    },
    getSummaryRow: function () {
        var total = 0;
        var paid = 0;
        var pending = 0;
        this.state.Items.forEach(function (item) {
            total += item.Amount;
            paid += item.PaidAmount;
            pending += item.PendingAmount;
        });
        return React.createElement(
            "div",
            { className: "listItem1" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-4" },
                    "Total"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-3 textAlignR" },
                    numberWithCommas(total)
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-2 textAlignR" },
                    numberWithCommas(paid)
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-3 textAlignR" },
                    numberWithCommas(pending)
                )
            )
        );
    }

});