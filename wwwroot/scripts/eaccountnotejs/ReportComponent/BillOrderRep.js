var BillOrderRep = React.createClass({
    displayName: "BillOrderRep",

    getInitialState: function () {
        return {
            Items: []
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Bill Report" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ReportCommand, { ShowFilter: false, DownloadReport: this.downloadReport }),
                this.getList(),
                this.getSummaryRow()
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function () {
        _Main.EAccountHome.hideAll();
        this.loadList();
        this.show();
    },
    loadList: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('BillOrder/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            return this.getRow(item);
        }.bind(this));
    },
    getRow: function (item) {
        return React.createElement(
            "div",
            { className: "listItem4" },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Order No:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    item.BillNo
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Date:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5" },
                    getFormattedDate2(item.BillDt)
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR fontWeightB" },
                    "Item:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    item.ItemName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Account:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5" },
                    item.AccountName
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Total:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    item.Amount
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Paid:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    item.PaidAmount
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Remark:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5" },
                    item.Remark
                )
            )
        );
    },
    getSummaryRow: function () {
        var total = 0;
        var paid = 0;
        this.state.Items.forEach(function (item) {
            total += item.Amount;
            paid += item.PaidAmount;
        });
        return React.createElement(
            "div",
            { className: "listItem1" },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Total:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    numberWithCommas(total)
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Paid:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    numberWithCommas(paid)
                )
            )
        );
    },
    downloadReportCsv: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownload('Report/downloadBillReport' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'billReport.csv');
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/bills' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'billReport.pdf');
    }
});