var RevertAdvChargeTransRow = React.createClass({
    displayName: "RevertAdvChargeTransRow",

    render: function () {
        return React.createElement(
            "div",
            { className: "listItem4", onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4 paddingR5 textAlignR" },
                    "Order No:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    this.props.Item.AdvChargeNo
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingR5 textAlignR" },
                    "Date:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5" },
                    getFormattedDate2(this.props.Item.AdvChargeDt)
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4  paddingR5 textAlignR fontWeightB" },
                    "DR Account:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-8 paddingL5 fontWeightB" },
                    this.props.Item.DrAccount
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4  paddingR5 textAlignR fontWeightB" },
                    "Item:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-8 paddingL5 fontWeightB" },
                    this.props.Item.ItemName
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4  paddingR5 textAlignR" },
                    "CR Account:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-8 paddingL5" },
                    this.props.Item.CrAccount
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4  paddingR5 textAlignR" },
                    "Amount:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-8 paddingL5 fontWeightB" },
                    this.props.Item.Amount
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4  paddingR5 textAlignR" },
                    "Transaction ID:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-8 paddingL5 fontWeightB" },
                    this.props.Item.TransactionId
                )
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});