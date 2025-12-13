var BillOrderRep = React.createClass({
    getInitialState: function () {
        return {
            Items:[],
        };
    },
    render: function() {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Bill Report" />
                <div className="panel-body">
                    <ReportCommand ShowFilter={false} DownloadReport={this.downloadReport}/>
                    {this.getList()}
                    {this.getSummaryRow()}
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(){
        _Main.EAccountHome.hideAll();
        this.loadList()
        this.show();
    },
    loadList: function(){
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('BillOrder/list' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function(){
        return this.state.Items.map(function(item){
            return this.getRow(item);
        }.bind(this));
    },
    getRow: function (item) {
        return (
            <div className="listItem4">
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Order No:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {item.BillNo}
                    </div> 
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {getFormattedDate2(item.BillDt)}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR fontWeightB">
                        Item:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {item.ItemName}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Account:
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {item.AccountName}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Total:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {item.Amount}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Paid:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {item.PaidAmount}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Remark:
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {item.Remark}
                    </div>
                </div>
            </div>
        );
    },
    getSummaryRow: function () {
        var total = 0
        var paid = 0
        this.state.Items.forEach(function(item){
            total += item.Amount
            paid += item.PaidAmount
        });
        return (
            <div className="listItem1">
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
    downloadReportCsv: function(){
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownload('Report/downloadBillReport' + urlParams,function(){
            _ProgressBar.IMDone();
        }.bind(this), 'billReport.csv');
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/bills' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'billReport.pdf');
    },
});