var PayAccountRow = React.createClass({
    displayName: "PayAccountRow",

    render: function () {
        return React.createElement(
            "div",
            { className: this.getCSSClass(), onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-8" },
                    React.createElement(
                        "span",
                        null,
                        React.createElement(
                            "span",
                            { className: "badge badge-dark", style: { marginRight: 4 } },
                            this.props.SrNo
                        )
                    ),
                    this.props.Item.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-4", style: { textAlign: "right" } },
                    this.props.Item.PendingAmount
                )
            )
        );
    },
    getCSSClass: function () {
        return this.props.Item.PendingAmount == 0 ? "listItem3" : "listItem2";
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});