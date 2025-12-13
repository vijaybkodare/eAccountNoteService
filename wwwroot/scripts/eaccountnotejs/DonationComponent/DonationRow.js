var DonationRow = React.createClass({
    displayName: "DonationRow",

    render: function () {
        let rowClassName = this.props.RowClassName ? this.props.RowClassName : "listItem6";
        return React.createElement(
            "div",
            { className: rowClassName, onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Donation No:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingL5 fontWeightB" },
                    this.props.Item.DonationNo
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Date:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-4 paddingL5" },
                    getFormattedDate3(this.props.Item.DonationDt)
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-2  paddingR5 textAlignR fontWeightB" },
                    "Item:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-4 paddingL5 fontWeightB" },
                    this.props.Item.ItemName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2  paddingR5 textAlignR" },
                    "Account:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-4 paddingL5" },
                    this.props.Item.AccountName
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Remark:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-9 paddingL5" },
                    this.props.Item.Remark
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "Total Amount:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    this.props.Item.TotalAmount
                )
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});