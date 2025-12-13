var Main = React.createClass({
    displayName: 'Main',

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(Login, { ref: function (node) {
                    this.Login = node;
                }.bind(this) }),
            React.createElement(UserReg, { ref: function (node) {
                    this.UserReg = node;
                }.bind(this) }),
            React.createElement(EAccountHome, { ref: function (node) {
                    this.EAccountHome = node;
                }.bind(this) })
        );
    },
    //value="2925"                
    componentDidMount: function () {
        this.goForLogin();
    },
    hideAllComponent: function () {
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
        if (_UserLogout != null) _UserLogout.updateEntity();
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
    }
});

ReactDOM.render(React.createElement(ActivityProgress, { ref: function (node) {
        _ProgressBar = node;
    }.bind(this) }), document.getElementById('progress'));
ReactDOM.render(React.createElement(Alert, { ref: function (node) {
        _Alert = node;
    }.bind(this) }), document.getElementById('alert'));
ReactDOM.render(React.createElement(Confirmation, { ref: function (node) {
        _Confirmation = node;
    }.bind(this) }), document.getElementById('confirmation'));
ReactDOM.render(React.createElement(OkMustReadInfo, { ref: function (node) {
        _OkMustReadInfo = node;
    }.bind(this) }), document.getElementById('okMustReadInfo'));
ReactDOM.render(React.createElement(UserLogout, { ref: function (node) {
        _UserLogout = node;
    }.bind(this) }), document.getElementById('userLogout'));
ReactDOM.render(React.createElement(Main, { ref: function (node) {
        _Main = node;
    }.bind(this) }), document.getElementById('content'));
ReactDOM.render(React.createElement(UpdateTransNo, { ref: function (node) {
        _UpdateTransNo = node;
    }.bind(this) }), document.getElementById('updateTransNo'));
ReactDOM.render(React.createElement(TransMapper, { ref: function (node) {
        _TransMapper = node;
    }.bind(this), ShowNext: () => _Main.showMe() }), document.getElementById('transMapper'));