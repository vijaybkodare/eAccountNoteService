var ChargeOrderRep = React.createClass({
    displayName: "ChargeOrderRep",

    getInitialState: function () {
        return {
            Filter: { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 },
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
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Charge Order Report" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ReportCommand, { ShowReportFilter: this.showReportFilter, DownloadReport: this.downloadReport, filterTitle: getFilterTitle(this.state.Filter) }),
                this.getList(),
                this.getSummaryRow()
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (filter) {
        _Main.EAccountHome.hideAll();
        this.refreshData(filter);
        //this.loadList()
        this.show();
    },
    loadList: function () {
        var urlParams = "?id=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/list' + urlParams, function (data) {
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
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    },
    refreshData: function (filter) {
        if (!filter || typeof filter.AccountId == "undefined") {
            filter = { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 };
        }
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
                Filter: filter
            });
        }.bind(this));
    },
    showReportFilter: function () {
        this.props.ShowReportFilter(this.props.ShowChargeOrderRep, 1);
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.state.Filter.FromDate;
        urlParams += "&toDate=" + this.state.Filter.ToDate;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/chargeOrders' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'chargeTrans.pdf');
    },
    getRow: function (item) {
        return React.createElement(
            "div",
            { key: item.ChargeOrderId, className: "listItem4" },
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
                    item.ChargeOrderNo
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Date:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5" },
                    getFormattedDate2(item.ChargeDt)
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
                    "Remark:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5" },
                    item.Remark
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Charges:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5" },
                    item.Charges,
                    " * ",
                    item.Amount / item.Charges
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Paid / Total:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    item.PaidAmount,
                    " / ",
                    item.Amount
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
            { className: "listItem5" },
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
    }
});