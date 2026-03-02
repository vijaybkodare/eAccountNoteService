var ChargeTransMapper = React.createClass({
    getInitialState: function () {
        return {
            MemberAccounts: [],
            BankStatements: [],
            ChargeTransactions: [],
            SelCharge: {},
            SelBank: {},
            AmountFilter: "",
            TransIdFilter: "",
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowNext} Title="Charge Transaction Mapper" />
                <div className="panel-body">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="form-group">
                                <label className="mandatory">From Date</label>
                                <FlatPickrDate ref={function (node) { this.FromDt = node; }.bind(this)} />
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="form-group">
                                <label className="mandatory">To Date</label>
                                <FlatPickrDate ref={function (node) { this.ToDt = node; }.bind(this)} />
                            </div>
                        </div>

                        <div className="col-sm-3">
                            <div className="form-group">
                                <label>Account</label>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <select ref={function (node) { this.selAccount = node; }.bind(this)} className="form-control"
                                            style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}>
                                            {
                                                this.state.MemberAccounts.map((item, index) => <option key={index} value={item.AccountId}>{item.AccountName}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 textAlignC" style={{ paddingRight: "0px", marginTop: "25px" }}>
                            <button type="button" className="btn btn-primary" onClick={this.getChargeTransMapping}>Get Charge Trans Mapping</button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6 textAlignC" style={{ borderRightStyle: "solid" }}>
                            Bank Statements Transactions
                        </div>
                        <div className="col-sm-6 textAlignC" style={{ borderLeftStyle: "solid" }}>
                            Charge Transactions
                        </div>
                    </div>
                    {
                        (this.state.SelBank.Selected && this.state.SelCharge.Selected && this.state.SelBank.Amount == this.state.SelCharge.Amount) ?
                            <div className="row">
                                <div className="col-sm-12 textAlignC">
                                    <button type="button" className="btn btn-success" onClick={this.mapChargeTrans}>Save Trans Mapping</button>
                                </div>
                            </div>
                            :
                            <div className="row">
                                <div className="col-sm-2"></div>
                                <div className="col-sm-4 textAlignC">
                                    <input ref={function (node) { this.TxtAmount = node; }.bind(this)}
                                        type="number" className="form-control" placeholder="Search by Amount" onChange={this.searchChange} />
                                </div>
                                <div className="col-sm-4 textAlignC">
                                    <input ref={function (node) { this.TxtTransId = node; }.bind(this)}
                                        type="text" className="form-control" placeholder="Search by Trans Id" onChange={this.searchChange} />
                                </div>
                            </div>
                    }
                    <div className="row">
                        <div className="col-sm-6" style={{ borderRightStyle: "solid" }}>
                            {this.loadBankStatements()}
                        </div>
                        <div className="col-sm-6" style={{ borderLeftStyle: "solid" }}>
                            {this.loadChargeTransactions()}
                        </div>
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
    searchChange: function () {
        this.setState({
            AmountFilter: this.TxtAmount.value,
            TransIdFilter: this.TxtTransId.value
        });
    },
    getBankStatements: function () {
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        urlParams += "&accountId=" + this.selAccount.value;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxGet('api/ChargeTransMap/bankstatements' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                BankStatements: data,
            });
        }.bind(this));
    },
    getChargeTransactions: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&accountId=" + this.selAccount.value;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxGet('api/ChargeTransMap/chargetransactions' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                ChargeTransactions: data,
            });
        }.bind(this));
    },
    getChargeTransMapping: function () {
        this.getBankStatements();
        this.getChargeTransactions();
    },
    loadChargeTransactions: function () {
        return this.state.ChargeTransactions.map(function (item) {
            var amountMatch = this.state.AmountFilter == "" || item.Amount == parseInt(this.state.AmountFilter);
            var transIdMatch = this.state.TransIdFilter == "" || (item.TransactionId && item.TransactionId.toLowerCase().indexOf(this.state.TransIdFilter.toLowerCase()) !== -1);

            if (amountMatch && transIdMatch) {
                return (
                    <ChargeTransMapChargeRow
                        key={item.Source + item.Id}
                        Item={item}
                        ActionOnItemSelect={this.actionOnChargeSelect}
                    />
                );
            }
        }.bind(this));
    },
    loadBankStatements: function () {
        return this.state.BankStatements.map(function (item) {
            var amountMatch = this.state.AmountFilter == "" || Math.abs(item.Amount) == parseInt(this.state.AmountFilter);
            var transIdMatch = this.state.TransIdFilter == "" || (item.Remark && item.Remark.toLowerCase().indexOf(this.state.TransIdFilter.toLowerCase()) !== -1);

            if (amountMatch && transIdMatch) {
                return (
                    <ChargeTransMapBankRow
                        key={item.BankStatementId}
                        Item={item}
                        ActionOnItemSelect={this.actionOnBankSelect}
                    />
                );
            }
        }.bind(this));
    },
    actionOnChargeSelect: function (item) {
        item.Selected = !item.Selected;
        this.state.ChargeTransactions.forEach((itm, index) => {
            if (itm == item) return;
            itm.Selected = false;
        });
        this.setState({ SelCharge: item });
    },
    actionOnBankSelect: function (item) {
        item.Selected = !item.Selected;
        this.state.BankStatements.forEach((itm, index) => {
            if (itm == item) return;
            itm.Selected = false;
        });
        this.setState({ SelBank: item });
    },
    mapChargeTrans: function () {
        let dataToPost = {
            BankStatementId: this.state.SelBank.BankStatementId,
            ChargePayTransId: this.state.SelCharge.Id,
            Source: this.state.SelCharge.Source
        };
        _ProgressBar.IMBusy();
        axiosPost('api/ChargeTransMap/mapchargetrans', dataToPost, function (data) {
            _ProgressBar.IMDone();
            this.setState({ SelBank: {}, SelCharge: {}, AmountFilter: "", TransIdFilter: "" });
            this.getChargeTransMapping();
        }.bind(this));
    },
});
