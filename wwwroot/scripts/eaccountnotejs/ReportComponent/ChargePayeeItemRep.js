var ChargePayeeItemRep = React.createClass({
    displayName: "ChargePayeeItemRep",

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
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Charge Payee Item" }),
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
        ajaxGet('Report/chargePayeeItemRep' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
                Filter: filter
            });
        }.bind(this));
    },
    showReportFilter: function () {
        this.props.ShowReportFilter(this.props.ShowChargePayeeItemRep, 1);
    },
    getRow: function (item) {
        return React.createElement(
            "div",
            { className: item.Amount > item.PaidAmount ? 'listItem2' : 'listItem3' },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Account"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 fontWeightB paddingL5" },
                    item.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 textAlignR paddingR5" },
                    "Order"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-5 paddingL5" },
                    React.createElement(
                        "span",
                        { className: "fontWeightB" },
                        item.ChargeOrderNo
                    ),
                    "  \xA0 ",
                    getFormattedDate(item.ChargeDt)
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Item"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 fontWeightB paddingL5" },
                    item.ItemName
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Remark"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 fontWeightB paddingL5" },
                    item.Remark
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Amount"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 fontWeightB textAlignL paddingL5 colorBlue" },
                    item.Amount
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Paid"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 fontWeightB paddingL5 colorGreen" },
                    item.PaidAmount
                )
            ),
            item.Amount > item.PaidAmount && React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 textAlignR paddingR5" },
                        "Pending"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9 paddingL5 colorRed fontSizeLr fontWeight900" },
                        item.Amount - item.PaidAmount
                    )
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
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.state.Filter.FromDate;
        urlParams += "&toDate=" + this.state.Filter.ToDate;
        urlParams += "&accountId=" + this.state.Filter.AccountId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/accountCharges' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'accountChargeDetails.pdf');
    }
});