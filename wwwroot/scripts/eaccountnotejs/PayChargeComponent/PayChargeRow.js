var PayChargeRow = React.createClass({
    displayName: "PayChargeRow",

    getInitialState: function () {
        return {
            Selected: true
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { className: this.getCSSClass(), onClick: this.actionOnSelect },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Account"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 fontWeightB paddingL5" },
                    this.props.Item.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 textAlignR paddingR5" },
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
                    "  \xA0 ",
                    getFormattedDate(this.props.Item.ChargeDt)
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Item"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 fontWeightB paddingL5" },
                    this.props.Item.ItemName
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Remark"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 fontWeightB paddingL5" },
                    this.props.Item.Remark
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Amount"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 fontWeightB textAlignL paddingL5 colorBlue" },
                    this.props.Item.Amount
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 textAlignR paddingR5" },
                    "Paid"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 fontWeightB paddingL5 colorGreen" },
                    this.props.Item.PaidAmount
                )
            ),
            !this.isPaymentComplete() && React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 textAlignR paddingR5" },
                        "Pending"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-6 paddingL5 colorRed fontSizeLr fontWeight900" },
                        this.props.Item.Amount - this.props.Item.PaidAmount
                    ),
                    this.props.Item.Selected && React.createElement(
                        "div",
                        { className: "col col-xs-3 textAlignR selIcon" },
                        React.createElement("span", { className: "glyphicon glyphicon-ok-circle" })
                    ),
                    !this.props.Item.Selected && React.createElement(
                        "div",
                        { className: "col col-xs-3 textAlignR nonSelIcon" },
                        React.createElement("span", { className: "glyphicon glyphicon-ok-circle" })
                    )
                )
            )
        );
    },
    getCSSClass: function () {
        return this.props.Item.Selected ? "listItem6Sel" : "listItem6";
    },
    isPaymentComplete: function () {
        return this.props.Item.Amount == this.props.Item.PaidAmount;
    },
    actionOnSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});