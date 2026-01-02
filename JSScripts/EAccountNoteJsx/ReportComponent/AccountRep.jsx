var AccountRep = React.createClass({
    getInitialState: function () {
        return {
            Items: []
        };
    },
    counter: 0,
    render: function() {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Account Report" />
                <div className="panel-body">
                    <ReportCommand downloadText=" Account Status" ShowFilter={false} DownloadReport={this.downloadAccountStatusReport} />
                    <ReportCommand downloadText=" Pending Summary" ShowFilter={false} DownloadReport={this.downloadPendingSummaryReport} />
                    <div className="listHeader2">
                        <div className="row">
                            <div className="col-xs-4">
                                Account Name
                            </div>
                            <div className="col-xs-3 textAlignR">
                                Total
                            </div>
                            <div className="col-xs-2 textAlignR">
                                Paid
                            </div>
                            <div className="col-xs-3 textAlignR">
                                Pending
                            </div>
                        </div>
                    </div>
                    {this.getList()}
                    {this.getSummaryRow()}
                </div>
            </div>
        );
    },
    showMe: function(){
        _Main.EAccountHome.hideAll();
        this.refreshData();
        this.show();
    },
    refreshData: function(){
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('Report/memberAccountStatus' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    downloadReportCsv: function(){
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownload('Report/downloadMemberAccountStatus' + urlParams,function(){
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
    getList: function(){
        var srNo = 0;
        return this.state.Items.map(function(item){
            srNo += 1;
            return this.getRow(item, srNo);
        }.bind(this));
    },
    getRow: function (item, srNo) {
        return (
            <div key={item.AccountId} className="listItem">
                <div className="row">
                    <div className="col-xs-4">
                        <span className="badge badge-dark" style={{ marginRight: 4 }}>{item.SrNo}</span>
                        {item.AccountName}
                    </div>
                    <div className="col-xs-3 textAlignR">
                        {Math.abs(item.Amount)}
                    </div>
                    <div className="col-xs-2 textAlignR">
                        {Math.abs(item.PaidAmount)}
                    </div>
                    <div className="col-xs-3 textAlignR">
                        {item.PendingAmount}
                    </div>
                </div>
            </div>
        );
    },
    getSummaryRow: function () {
        var total = 0;
        var paid = 0;
        var pending = 0;
        this.state.Items.forEach(function(item){
            total += item.Amount;
            paid += item.PaidAmount;
            pending += item.PendingAmount;
        });
        return (
            <div className="listItem1">
                <div className="row">
                    <div className="col-xs-4">
                        Total
                    </div>
                    <div className="col-xs-3 textAlignR">
                        {numberWithCommas(total)}
                    </div>
                    <div className="col-xs-2 textAlignR">
                        {numberWithCommas(paid)}
                    </div>
                    <div className="col-xs-3 textAlignR">
                        {numberWithCommas(pending)}
                    </div>
                </div>
            </div>
        );
    },
    
});