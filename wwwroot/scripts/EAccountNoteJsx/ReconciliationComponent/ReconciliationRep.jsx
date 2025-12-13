var ReconciliationRep = React.createClass({
    getInitialState: function () {
        return {
            Filter: { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 },
            Items: []
        };
    },
    counter: 0,
    render: function () {
        let result = this.getResult();
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Reconciliation Report" />
                <div className="panel-body">
                    <ReportCommand ShowReportFilter={this.showReportFilter} DownloadReport={this.downloadReport} filterTitle={getFilterTitle(this.state.Filter)} />
                    {result.List}
                    {result.Summary}
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
    getResult: function () {
        let total = 0;
        let list = this.state.Items.map(function (item) {
            total += item.Amount;
            return this.getRow(item);
        }.bind(this));

        return {
            List: list,
            Summary: this.getSummaryRow(total),
        }
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
        ajaxGet('api/Reconciliation/reconciliation' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
                Filter: filter,
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
        return (
            <div key={item.Id} className="listItem6">
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Account
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {item.AccountName}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {item.AddedDt.substring(0, 10)}
                    </div>
                </div>
                
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Remark
                    </div>
                    <div className="col col-xs-9">
                        {item.Remark}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Trans ID
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {item.TransactionId}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Amount
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {item.Amount}
                    </div>
                    {item.ReconcStatus == 1 && <div className="col col-xs-6 textAlignR selIcon colorGreen">
                        <span className="glyphicon glyphicon-ok-circle" />
                    </div>}
                </div>
            </div>
        );
    },
    getSummaryRow: function (total) {
        return (
            <div className="listItem1">
                <div className="row">
                    <div className="col-xs-6">
                        Total
                    </div>
                    <div className="col-xs-6 textAlignR fontWeightB">
                        {numberWithCommas(total)}
                    </div>
                </div>
            </div>
        );
    },
});