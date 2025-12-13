var TransTokenRow = React.createClass({
    displayName: "TransTokenRow",

    getInitialState: function () {
        return {
            TriggerDelete: false
        };
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
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Name:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    this.props.Entity.TokenName
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Value:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    this.props.Entity.TokenValue
                )
            ),
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
                    "Weight:"
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingL5 fontWeightB" },
                    this.props.Entity.TokenWeight
                ),
                React.createElement(
                    "div",
                    { className: "col col-xs-6 paddingL5 textAlignR" },
                    !this.state.TriggerDelete && React.createElement("span", { className: "glyphicon glyphicon-trash", style: { color: "red" }, onClick: this.actionOnDelete, "aria-hidden": "true" }),
                    this.state.TriggerDelete && React.createElement("span", { className: "glyphicon glyphicon-ok paddingR5", style: { color: "green" }, onClick: this.actionOnDeleteConfirm, "aria-hidden": "true" }),
                    this.state.TriggerDelete && React.createElement("span", { className: "glyphicon glyphicon-remove", style: { color: "orange" }, onClick: this.actionOnDeleteCancel, "aria-hidden": "true" })
                )
            )
        );
    },
    actionOnDelete: function () {
        this.setState({ TriggerDelete: true });
    },
    actionOnDeleteConfirm: function () {
        this.props.ActionOnItemDelete(this.props.Entity);
    },
    actionOnDeleteCancel: function () {
        this.setState({ TriggerDelete: false });
    }
});