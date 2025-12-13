var AccountTransTokenRow = React.createClass({
    displayName: "AccountTransTokenRow",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "listItem", onClick: this.actionOnItemSelect },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-7" },
                    React.createElement(
                        "span",
                        { className: "badge badge-dark", style: { marginRight: 4 } },
                        this.props.SrNo
                    ),
                    this.props.AccountDto.accountMaster.AccountName
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                this.props.AccountDto.accountTransTokens.map(function (token) {
                    return React.createElement(AccountTransTokenItemRow, {
                        Entity: token
                    });
                })
            )
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.AccountDto.accountMaster);
    }
});