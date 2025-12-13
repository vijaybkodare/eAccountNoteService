var TransMapAccountChargesRow1 = React.createClass({
    displayName: "TransMapAccountChargesRow1",

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
        return this.props.AccountDto.chargePayeeDetails.map(function (item) {
            return React.createElement(PayChargeRow, {
                Item: item
            });
        }.bind(this));
    }
});