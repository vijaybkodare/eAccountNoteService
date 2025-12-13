var RevertTransFooter = React.createClass({
    displayName: "RevertTransFooter",

    render: function () {
        return React.createElement(
            "div",
            { className: "panel-footer text-center" },
            React.createElement(
                "button",
                { type: "button", className: "btn btn-danger", onClick: this.props.Revert },
                "Revert"
            )
        );
    }
});