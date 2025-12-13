var UserReg = React.createClass({
    getInitialState: function () {
        return { 
             NotValidInput: true
        };
    },
    agreeOnTermsAndConditions: false,
    render: function() {
        return (
            <div ref={function(node){this.Component = node;}.bind(this)}
                className="panel panel-EAccNotePrim">
                <div className="panel-heading">
                    <button className="btn btn-primary" onClick={this.goForLogin}>
                        <span className="glyphicon glyphicon-chevron-left" style={{marginRight:7}}/>Back
                    </button> &nbsp;
                    User Registration
                </div>
                <div className="panel-body">
                    <form>
                        <div className="form-group">
                          <label className="mandatory">User Name</label>
                          <input ref={function(node){this.UserName = node;}.bind(this)} 
                            type="text" className="form-control" placeholder="User Name" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Organization</label>
                            <input ref={function (node) { this.OrgName = node; }.bind(this)}
                                type="text" className="form-control" placeholder="Account Name" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label>Login Id(Email Id)</label>
                          <input ref={function(node){this.EmailId = node;}.bind(this)} 
                                type="text" className="form-control" aria-describedby="mobileNoHelp" placeholder="Email Id" onChange={this.inputChange}/>
                          <small id="mobileNoHelp" className="form-text text-muted">
                            Enter valid EmailId, password will be send on EmailId.
                          </small>
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Mobile No</label>
                            <input ref={function (node) { this.MobileNo = node; }.bind(this)} type="number" className="form-control" aria-describedby="mobileNoHelp" placeholder="Mobile No" onChange={this.inputChange} />
                        </div>
                    </form>
                </div>
                <div className="panel-footer text-center">
                    <button disabled={this.state.NotValidInput} type="button" className="btn btn-success" onClick={this.addAccount}>
                        <span className="glyphicon glyphicon-floppy-disk" style={{marginRight:7}}/>
                        Register
                    </button>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    customShow: function(agree){
        if(agree == null)
            agree = false;
        this.agreeOnTermsAndConditions = agree;
    },
    inputChange: function(){
        if (this.UserName.value.length == 0
            || this.EmailId.value.length == 0
            || this.OrgName.value.length == 0)
            this.setState({NotValidInput: true});
        else
            this.setState({NotValidInput: false});
    },
    showTermsAndConditions: function(){
        _Main.goForTermsAndConditions();
    },
    goForLogin: function (e) {
        _Main.goForLogin();
    },
    addAccount: function () {
        var dataToPost = new FormData();
        var entity = {
            OrgId: -1,
            RoleId: 1,
            UserId: -1,
            LoginId: this.EmailId.value,
            EmailId: this.EmailId.value,
            MobileNo: this.MobileNo.value,
            UserName: this.UserName.value,
            OrgName: this.OrgName.value
        }
        appendObjectToFormData(entity, dataToPost, "");
        _ProgressBar.IMBusy();
        ajaxPost('user/save', dataToPost, function(data){
            _ProgressBar.IMDone();
            if(data.IsSuccess){
                _OkMustReadInfo.show("Congrats!!, You are successfully registered. Password is sent to your Email.",function(){
                    this.goForLogin();
                }.bind(this));
            }
            else{
                _Alert.showWarning(data.Error, 5000);
            }
        }.bind(this));
    }
});