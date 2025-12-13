var TransMapper = React.createClass({
    displayName: "TransMapper",

    getInitialState: function () {
        return {
            MemberAccounts: [],
            BankStatements: [],
            TransMapping: [],
            SelCharges: []
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowNext, Title: "Transaction Mapper" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-sm-4" },
                        React.createElement(DateSelector, { Label: "From Date", ref: function (node) {
                                this.FromDt = node;
                            }.bind(this) })
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-4" },
                        React.createElement(DateSelector, { Label: "To Date", ref: function (node) {
                                this.ToDt = node;
                            }.bind(this) })
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-4" },
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement(
                                "label",
                                null,
                                "Account"
                            ),
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "div",
                                    { className: "col-xs-12" },
                                    React.createElement(
                                        "select",
                                        { ref: function (node) {
                                                this.selAccount = node;
                                            }.bind(this), className: "form-control", onChange: this.actionOnTokenTypeChange,
                                            style: { borderTopRightRadius: "0px", borderBottomRightRadius: "0px" } },
                                        this.state.MemberAccounts.map((item, index) => React.createElement(
                                            "option",
                                            { key: index, value: item.AccountId },
                                            item.AccountName
                                        ))
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-sm-6 col-sm-offset-3" },
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement(
                                "label",
                                null,
                                "Bank Statement"
                            ),
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "div",
                                    { className: "col-xs-8", style: { paddingRight: "0px" } },
                                    React.createElement(
                                        "select",
                                        { ref: function (node) {
                                                this.selBankStatement = node;
                                            }.bind(this), className: "form-control", onChange: this.actionOnTokenTypeChange,
                                            style: { borderTopRightRadius: "0px", borderBottomRightRadius: "0px" } },
                                        this.state.BankStatements.map((item, index) => React.createElement(
                                            "option",
                                            { key: index, value: item.BankStatementHeaderId },
                                            item.BankStatementNo + " - " + item.Remark
                                        ))
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "col-xs-4 textAlignR", style: { paddingRight: "0px" } },
                                    React.createElement(
                                        "button",
                                        { type: "button", className: "btn btn-success", onClick: this.getTransMapping },
                                        "Get Trans Mapping"
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    this.loadTransMapping()
                )
            )
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
                MemberAccounts: data
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
                BankStatements: data
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
                SelCharges: []
            });
        }.bind(this));
    },
    loadTransMapping: function () {
        var srNo = 0;
        return this.state.TransMapping.map(function (item) {
            return React.createElement(TransMapRow, {
                key: srNo,
                Item: item,
                SrNo: ++srNo,
                SelCharges: this.state.SelCharges,
                ChargeItemSelChange: this.chargeItemSelChange
            });
        }.bind(this));
    },
    chargeItemSelChange: function (bankStatementId, chargePayeeDetailId, isSel) {
        if (isSel) {
            this.state.SelCharges.push({ BankStatementId: bankStatementId, ChargePayeeDetailId: chargePayeeDetailId });
        } else {
            this.state.SelCharges.splice(this.state.SelCharges.findIndex(item => item.ChargePayeeDetailId == chargePayeeDetailId && item.BankStatementId == bankStatementId), 1);
        }
        this.setState({
            SelCharges: this.state.SelCharges
        });
    }
});