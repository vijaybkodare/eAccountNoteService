var DashboardItem = React.createClass({
    displayName: "DashboardItem",

    getInitialState: function () {
        return {};
    },
    render: function () {
        var glyph = "glyphicon glyphicon-" + (this.props.Icon ? this.props.Icon : "cog");
        var show = true;
        if (this.props.OnlyForAdmin) {
            show = isAdmin();
        }
        if (this.props.OnlyForSuperAdmin) {
            show = isSuperAdmin();
        }
        return show && React.createElement(
            "div",
            { className: "dashboardItem", onClick: this.props.Show },
            React.createElement(
                "div",
                { className: "header" },
                React.createElement("span", { className: glyph })
            ),
            React.createElement(
                "div",
                { className: "footer" },
                this.props.Title
            )
        );
    }
});