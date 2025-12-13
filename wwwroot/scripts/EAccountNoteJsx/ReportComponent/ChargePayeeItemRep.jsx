var ChargePayeeItemRep = React.createClass({
    getInitialState: function () {
        return {
            Filter: { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 },
            Items: []
        };
    },
    counter: 0,
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Charge Payee Item" />
                <div className="panel-body">
                    <ReportCommand ShowReportFilter={this.showReportFilter} DownloadReport={this.downloadReport} filterTitle={getFilterTitle(this.state.Filter)} />
                    {this.getList()}
                    {this.getSummaryRow()}
                </div>
            </div>
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
        if (!filter || typeof (filter.AccountId) == "undefined") {
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
                Filter: filter,
            });
        }.bind(this));
    },
    showReportFilter: function () {
        this.props.ShowReportFilter(this.props.ShowChargePayeeItemRep, 1);
    },
    getRow: function (item) {
        return (
            <div className={item.Amount > item.PaidAmount? 'listItem2' : 'listItem3'}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Account
                    </div>
                    <div className="col col-xs-2 fontWeightB paddingL5">
                        {item.AccountName}
                    </div>
                    <div className="col col-xs-2 textAlignR paddingR5">
                        Order
                    </div>
                    <div className="col col-xs-5 paddingL5">
                        <span className="fontWeightB">{item.ChargeOrderNo}</span>  &nbsp; {getFormattedDate(item.ChargeDt)}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Item
                    </div>
                    <div className="col col-xs-9 fontWeightB paddingL5">
                        {item.ItemName}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Remark
                    </div>
                    <div className="col col-xs-9 fontWeightB paddingL5">
                        {item.Remark}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Amount
                    </div>
                    <div className="col col-xs-3 fontWeightB textAlignL paddingL5 colorBlue">
                        {item.Amount}
                    </div>
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Paid
                    </div>
                    <div className="col col-xs-3 fontWeightB paddingL5 colorGreen">
                        {item.PaidAmount}
                    </div>
                </div>
                {
                    item.Amount > item.PaidAmount &&
                    <div className="row">
                        <div>
                            <div className="col col-xs-3 textAlignR paddingR5">
                                Pending
                            </div>
                            <div className="col col-xs-9 paddingL5 colorRed fontSizeLr fontWeight900">
                                {item.Amount - item.PaidAmount}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    },
    getSummaryRow: function () {
        var total = 0
        var paid = 0
        this.state.Items.forEach(function (item) {
            total += item.Amount
            paid += item.PaidAmount
        });
        return (
            <div className="listItem5">
                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Total:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {numberWithCommas(total)}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Paid:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {numberWithCommas(paid)}
                    </div>
                </div>
            </div>
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
    },
});