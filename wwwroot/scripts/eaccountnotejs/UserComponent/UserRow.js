var UserRow = React.createClass({
    displayName: "UserRow",

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
                        null,
                        React.createElement(
                            "span",
                            { className: "badge badge-dark", style: { marginRight: 4 } },
                            this.props.SrNo
                        ),
                        React.createElement("span", { className: "glyphicon glyphicon-user", style: { marginRight: 7 } })
                    ),
                    this.props.Item.UserName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-6" },
                    this.props.Item.MobileNo
                )
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});