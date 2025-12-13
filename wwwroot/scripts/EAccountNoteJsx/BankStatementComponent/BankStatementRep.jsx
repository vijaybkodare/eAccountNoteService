var BankStatementRep = React.createClass({
    getInitialState: function () {
        return { 
            Entity: {},
        };
    },
    render: function() {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowList} Title="Bank Statement Report" />
                <div className="panel-body">
                    <ReportCommand ShowFilter={false} DownloadReport={this.downloadReport} />
                    <hr/>
                    <div className="row">
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Order No:
                        </div>
                        <div className="col col-xs-2 paddingL5 fontWeightB">
                            {this.state.Entity.BankStatementNo}
                        </div>
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Date:
                        </div>
                        <div className="col col-xs-4 paddingL5">
                            {getFormattedDate3(this.state.Entity.AddedDt)}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-xs-3  paddingR5 textAlignR fontWeightB">
                            From Date:
                        </div>
                        <div className="col col-xs-3 paddingL5 fontWeightB">
                            {getFormattedDate3(this.state.Entity.FromDt)}
                        </div>
                        <div className="col col-xs-3  paddingR5 textAlignR">
                            To Date:
                        </div>
                        <div className="col col-xs-3 paddingL5">
                            {getFormattedDate3(this.state.Entity.ToDt)}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-xs-3  paddingR5 textAlignR">
                            Remark:
                        </div>
                        <div className="col col-xs-9 paddingL5">
                            {this.state.Entity.Remark}
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col col-xs-3  paddingR5 textAlignR">
                            Details:
                        </div>
                    </div>
                    {this.getList()}    
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (id){
        _Main.EAccountHome.hideAll();
        this.getRecord(id);
        this.show();
    },
    getList: function () {
        if (this.state.Entity.Details == null) return null;
        return this.state.Entity.Details.map(function (item) {
            return this.getRow(item);
        }.bind(this));
    },
    getRecord: function (id) {
        var urlParams = "?id=" + id + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/BankStatement/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({ Entity: data });
        }.bind(this));
    },
    downloadReport: function () {
        var urlParams = "?id=" + this.state.Entity.BankStatementHeaderId + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/BankStatement/report' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'bankstatement.pdf');
    },
    getRow: function(item){
        return (
            <div key={item.Id} className="listItem0">
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {item.TransDt.substring(0, 10)}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Amount
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {item.Amount}
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
                    <div className="col col-xs-9 paddingL5 fontWeightB">
                        {item.TransactionId} &nbsp;
                    </div>
                </div>
            </div>
        );
    },
});