var Login = React.createClass({
    displayName: "Login",

    ActiveTab: 0,
    getInitialState: function () {
        return {
            OtpSent: false,
            NotValidInput: true,
            ValidMobileNo: false,
            BlocSendOtp: false
        };
    },
    render: function () {

        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this) },
            React.createElement(
                "div",
                { className: "panel panel-EAccNotePrim login-at-centre", onKeyPress: this.keyPress },
                React.createElement(
                    "div",
                    { className: "panel-heading" },
                    "Login"
                ),
                React.createElement(
                    "div",
                    { className: "panel-body", style: { position: "relative" } },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-sm-12 col-sm-offset-0 col-md-8 col-md-offset-2" },
                            React.createElement(
                                "ul",
                                { className: "nav nav-tabs" },
                                React.createElement(
                                    "li",
                                    { className: this.ActiveTab == 0 ? "active" : "deactive" },
                                    React.createElement(
                                        "a",
                                        { href: "#", onClick: this.activateTab0 },
                                        "With Password"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    { className: this.ActiveTab == 1 ? "active" : "deactive" },
                                    React.createElement(
                                        "a",
                                        { href: "#", onClick: this.activateTab1 },
                                        "With OTP on Mobile"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { ref: function (node) {
                                        this.Tab0 = node;
                                    }.bind(this) },
                                React.createElement(
                                    "div",
                                    { className: "alert alert-info alert2 fontSizeSr text-center", style: { marginTop: 5 } },
                                    "Login with Password will be removed soon. Please register your Mobile # after login, to use OTP method."
                                ),
                                React.createElement(
                                    "div",
                                    { className: "input-group", style: { marginBottom: 17, marginTop: 5 } },
                                    React.createElement(
                                        "span",
                                        { className: "input-group-addon", style: { color: "black" } },
                                        React.createElement("span", { className: "glyphicon glyphicon-user", style: { marginRight: 7 } })
                                    ),
                                    React.createElement("input", { ref: function (node) {
                                            this.LoginId = node;
                                        }.bind(this),
                                        type: "text", className: "form-control", placeholder: "Login Id(Your Email Id)", onChange: this.inputChange, onKeyPress: this.keyPress })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "input-group", style: { marginBottom: 25 } },
                                    React.createElement(
                                        "span",
                                        { className: "input-group-addon", style: { color: "black" } },
                                        React.createElement("span", { className: "glyphicon glyphicon-lock", style: { marginRight: 7 } })
                                    ),
                                    React.createElement("input", { ref: function (node) {
                                            this.Password = node;
                                        }.bind(this),
                                        type: "password", className: "form-control", placeholder: "Password", onChange: this.inputChange, onKeyPress: this.keyPress })
                                )
                            ),
                            React.createElement(
                                "div",
                                { ref: function (node) {
                                        this.Tab1 = node;
                                    }.bind(this) },
                                React.createElement(
                                    "div",
                                    { className: "input-group", style: { marginBottom: 7, marginTop: 5 } },
                                    React.createElement(
                                        "span",
                                        { className: "input-group-addon", style: { color: "black" } },
                                        React.createElement("span", { className: "glyphicon glyphicon-phone", style: { marginRight: 7 } })
                                    ),
                                    React.createElement("input", { ref: function (node) {
                                            this.MobileNo = node;
                                        }.bind(this),
                                        type: "number", className: "form-control", placeholder: "Mobile Number", onChange: this.mobileNoChange, onKeyPress: this.keyPress })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "text-center" },
                                    React.createElement(
                                        "button",
                                        { type: "button", disabled: !this.state.ValidMobileNo || this.state.BlocSendOtp, className: "btn btn-primary custBtn", onClick: this.sendOtp },
                                        React.createElement("span", { className: "glyphicon glyphicon-send", style: { marginRight: 7 } }),
                                        "Send OTP"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "input-group", style: { marginBottom: 25, marginTop: 7 } },
                                    React.createElement(
                                        "span",
                                        { className: "input-group-addon", style: { color: "black" } },
                                        React.createElement("span", { className: "glyphicon glyphicon-asterisk", style: { marginRight: 7 } })
                                    ),
                                    React.createElement("input", { ref: function (node) {
                                            this.Otp = node;
                                        }.bind(this), readOnly: !this.state.OtpSent,
                                        type: "text", className: "form-control", placeholder: "OTP", onChange: this.inputChange, onKeyPress: this.keyPress })
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-footer text-center" },
                    React.createElement(
                        "button",
                        { type: "button", disabled: this.state.NotValidInput, className: "btn btn-primary custBtn", onClick: this.doLogin },
                        React.createElement("span", { className: "glyphicon glyphicon-log-in", style: { marginRight: 7 } }),
                        "Login"
                    )
                )
            )
        );
    },
    //value="2925" 
    componentDidMount: function () {
        setComponent(this);
        this.MobileNo.value = readCookie("MobileNo");
        this.LoginId.value = readCookie("LoginId");
        //Comment it in PRDO
        this.Password.value = readCookie("Password");
        this.activateTab0();
    },
    goForUserReg: function () {
        _Main.goForUserReg();
    },
    confirmResetPassword: function () {
        if (this.MobileNo.value.length == 0) {
            _Alert.showWarning("Login Id is empty. Can't proceed for reset password.", 2000);
            return;
        }
        _Confirmation.show('Is it confirm that you want reset password for ' + this.MobileNo.value + '?', function () {
            this.ResetPassword();
        }.bind(this));
    },
    ResetPassword: function () {
        var urlParams = "?LoginId=" + this.LoginId.value;
        _ProgressBar.IMBusy();
        ajaxGet('user/ResetPassword' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                _Alert.showWarning("Check your email to new password. Please change it ASAP.", 2000);
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
    goForEAccountHome: function () {
        _Main.goForEAccountHome();
    },
    keyPress: function (event) {
        if (event.charCode == 13) {
            this.doLogin();
        }
    },
    inputChange: function () {
        this.setState({ NotValidInput: !this.isValidInput(), ValidMobileNo: this.MobileNo.value.length == 10 });
    },
    mobileNoChange: function () {
        this.setState({ OtpSent: false, ValidMobileNo: this.MobileNo.value.length == 10 });
        this.Otp.value = "";
        this.inputChange();
    },
    isValidInput: function () {
        if (this.ActiveTab == 0) {
            return this.LoginId.value.length > 0 && this.Password.value.length > 0;
        } else {
            return this.MobileNo.value.length == 10 && this.Otp.value.length > 0;
        }
    },
    activateTab0: function () {
        this.ActiveTab = 0;
        this.Tab0.style.display = "block";
        this.Tab1.style.display = "none";
        this.inputChange();
    },
    activateTab1: function () {
        this.ActiveTab = 1;
        this.Tab0.style.display = "none";
        this.Tab1.style.display = "block";
        this.inputChange();
    },
    persistLogin: function () {
        var now = new Date();
        now.setFullYear(now.getFullYear() + 1);
        document.cookie = "LoginId=" + this.LoginId.value + ";expires=" + now.toUTCString();
        document.cookie = "MobileNo=" + this.MobileNo.value + ";expires=" + now.toUTCString();
        //Comment it in PRDO
        document.cookie = "Password=" + this.Password.value + ";expires=" + now.toUTCString();
        axios.defaults.headers.common['Content-Type'] = "application/json";
        axios.defaults.headers.common['accesskey'] = _LoginAccount.AccessKey;
        axios.defaults.headers.common['userid'] = _LoginAccount.UserId;
    },
    sendOtp: function () {
        this.setState({ BlocSendOtp: true, NotValidInput: true });
        setTimeout(function () {
            this.setState({ BlocSendOtp: false });
        }.bind(this), 30000);
        this.Otp.value = "";
        var urlParams = "?mobileNo=" + this.MobileNo.value;
        _ProgressBar.IMBusy();
        ajaxGet('user/SendOtp' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                _Alert.showInfo("OTP has been sent to your mobile number. Please check.", 5000);
                this.setState({ OtpSent: true });
            } else {
                _Alert.showWarning(data.Error, 5000);
                this.setState({ OtpSent: false, BlocSendOtp: false });
            }
        }.bind(this));
    },
    doLogin: function () {
        if (this.ActiveTab == 0) {
            this.doLoginWithPassword();
        } else {
            this.doLoginWithOtp();
        }
    },
    doLoginWithPassword: function () {
        var urlParams = "?LoginId=" + this.LoginId.value + "&Password=" + this.Password.value;
        _ProgressBar.IMBusy();
        ajaxGet('home/AuthorizeMe' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                _LoginAccount = data.Data;
                this.persistLogin();
                _UserLogout.updateEntity();
                this.goForEAccountHome();
            } else {
                _Alert.showWarning("Login Id or Password may be wrong.", 5000);
            }
        }.bind(this));
    },
    doLoginWithOtp: function () {
        var urlParams = "?mobileNo=" + this.MobileNo.value + "&otp=" + this.Otp.value;
        _ProgressBar.IMBusy();
        ajaxGet('user/AuthorizeMe_Otp' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                _LoginAccount = data.Data;
                this.persistLogin();
                _UserLogout.updateEntity();
                this.goForEAccountHome();
            } else {
                _Alert.showWarning("OTP does not match. Please try again", 5000);
                this.Otp.value = "";
                this.setState({ NotValidInput: true, OtpSent: false, BlocSendOtp: false });
            }
        }.bind(this));
    }
});