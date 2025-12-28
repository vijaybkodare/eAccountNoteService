var BillTransRep = React.createClass({
    getInitialState: function () {
        return { 
            Filter: {FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1},
            Items: []
        };
    },
    render: function() {
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Bill Trans Report"/>    
                <div className="panel-body">
                    <ReportCommand ShowReportFilter={this.showReportFilter} DownloadReport={this.downloadReport} filterTitle={getFilterTitle(this.state.Filter)} />
                    {this.getList()}    
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(filter){
        _Main.EAccountHome.hideAll();
        this.refreshData(filter);
        this.show();
    },
    getList: function(){
        return this.state.Items.map(function (item) {
            return this.getRow(item);
        }.bind(this));
    },
    filterChange: function(filter){
        this.setState({
            Filter: filter
        });
    },
    showReportFilter: function(){
        this.props.ShowReportFilter(this.props.ShowBillTransRep, 1);
    },
    refreshData: function(filter){
        if(!filter || typeof(filter.AccountId) == "undefined"){
            filter = {FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1};
        }
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        urlParams += "&accountId=" + filter.AccountId;
        _ProgressBar.IMBusy();
        ajaxGet('BillOrder/billtransactions' + urlParams,function(data){
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
        ajaxDownloadPdf('api/PdfReport/chargeTrans' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'chargeTrans.pdf');
    },
    getRow: function(item){
        return (
            <div key={item.BillPayTransId} className="listItem6">
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Bill No:
                    </div>
                    <div className="col col-xs-2 paddingL5">
                        {item.BillNo}
                    </div>
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB" >
                        {getFormattedDate(item.BillDt)}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-2  paddingR5 textAlignR">
                        Account:
                    </div>
                    <div className="col col-xs-4 paddingL5">
                        {item.CrAccount}
                    </div>
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Item:
                    </div>
                    <div className="col col-xs-4 paddingL5 fontWeightB" >
                        {item.ItemName}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Remark:
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {item.BillRemark}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Bill Amount:
                    </div>
                    <div className="col col-xs-2 paddingL5">
                        {item.BillAmount}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Paid Amount:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {item.Amount}
                    </div>
                    {item.ReconcStatus == 1 && <div className="col col-xs-2 textAlignR selIcon colorGreen">
                        <span className="glyphicon glyphicon-ok-circle" />
                    </div>}
                </div>
            </div>
        );
    },
});