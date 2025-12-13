var RevertBillTransRow = React.createClass({
    displayName: "RevertBillTransRow",

    render: function () {
        return React.createElement(
            "div",
            { className: "listItem4", onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Bill No."
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    this.props.Item.BillNo
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Date"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5" },
                    getFormattedDate(this.props.Item.BillDt)
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
                    "Amount"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5 fontWeightB" },
                    this.props.Item.Amount
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Remark"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5 fontWeightB" },
                    this.props.Item.BillRemark
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-4 paddingR5 textAlignR" },
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