var AddOrg = React.createClass({
    getInitialState: function () {
        return {
            NotValidInput: true
        };
    },
    agreeOnTermsAndConditions: false,
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowList} Title="Add Organization" />
                <div className="panel-body">
                    <form>
                        <div className="form-group">
                            <label className="mandatory">User Name</label>
                            <input ref={function (node) { this.UserName = node; }.bind(this)}
                                type="text" className="form-control" placeholder="User Name" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Organization</label>
                            <input ref={function (node) { this.OrgName = node; }.bind(this)}
                                type="text" className="form-control" placeholder="Account Name" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Address</label>
                            <input ref={function (node) { this.Address = node; }.bind(this)}
                                type="text" className="form-control" placeholder="Address" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Login Id</label>
                            <input ref={function (node) { this.LoginId = node; }.bind(this)}
                                type="text" className="form-control" placeholder="Login Id" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Email Id</label>
                            <input ref={function (node) { this.EmailId = node; }.bind(this)}
                                type="text" className="form-control" placeholder="Email Id" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Password</label>
                            <input ref={function (node) { this.Password = node; }.bind(this)}
                                type="password" className="form-control" placeholder="Password" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Retype Password</label>
                            <input ref={function (node) { this.RetypePassword = node; }.bind(this)}
                                type="password" className="form-control" placeholder="Retype Password" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Mobile No</label>
                            <input ref={function (node) { this.MobileNo = node; }.bind(this)} type="number" className="form-control" placeholder="Mobile No" onChange={this.inputChange} />
                        </div>
                    </form>
                </div>
                <div className="panel-footer text-center">
                    <button disabled={this.state.NotValidInput} type="button" className="btn btn-success" onClick={this.addAccount}>
                        <span className="glyphicon glyphicon-floppy-disk" style={{ marginRight: 7 }} />
                        Register
                    </button>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.show();
    },
    inputChange: function () {
        if (this.UserName.value.length == 0
            || this.LoginId.value.length == 0
            || this.EmailId.value.length == 0
            || this.Password.value.length == 0
            || this.RetypePassword.value.length == 0
            || this.Address.value.length == 0
            || this.OrgName.value.length == 0
            || this.MobileNo.value.length == 0
            || this.Password.value != this.RetypePassword.value)
            this.setState({ NotValidInput: true });
        else
            this.setState({ NotValidInput: false });
    },
    showTermsAndConditions: function () {
        _Main.goForTermsAndConditions();
    },
    goForLogin: function (e) {
        _Main.goForLogin();
    },
    addAccount: function () {
        var entity = {
            OrgId: -1,
            RoleId: 1,
            UserId: -1,
            LoginId: this.LoginId.value,
            EmailId: this.EmailId.value,
            Password: this.Password.value,
            MobileNo: this.MobileNo.value,
            UserName: this.UserName.value,
            OrgName: this.OrgName.value,
            Address: this.Address.value,
        }
        _ProgressBar.IMBusy();
        axiosPost('api/Org/save', entity, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                _OkMustReadInfo.show("Congrats!!, You are successfully registered.", function () {
                    this.goForLogin();
                }.bind(this));
            }
            else {
                _Alert.showWarning(data.Error, 5000);
            }
        }.bind(this));
    }
});