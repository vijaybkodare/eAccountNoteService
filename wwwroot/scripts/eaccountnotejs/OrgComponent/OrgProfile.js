var OrgProfile = React.createClass({
    displayName: "OrgProfile",

    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: "Org Profile" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "div",
                    { className: "listItem" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { textAlign: "right" } },
                            "Org Name:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontWeight: "bold" } },
                            _LoginAccount.UserName
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontSize: "smaller", textAlign: "right" } },
                            "Login Id:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontSize: "smaller" } },
                            _LoginAccount.LoginId
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontSize: "smaller", textAlign: "right" } },
                            "Email Id:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontSize: "smaller" } },
                            _LoginAccount.EmailId
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { textAlign: "right" } },
                            "Mobile No.:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontWeight: "bold" } },
                            _LoginAccount.MobileNo
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { textAlign: "right" } },
                            "Role:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontWeight: "bold" } },
                            this.getRole(_LoginAccount.RoleId)
                        )
                    )
                )
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function () {
        _Main.EAccountHome.hideAll();
        this.updateEntity();
        this.show();
    },
    updateEntity: function () {
        this.setState({});
    }
});