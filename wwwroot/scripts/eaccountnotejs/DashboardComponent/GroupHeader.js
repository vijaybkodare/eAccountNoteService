var GroupHeader = React.createClass({
    displayName: "GroupHeader",

    render: function () {
        var show = true;
        if (this.props.OnlyForAdmin) {
            show = isAdmin() || isSuperAdmin();
        }
        if (this.props.OnlyForSuperAdmin) {
            show = isSuperAdmin();
        }
        return show && React.createElement(
            "div",
            null,
            React.createElement("br", null),
            React.createElement(
                "span",
                { className: "group-title" },
                this.props.Title
            ),
            React.createElement("hr", null)
        );
    }
});