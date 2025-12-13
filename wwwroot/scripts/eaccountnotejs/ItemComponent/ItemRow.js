var ItemRow = React.createClass({
    displayName: "ItemRow",

    render: function () {
        return React.createElement(
            "div",
            { className: "listItem", onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col col-xs-6" },
                    React.createElement(
                        "span",
                        { className: "badge badge-dark", style: { marginRight: 4 } },
                        this.props.SrNo
                    ),
                    this.props.Item.ItemName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-6" },
                    this.props.Item.AccountName
                )
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});