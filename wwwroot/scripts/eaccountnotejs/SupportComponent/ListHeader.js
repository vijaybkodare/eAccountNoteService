var ListHeader = React.createClass({
    displayName: "ListHeader",

    render: function () {
        var className = "glyphicon  glyphicon-" + (this.props.ItemSelMode ? "chevron-left" : "home");
        return React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "button",
                { className: "btn btn-primary", style: { marginRight: 7 }, onClick: this.props.ShowNextComponent },
                React.createElement("span", { className: className })
            ),
            "123",
            this.props.Title,
            React.createElement(
                "span",
                { style: { position: "absolute", top: 17, right: 10 } },
                React.createElement("span", { className: "glyphicon glyphicon-th" }),
                React.createElement(
                    "span",
                    { className: "urlTitle" },
                    _LoginAccount.OrgName
                )
            )
        );
    }
});