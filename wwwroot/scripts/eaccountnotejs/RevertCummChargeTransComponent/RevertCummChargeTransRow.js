var RevertCummChargeTransRow = React.createClass({
    displayName: "RevertCummChargeTransRow",

    render: function () {
        return React.createElement(
            "div",
            { className: "listItem6", onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4 paddingR5 textAlignR" },
                    "Date:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-8 paddingL5" },
                    getFormattedDate(this.props.Item.AddedDt)
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
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4  paddingR5 textAlignR" },
                    "Remark:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-8 paddingL5 fontWeightB" },
                    this.props.Item.Remark
                )
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});