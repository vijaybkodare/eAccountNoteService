var ChargeAccountRow = React.createClass({
    displayName: "ChargeAccountRow",

    getInitialState: function () {
        return {
            TriggerDelete: false
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "listItem0" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-6" },
                    React.createElement(
                        "span",
                        null,
                        React.createElement(
                            "span",
                            { className: "badge badge-dark", style: { marginRight: 4 } },
                            this.props.SrNo
                        )
                    ),
                    this.props.Account.AccountName
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-2", style: { textAlign: "right" } },
                    this.props.Account.Amount
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-2", style: { textAlign: "right" } },
                    this.props.Account.PaidAmount
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-2" },
                    !this.state.TriggerDelete && this.props.Account.Amount != this.props.Account.PaidAmount && React.createElement("span", { className: "glyphicon glyphicon-trash", style: { color: "red" }, onClick: this.actionOnDelete, "aria-hidden": "true" }),
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
        this.props.Remove(this.props.Account);
        this.setState({ TriggerDelete: false });
    },
    actionOnDeleteCancel: function () {
        this.setState({ TriggerDelete: false });
    }
});