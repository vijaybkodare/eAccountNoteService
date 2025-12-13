var TransMapAccountRow = React.createClass({
    displayName: "TransMapAccountRow",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "row listItem7" },
                React.createElement(
                    "div",
                    { className: "col col-sm-3 paddingR5 textAlignR" },
                    "Account:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-sm-3 paddingL5 fontWeightB" },
                    this.props.AccountDto.accountMaster.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col col-sm-3 paddingR5 textAlignR" },
                    "Weight:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-sm-3 paddingL5 fontWeightB" },
                    this.props.AccountDto.weight
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col col-sm-6" },
                    this.loadAccountTransTokens()
                ),
                React.createElement(
                    "div",
                    { className: "col col-sm-6" },
                    React.createElement(TransMapAccountChargeRow, {
                        key: this.props.BankStatement.BankStatementId + '-' + this.props.AccountDto.accountMaster.AccountId,
                        AccountId: this.props.AccountDto.accountMaster.AccountId,
                        BankStatement: this.props.BankStatement,
                        Items: this.props.AccountDto.chargePayeeDetails,
                        SelCharges: this.props.SelCharges,
                        ChargeItemSelChange: this.props.ChargeItemSelChange
                    })
                )
            )
        );
    },
    loadAccountTransTokens: function () {
        return this.props.AccountDto.accountTransTokens.map(function (item) {
            return React.createElement(TransMapAccountTokenRow, {
                key: this.props.BankStatement.BankStatementId + '-' + this.props.AccountDto.accountMaster.AccountId + '-' + item.TokenValue,
                Item: item
            });
        }.bind(this));
    }
});