var TransMapAccountTokenRow2 = React.createClass({
    displayName: "TransMapAccountTokenRow2",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "listItem6" },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingR5 textAlignR" },
                    "Name:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingL5 fontWeightB" },
                    this.props.AccountTransToken.TokenName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingR5 textAlignR" },
                    "Value:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingL5 fontWeightB" },
                    this.props.AccountTransToken.TokenValue
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingR5 textAlignR" },
                    "Weight:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingL5 fontWeightB" },
                    this.props.AccountTransToken.TokenWeight
                )
            )
        );
    }

});