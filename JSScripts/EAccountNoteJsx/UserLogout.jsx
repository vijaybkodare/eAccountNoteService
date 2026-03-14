var UserLogout = React.createClass({
    getInitialState: function () {
        return {
            UserName: '',
        };
    },
    render: function () {
        return (
            _LoginAccount.UserName ?
                <span style={{ position: "absolute", top: 14, right: 10, display: "flex", alignItems: "center" }}>
                    <a href="/content/AccountNote.pdf" target="_blank" className="btn btn-default btn-xs"
                        style={{ marginRight: 15, fontWeight: "bold" }} title="Help">
                        <span className="glyphicon glyphicon-question-sign" /> Help
                    </a>
                    <span className="glyphicon glyphicon-user" style={{ marginLeft: 5 }} />
                    <span className="urlTitle" >{_LoginAccount.UserName}</span>
                    <span className="glyphicon glyphicon-log-out" style={{ marginLeft: 10, color: "red", cursor: "pointer" }} onClick={this.logout} />
                </span>
                :
                <span style={{ position: "absolute", top: 14, right: 10 }}>
                    <a href="/content/AccountNote.pdf" target="_blank" className="btn btn-default btn-xs"
                        style={{ fontWeight: "bold" }} title="Help">
                        <span className="glyphicon glyphicon-question-sign" /> Help
                    </a>
                </span>

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
