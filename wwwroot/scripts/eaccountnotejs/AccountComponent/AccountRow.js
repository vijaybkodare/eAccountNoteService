var AccountRow = React.createClass({
    displayName: "AccountRow",

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
                    { className: "col-xs-5" },
                    React.createElement(
                        "span",
                        { className: "badge badge-dark", style: { marginRight: 4 } },
                        this.props.SrNo
                    ),
                    this.props.Account.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-4" },
                    getAccountType(this.props.Account.AccountType)
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-3", style: { textAlign: "right", color: this.props.Account.Amount > 0 ? "green" : "red" } },
                    Math.abs(this.props.Account.Amount)
                )
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Account);
    }
});