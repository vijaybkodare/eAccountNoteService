var OrgProfile = React.createClass({
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowList} Title="Org Profile" />
                <div className="panel-body">
                    <div className="listItem">
                        <div className="row">
                            <div className="col col-xs-6" style={{ textAlign: "right" }}>
                                Org Name:
                            </div>
                            <div className="col col-xs-6" style={{ fontWeight: "bold" }}>
                                {_LoginAccount.UserName}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-6" style={{ fontSize: "smaller", textAlign: "right" }}>
                                Login Id:
                            </div>
                            <div className="col col-xs-6" style={{ fontSize: "smaller" }}>
                                {_LoginAccount.LoginId}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-6" style={{ fontSize: "smaller", textAlign: "right" }}>
                                Email Id:
                            </div>
                            <div className="col col-xs-6" style={{ fontSize: "smaller" }}>
                                {_LoginAccount.EmailId}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-6" style={{ textAlign: "right" }}>
                                Mobile No.:
                            </div>
                            <div className="col col-xs-6" style={{ fontWeight: "bold" }}>
                                {_LoginAccount.MobileNo}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-6" style={{ textAlign: "right" }}>
                                Role:
                            </div>
                            <div className="col col-xs-6" style={{ fontWeight: "bold" }}>
                                {this.getRole(_LoginAccount.RoleId)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
    },
});