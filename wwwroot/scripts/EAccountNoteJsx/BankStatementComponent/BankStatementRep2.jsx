var BankStatementRep2 = React.createClass({
    getInitialState: function () {
        return {
            Items: [],
            Status: -1,
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Bank Statements" />
                <div className="panel-body">
                    <DateSelector Label="From Date" ref={function (node) { this.FromDt = node; }.bind(this)} />
                    <DateSelector Label="To Date" ref={function (node) { this.ToDt = node; }.bind(this)} />
                    <div className="form-group">
                        <label>Remark</label>
                        <input ref={function (node) { this.Remark= node; }.bind(this)}
                            type="text" className="form-control" placeholder="Remark filter" />
                    </div>
                    <div className="form-group">
                        <label>Mapped status</label>
                        <div className="row">
                            <div className="col-xs-4">
                                <div className="radio">
                                    <label>
                                        <input ref="UserAccount" type="radio" name="Role" value="-1" onChange={this.statusChange} />
                                        All
                                    </label>
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <div className="radio">
                                    <label>
                                        <input ref="UserAccount" type="radio" name="Role" value="1" onChange={this.statusChange} />
                                        Mapped
                                    </label>
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="Role" value="0" onChange={this.statusChange} />
                                        Not Mapped
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="text-center">
                        <button className="btn btn-primary marginR5" type="button" onClick={this.getRecord}>
                            <span className="glyphicon glyphicon-search" />
                        </button>
                        <button className="btn btn-primary" type="button" onClick={this.downloadCsv}>
                            <span className="glyphicon glyphicon-download-alt" />
                        </button>
                    </div>
                    <hr />
                    {this.getList()}
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (id) {
        _Main.EAccountHome.hideAll();
        this.getRecord(id);
        this.show();
    },
    statusChange: function (e) {
        this.setState({ Status: e.currentTarget.value });
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            return this.getRow(item);
        }.bind(this));
    },
    getRecord: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&remark=" + this.Remark.value;
        urlParams += "&status=" + this.state.Status;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxGet('api/BankStatement/statements' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({ Items: data });
        }.bind(this));
    },
    downloadCsv: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&remark=" + this.Remark.value;
        urlParams += "&status=" + this.state.Status;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxDownload('report/getStatementInCsv' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'bankstatement.csv');
    },
    getRow: function (item) {
        return (
            <div key={item.Id} className={item.Status == 1 ? "listItem6" : "listItem0"}>
                <div className="row">
                        <div className="row fontSizeSr">
                            <div className="col col-xs-3 paddingR5 textAlignR">
                            {item.Status == 1 &&
                                <span className="selIcon glyphicon glyphicon-ok-circle" style={{ fontSize: "15px" }} />
                                }
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
                                {item.TransactionId}
                            </div>
                        </div>
                    </div>
            </div>
        );
    },
});