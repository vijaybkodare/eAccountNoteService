var Main = React.createClass({
    getInitialState: function () {
        return { 
        };
    },
    render: function() {
        return (
            <div>
                <Login ref={function(node){this.Login = node;}.bind(this)}/>
                <UserReg ref={function(node){this.UserReg = node;}.bind(this)}/>
                <EAccountHome ref={function(node){this.EAccountHome = node;}.bind(this)}/>
            </div>    
        );
    },
    //value="2925"                
    componentDidMount: function(){
        this.goForLogin();    
    },
    hideAllComponent: function(){
        this.UserReg.hide();
        this.Login.hide();
        this.EAccountHome.hide();
        if (_TransMapper.hide) {
            _TransMapper.hide();
        }
    },
    goForLogin: function () {
        this.hideAllComponent();
        _LoginAccount = {};
        if(_UserLogout != null)
            _UserLogout.updateEntity();
        this.Login.show();    
    },
    goForUserReg: function (agree) {
        this.hideAllComponent();
        this.UserReg.show(agree);    
    },
    goForEAccountHome: function () {
        this.hideAllComponent();
        this.EAccountHome.show();
    },
    showMe: function () {
        _TransMapper.hide();
        this.goForEAccountHome();
    },
});

ReactDOM.render(
    <ActivityProgress ref={function(node){_ProgressBar = node;}.bind(this)}/>,
    document.getElementById('progress')
);
ReactDOM.render(
    <Alert ref={function(node){_Alert = node;}.bind(this)}/>,
    document.getElementById('alert')
);
ReactDOM.render(
    <Confirmation ref={function(node){_Confirmation = node;}.bind(this)}/>,
    document.getElementById('confirmation')
);
ReactDOM.render(
    <OkMustReadInfo ref={function(node){_OkMustReadInfo = node;}.bind(this)}/>,
    document.getElementById('okMustReadInfo')
);
ReactDOM.render(
    <UserLogout ref={function(node){_UserLogout = node;}.bind(this)}/>,
    document.getElementById('userLogout')
);
ReactDOM.render(
    <Main ref={function(node){_Main = node;}.bind(this)}/>,
    document.getElementById('content')
);
ReactDOM.render(
    <UpdateTransNo ref={function (node) { _UpdateTransNo = node; }.bind(this)} />,
    document.getElementById('updateTransNo')
);
ReactDOM.render(
    <TransMapper ref={function (node) { _TransMapper = node; }.bind(this)} ShowNext={() => _Main.showMe()} />,
    document.getElementById('transMapper')
);