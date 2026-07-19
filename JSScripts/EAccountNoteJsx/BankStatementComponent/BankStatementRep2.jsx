var BankStatementRep2 = React.createClass({
    getInitialState: function () {
        return {
            Items: [],
            Status: -1,
            TransType: 0,
            DropdownOpen: false
        };
    },
    toggleDropdown: function () {
        this.setState({ DropdownOpen: !this.state.DropdownOpen });
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Bank Statements" />
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label className="mandatory">From Date</label>
                                <FlatPickrDate ref={function (node) { this.FromDt = node; }.bind(this)} />
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label className="mandatory">To Date</label>
                                <FlatPickrDate ref={function (node) { this.ToDt = node; }.bind(this)} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Remark</label>
                        <input ref={function (node) { this.Remark = node; }.bind(this)}
                            type="text" className="form-control" placeholder="Remark filter" />
                    </div>
                    <div className="form-group">
                        <label>Mapped status</label>
                        <div className="btn-group btn-group-justified" role="group">
                            <div className="btn-group" role="group">
                                <button type="button" className={this.state.Status == -1 ? "btn btn-primary" : "btn btn-default"} onClick={this.statusChange.bind(this, -1)}>All</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button type="button" className={this.state.Status == 1 ? "btn btn-primary" : "btn btn-default"} onClick={this.statusChange.bind(this, 1)}>Mapped</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button type="button" className={this.state.Status == 0 ? "btn btn-primary" : "btn btn-default"} onClick={this.statusChange.bind(this, 0)}>Not Mapped</button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Transaction Type</label>
                        <div className="btn-group btn-group-justified" role="group">
                            <div className="btn-group" role="group">
                                <button type="button" className={this.state.TransType == 0 ? "btn btn-primary" : "btn btn-default"} onClick={this.transTypeChange.bind(this, 0)}>All</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button type="button" className={this.state.TransType == 1 ? "btn btn-primary" : "btn btn-default"} onClick={this.transTypeChange.bind(this, 1)}>Credit(CR)</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button type="button" className={this.state.TransType == -1 ? "btn btn-primary" : "btn btn-default"} onClick={this.transTypeChange.bind(this, -1)}>Debit(DB)</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="text-center">
                        <button className="btn btn-primary marginR5" type="button" onClick={this.getRecord}>
                            <span className="glyphicon glyphicon-search" /> Search
                        </button>
                        <div className={this.state.DropdownOpen ? "btn-group open" : "btn-group"}>
                            <button type="button" className="btn btn-success dropdown-toggle" onClick={this.toggleDropdown}>
                                <span className="glyphicon glyphicon-download-alt" /> Download <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <a href="#" onClick={function (e) {
                                        e.preventDefault();
                                        this.setState({ DropdownOpen: false });
                                        this.downloadCsv();
                                    }.bind(this)}>CSV Report</a>
                                </li>
                                <li>
                                    <a href="#" onClick={function (e) {
                                        e.preventDefault();
                                        this.setState({ DropdownOpen: false });
                                        this.downloadPdf();
                                    }.bind(this)}>PDF Report</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr />
                    {this.getList()}
                    {this.getSummaryRow()}
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
    statusChange: function (val) {
        var value = (val && val.currentTarget) ? val.currentTarget.value : val;
        this.setState({ Status: value });
    },
    transTypeChange: function (val) {
        var value = (val && val.currentTarget) ? val.currentTarget.value : val;
        this.setState({ TransType: value });
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
        urlParams += "&transType=" + this.state.TransType;
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
        urlParams += "&transType=" + this.state.TransType;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxDownload('api/BankStatement/bankstatementrep' + urlParams + '&repType=csv', function () {
            _ProgressBar.IMDone();
        }.bind(this), 'bankstatement.csv');
    },
    downloadPdf: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&remark=" + this.Remark.value;
        urlParams += "&status=" + this.state.Status;
        urlParams += "&transType=" + this.state.TransType;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/BankStatement/bankstatementrep' + urlParams + '&repType=pdf', function () {
            _ProgressBar.IMDone();
        }.bind(this), 'bankstatement.pdf');
    },
    getSummaryRow: function () {
        var totalAmount = 0;
        this.state.Items.forEach(function (item) {
            totalAmount += item.Amount;
        });

        return (
            <div className="listItem1">
                <div className="row">
                    <div className="row fontSizeSr">
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Total
                        </div>
                        <div className="col col-xs-3 paddingL5">
                        </div>
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Amount
                        </div>
                        <div className="col col-xs-3 paddingL5 fontWeightB">
                            {numberWithCommas(totalAmount)}
                        </div>
                    </div>
                </div>
            </div>
        );
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
                    {(item.DR_Account || item.CR_Account) &&
                        <div className="row fontSizeSr">
                            <div className="col col-xs-3 paddingR5 textAlignR">
                                DR:CR
                            </div>
                            <div className="col col-xs-9 paddingL5">
                                {item.DR_Account || "-"} : {item.CR_Account || "-"}
                            </div>
                        </div>
                    }
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