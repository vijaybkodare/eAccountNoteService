var UserLogout = React.createClass({
    getInitialState: function () {
        return {
            UserName: '',
        };
    },
    render: function () {
        return (
            _LoginAccount.UserName ?
                <span style={{ position: "absolute", top: 17, right: 10 }}>
                    <span className="glyphicon glyphicon-user" />
                    <span className="urlTitle" >{_LoginAccount.UserName}</span>
                    <span className="glyphicon glyphicon-log-out" style={{ marginLeft: 10, color: "red", cursor: "pointer" }} onClick={this.logout} />
                </span>
                :
                null
                //<a className="aRev" style={{ position: "absolute", top: 17, right: 10 }} onClick={this.goForUserReg}>
                //    <span className="glyphicon glyphicon-user" style={{ marginRight: 5, color:"white" }} />
                //    New User(Sign in)
                //</a>
        );
    },
    logout: function () {
        _Main.goForLogin();
    },
    updateEntity: function () {
        this.setState({});
    },
    goForUserReg: function () {
        _Main.goForUserReg();
    },
});
