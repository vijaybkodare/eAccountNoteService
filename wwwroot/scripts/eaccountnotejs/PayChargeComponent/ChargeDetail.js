var ChargeDetail = React.createClass({
    displayName: "ChargeDetail",

    render: function () {
        return React.createElement(
            "div",
            { className: "listItem6Sel fontSizeS" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col col-xs-6 paddingR5 textAlignR" },
                    "Account:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-6 paddingL5 fontWeightB" },
                    this.props.Entity.AccountName
                )
            ),
            this.props.Entity.ChargePayeeDetailIds.length == 1 && React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-2 textAlignR paddingR5" },
                        "Order:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 paddingL5" },
                        React.createElement(
                            "span",
                            { className: "fontWeightB" },
                            this.props.Entity.ChargeItem.ChargeOrderNo
                        ),
                        "  \xA0 ",
                        getFormattedDate(this.props.Entity.ChargeItem.ChargeDt)
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-2 textAlignR paddingR5" },
                        "Item:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 fontWeightB paddingL5" },
                        this.props.Entity.ChargeItem.ItemName
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-5 textAlignR paddingR5" },
                        "Remark:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-7 fontWeightB paddingL5" },
                        this.props.Entity.ChargeItem.Remark
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col col-xs-6 paddingR5 textAlignR" },
                    "Pending Amount:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-6 paddingL5 fontWeightB fontSizeLr colorRed" },
                    this.props.Entity.Amount
                )
            )
        );
    }
});