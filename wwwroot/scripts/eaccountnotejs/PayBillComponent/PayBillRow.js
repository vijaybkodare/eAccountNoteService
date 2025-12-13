var PayBillRow = React.createClass({
    displayName: "PayBillRow",

    render: function () {
        return React.createElement(
            "div",
            { className: this.getCSSClass(), onClick: this.actionOnItemSelect },
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
                    "Remark"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5 fontWeightB" },
                    this.props.Item.Remark
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
                    { className: "col col-xs-3 paddingL5 colorBlue fontWeightB" },
                    this.props.Item.Amount
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Paid"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 colorGreen fontWeightB" },
                    this.props.Item.PaidAmount
                )
            ),
            !this.isPaymentComplete() && React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Pending"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-4 paddingL5 fontWeight900 colorRed fontSizeLr" },
                    this.props.Item.Amount - this.props.Item.PaidAmount
                )
            )
        );
    },
    getCSSClass: function () {
        return this.isPaymentComplete() ? "listItem3" : "listItem2";
    },
    isPaymentComplete: function () {
        return this.props.Item.Amount == this.props.Item.PaidAmount;
    },
    actionOnItemSelect: function () {
        if (this.props.Item.Amount > this.props.Item.PaidAmount) {
            this.props.ActionOnItemSelect(this.props.Item);
        }
    }
});