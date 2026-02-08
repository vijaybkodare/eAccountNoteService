var TransMapper = React.createClass({
    getInitialState: function () {
        return {
            MemberAccounts: [],
            BankStatements: [],
            TransMapping: [],
            SelCharges: [],
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowNext} Title="Transaction Mapper" />
                <div className="panel-body">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label className="mandatory">From Date</label>
                                <FlatPickrDate ref={function (node) { this.FromDt = node; }.bind(this)} />
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label className="mandatory">To Date</label>
                                <FlatPickrDate ref={function (node) { this.ToDt = node; }.bind(this)} />
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label>Account</label>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <select ref={function (node) { this.selAccount = node; }.bind(this)} className="form-control" onChange={this.actionOnTokenTypeChange}
                                            style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}>
                                            {
                                                this.state.MemberAccounts.map((item, index) => <option key={index} value={item.AccountId}>{item.AccountName}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3">
                            <div className="form-group">
                                <label>Bank Statement</label>
                                <div className="row">
                                    <div className="col-xs-8" style={{ paddingRight: "0px" }}>
                                        <select ref={function (node) { this.selBankStatement = node; }.bind(this)} className="form-control" onChange={this.actionOnTokenTypeChange}
                                            style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}>
                                            {
                                                this.state.BankStatements.map((item, index) => <option key={index} value={item.BankStatementHeaderId}>{item.BankStatementNo + " - " + item.Remark}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="col-xs-4 textAlignR" style={{ paddingRight: "0px" }}>
                                        <button type="button" className="btn btn-success" onClick={this.getTransMapping}>Get Trans Mapping</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {this.loadTransMapping()}
                    </div>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function () {
        _Main.EAccountHome.hideAll();
        this.show();
        this.loadMemberAccountList();
        this.loadBankStatementList();
    },
    loadMemberAccountList: function () {
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('account/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            data.unshift({ AccountId: -1, AccountName: "None" });
            this.setState({
                MemberAccounts: data,
            });
        }.bind(this));
    },
    loadBankStatementList: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/BankStatement/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            data.unshift({ BankStatementHeaderId: -1, BankStatementNo: "None", Remark: "None" });
            this.setState({
                BankStatements: data,
            });
        }.bind(this));
    },
    getTransMapping: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&bankStatementHeaderId=" + this.selBankStatement.value;
        urlParams += "&accountId=" + this.selAccount.value;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxGet('api/AutoTransEntry/prepare' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                TransMapping: data,
                SelCharges: [],
            });
        }.bind(this));
    },
    loadTransMapping: function () {
        var srNo = 0;
        return this.state.TransMapping.map(function (item) {
            return <TransMapRow
                key={srNo}
                Item={item}
                SrNo={++srNo}
                SelCharges={this.state.SelCharges}
                ChargeItemSelChange={this.chargeItemSelChange}
            />
        }.bind(this));
    },
    chargeItemSelChange: function (bankStatementId, chargePayeeDetailId, isSel) {
        if (isSel) {
            this.state.SelCharges.push({ BankStatementId: bankStatementId, ChargePayeeDetailId: chargePayeeDetailId });
        } else {
            this.state.SelCharges.splice(this.state.SelCharges.findIndex(item => item.ChargePayeeDetailId == chargePayeeDetailId && item.BankStatementId == bankStatementId), 1);
        }
        this.setState({
            SelCharges: this.state.SelCharges,
        });
    },
});