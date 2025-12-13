var BankStatementRow = React.createClass({
    displayName: "BankStatementRow",

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
                    "Order No:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingL5 fontWeightB" },
                    this.props.Item.BankStatementNo
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Date:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-4 paddingL5" },
                    getFormattedDate3(this.props.Item.AddedDt)
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "From Date:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    getFormattedDate3(this.props.Item.FromDt)
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3  paddingR5 textAlignR" },
                    "To Date:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    getFormattedDate3(this.props.Item.ToDt)
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
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});