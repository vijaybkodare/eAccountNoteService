var TransMapAccountTokenRow1 = React.createClass({
    displayName: "TransMapAccountTokenRow1",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col col-sm-4" },
                this.props.AccountDto.accountMaster.AccountName
            )
        );
    },
    loadAccountTransTokens: function () {
        return this.props.AccountDto.accountTransTokens.map(function (item) {
            return React.createElement(TransMapAccountTokenRow2, {
                AccountTransToken: item
            });
        }.bind(this));
    }
});