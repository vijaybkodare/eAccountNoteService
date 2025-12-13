var RegisterMobileNo = React.createClass({
    displayName: "RegisterMobileNo",

    getInitialState: function () {
        return {
            OtpSent: false,
            ValidMobileNo: false,
            NotValidInput: true,
            BlocSendOtp: false
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowNext, Title: "Register Mobile #" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "div",
                    { className: "" },
                    React.createElement(
                        "div",
                        { className: "alert alert-info alert2 fontSizeSr text-center" },
                        "Please register your Mobile # to use OTP login"
                    ),
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
                            type: "number", className: "form-control", placeholder: "Enter mobile number", onChange: this.mobileNoChange })
                    ),
                    React.createElement(
                        "div",
                        { className: "text-center" },
                        React.createElement(
                            "button",
                            { type: "button", disabled: !this.state.ValidMobileNo || this.state.BlocSendOtp, className: "btn btn-primary custBtn", onClick: this.sendVerificationCode },
                            React.createElement("span", { className: "glyphicon glyphicon-send", style: { marginRight: 7 } }),
                            "Send Mobile verification code"
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
                            type: "text", className: "form-control", placeholder: "Enter mobile verification code", onChange: this.inputChange, onKeyPress: this.keyPress })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-footer text-center" },
                    React.createElement(
                        "div",
                        { className: "btn-group", role: "group" },
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-success", disabled: this.state.NotValidInput, onClick: this.verifyAndSave },
                            "Verify & Save"
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
        this.show();
    },
    inputChange: function () {
        this.setState({ NotValidInput: !this.isValidInput() });
    },
    mobileNoChange: function () {
        this.setState({ OtpSent: false, ValidMobileNo: this.MobileNo.value.length == 10 });
        this.Otp.value = "";
        this.inputChange();
    },
    otpChange: function () {
        this.setState({ NotValidInput: !this.isValidInput() });
    },
    isValidInput: function () {
        if (this.MobileNo.value.length == 10 && this.Otp.value.length == 4) return true;else return false;
    },
    sendVerificationCode: function () {
        this.setState({ BlocSendOtp: true, NotValidInput: true });
        setTimeout(function () {
            this.setState({ BlocSendOtp: false });
        }.bind(this), 120000);
        this.Otp.value = "";
        var urlParams = "?mobileNo=" + this.MobileNo.value + "&userId=" + _LoginAccount.UserId;
        _ProgressBar.IMBusy();
        ajaxGet('user/SendVerificationCode' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                _Alert.showInfo("Verification code has been sent to your mobile number. Please check & enter it in given field.", 5000);
                this.setState({ OtpSent: true });
            } else {
                _Alert.showWarning(data.Error, 5000);
                this.setState({ OtpSent: false, BlocSendOtp: false });
            }
        }.bind(this));
    },
    verifyAndSave: function () {
        this.setState({ BlocSendOtp: true, NotValidInput: true });
        var urlParams = "?mobileNo=" + this.MobileNo.value + "&userId=" + _LoginAccount.UserId + "&otp=" + this.Otp.value;
        _ProgressBar.IMBusy();
        ajaxGet('user/VerifyAndSave' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                _Alert.showInfo(data.Data, 2000);
                this.props.ShowNext();
            } else {
                _Alert.showWarning(data.Error, 5000);
                this.setState({ OtpSent: false, BlocSendOtp: false });
            }
        }.bind(this));
    }
});