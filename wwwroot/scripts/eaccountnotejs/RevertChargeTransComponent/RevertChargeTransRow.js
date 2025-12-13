var RevertChargeTransRow = React.createClass({
    displayName: "RevertChargeTransRow",

    render: function () {
        return React.createElement(
            "div",
            { className: "listItem6", onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Account"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingL5 fontWeightB" },
                    this.props.Item.DrAccount
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingR5 textAlignR" },
                    "Order"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-5 paddingL5" },
                    React.createElement(
                        "span",
                        { className: "fontWeightB" },
                        this.props.Item.ChargeOrderNo
                    ),
                    "  \xA0",
                    getFormattedDate(this.props.Item.PaymentDt)
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Item"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5 fontWeightB" },
                    this.props.Item.ItemName
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Account"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5" },
                    this.props.Item.CrAccount
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Trans ID"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5 fontWeightB" },
                    this.props.Item.TransactionId
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Amount"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5 fontWeightB" },
                    this.props.Item.Amount
                )
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});