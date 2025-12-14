var AddEditHeader = React.createClass({
    displayName: "AddEditHeader",

    render: function () {
        return React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "button",
                { className: "btn btn-primary", style: { marginRight: 7 }, onClick: this.props.ShowList },
                React.createElement("span", { className: "glyphicon glyphicon-chevron-left" })
            ),
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