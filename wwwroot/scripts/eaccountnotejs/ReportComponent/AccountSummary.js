var AccountSummary = React.createClass({
    displayName: "AccountSummary",

    getInitialState: function () {
        return {
            Entity: {
                TotalChargeUnpaid: 0,
                TotalBillUnpaid: 0,
                TotalBalance: 0
            }
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "listItem5" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-6 textAlignR fontWeightB fontSizeS" },
                    "Pending Charges:"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-4 textAlignR fontWeightB fontSizeL colorRed" },
                    numberWithCommas(this.state.Entity.TotalChargeUnpaid)
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-6 textAlignR fontWeightB fontSizeS" },
                    "Pending Bills:"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-4 textAlignR fontWeightB fontSizeL colorOrange" },
                    numberWithCommas(this.state.Entity.TotalBillUnpaid)
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-6 textAlignR fontWeightB fontSizeS" },
                    "Balance:"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-4 textAlignR fontWeightB fontSizeL colorGreen" },
                    numberWithCommas(this.state.Entity.TotalBalance)
                )
            )
        );
    },
    updateEntity: function (entity) {
        this.setState({
            Entity: entity
        });
    }
});