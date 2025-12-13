var AccountTransTokenItemRow = React.createClass({
    displayName: "AccountTransTokenItemRow",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "row fontSizeSr" },
            React.createElement("div", { className: "col col-xs-2" }),
            React.createElement(
                "div",
                { className: "col col-xs-4" },
                this.props.Entity.TokenName
            ),
            React.createElement(
                "div",
                { className: "col col-xs-4" },
                this.props.Entity.TokenValue
            ),
            React.createElement(
                "div",
                { className: "col col-xs-2" },
                this.props.Entity.TokenWeight
            )
        );
    }
});