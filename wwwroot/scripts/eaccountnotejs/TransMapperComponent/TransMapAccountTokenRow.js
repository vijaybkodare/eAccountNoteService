var TransMapAccountTokenRow = React.createClass({
    displayName: "TransMapAccountTokenRow",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            { className: this.getCSSClass() },
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
                    this.props.Item.TokenName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingR5 textAlignR" },
                    "Value:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingL5 fontWeightB" },
                    this.props.Item.TokenValue
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingR5 textAlignR" },
                    "Weight:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-2 paddingL5 fontWeightB" },
                    this.props.Item.TokenWeight
                )
            )
        );
    },
    getCSSClass: function () {
        return this.props.Item.IsMatch ? "listItem6Sel" : "listItem6";
    }
});