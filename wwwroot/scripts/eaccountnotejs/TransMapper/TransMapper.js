var TransMapper = React.createClass({
    displayName: "TransMapper",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowNext, Title: "Transaction Mapper" }),
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
    }

});