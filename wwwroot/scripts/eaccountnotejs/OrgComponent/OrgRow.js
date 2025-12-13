var OrgRow = React.createClass({
    displayName: "OrgRow",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            { className: this.props.Selected ? "listItemSelected" : "listItem", onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-6" },
                    React.createElement(
                        "span",
                        { className: "badge badge-dark", style: { marginRight: 4 } },
                        this.props.SrNo
                    ),
                    this.props.Item.OrgName
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-6" },
                    getAccountType(this.props.Item.Address)
                )
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    }
});