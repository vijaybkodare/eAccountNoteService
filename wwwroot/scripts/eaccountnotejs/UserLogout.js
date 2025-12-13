var UserLogout = React.createClass({
    displayName: "UserLogout",

    getInitialState: function () {
        return {
            UserName: ''
        };
    },
    render: function () {
        return _LoginAccount.UserName ? React.createElement(
            "span",
            { style: { position: "absolute", top: 17, right: 10 } },
            React.createElement("span", { className: "glyphicon glyphicon-user" }),
            React.createElement(
                "span",
                { className: "urlTitle" },
                _LoginAccount.UserName
            ),
            React.createElement("span", { className: "glyphicon glyphicon-log-out", style: { marginLeft: 10, color: "red", cursor: "pointer" }, onClick: this.logout })
        ) : null
        //<a className="aRev" style={{ position: "absolute", top: 17, right: 10 }} onClick={this.goForUserReg}>
        //    <span className="glyphicon glyphicon-user" style={{ marginRight: 5, color:"white" }} />
        //    New User(Sign in)
        //</a>
        ;
    },
    logout: function () {
        _Main.goForLogin();
    },
    updateEntity: function () {
        this.setState({});
    },
    goForUserReg: function () {
        _Main.goForUserReg();
    }
});