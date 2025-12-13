var AccountExpRep = React.createClass({
    render: function() {
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Account Exp Report"/>    
                <div className="panel-body">
                    <Filter ref={function (node) { this.Filter = node; }.bind(this)} ShowAccountList={this.props.ShowAccountList} ShowNextComponent={this.showMe}/>
                </div>
                <div className="panel-footer text-center">
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-success" onClick={this.downloadReport}>Download</button>
                    </div>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType){
        _Main.EAccountHome.hideAll();
        this.setState({});
        this.show();
        if (itemType == 12) {
            this.Filter.updateAccount(item);
        }
    },
    prepareAutoTransEntry: function () {
        let filter = this.Filter.value()
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        urlParams += "&accountId=" + filter.AccountId;
        
        var formData = new FormData();
        
        _ProgressBar.IMBusy();

        ajaxPost('api/AutoTransEntry/prepare' + urlParams, formData, function () {
            _ProgressBar.IMDone();
            this.downloadReport();
        }.bind(this));
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.Filter.value().FromDate;
        urlParams += "&toDate=" + this.Filter.value().ToDate;
        urlParams += "&accountId=" + this.Filter.value().AccountId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/expense-report' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'expense-report.pdf');
    },
});