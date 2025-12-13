var TransMapRow = React.createClass({
    displayName: "TransMapRow",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "row listItem4", style: { marginLeft: "5px", marginRight: "5px" } },
            React.createElement(
                "div",
                { className: "col col-sm-3" },
                React.createElement(
                    "span",
                    { className: "badge badge-dark", style: { marginRight: 4 } },
                    this.props.SrNo
                ),
                React.createElement(
                    "span",
                    { className: "fontSizeSm" },
                    getFormattedDate3(this.props.Item.bankStatement.TransDt)
                ),
                "\xA0\xA0\xA0",
                React.createElement(
                    "span",
                    { className: "fontSizeLg fontWeightB" },
                    this.props.Item.bankStatement.Amount
                ),
                React.createElement("br", null),
                this.props.Item.bankStatement.Remark
            ),
            React.createElement(
                "div",
                { className: "col col-sm-9" },
                this.loadMapAccounts()
            )
        );
    },
    loadMapAccounts: function () {
        if (!this.props.Item.accountDtos) {
            return null;
        }
        return this.props.Item.accountDtos.map(function (item) {
            return React.createElement(TransMapAccountRow, {
                key: item.accountMaster.AccountId,
                BankStatement: this.props.Item.bankStatement,
                AccountDto: item,
                SelCharges: this.props.SelCharges,
                ChargeItemSelChange: this.props.ChargeItemSelChange
            });
        }.bind(this));
    }
});