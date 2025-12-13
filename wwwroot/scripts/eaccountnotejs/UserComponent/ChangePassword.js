var ChangePassword = React.createClass({
    displayName: "ChangePassword",

    getInitialState: function () {
        return {
            NotValidInput: true
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel  panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: "Update Password" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "Old Password"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.OldPassword = node;
                        }.bind(this),
                        type: "password", className: "form-control", placeholder: "Old Password",
                        onChange: this.inputChange })
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "New Password"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.NewPassword = node;
                        }.bind(this),
                        type: "password", className: "form-control", placeholder: "New Password",
                        onChange: this.inputChange })
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "Retypr new Password"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.RetypeNewPassword = node;
                        }.bind(this),
                        type: "password", className: "form-control", placeholder: "Retypr New Password",
                        onChange: this.inputChange, onKeyPress: this.keyPress }),
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", { ref: function (node) {
                                this.ShowPassword = node;
                            }.bind(this),
                            type: "checkbox", defaultChecked: false, onClick: this.showPassword }),
                        "Show Password"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "panel-footer text-center" },
                React.createElement(
                    "button",
                    { type: "button", disabled: this.state.NotValidInput, className: "btn btn-success", onClick: this.updatePassword },
                    "Update ",
                    React.createElement("span", { className: "glyphicon glyphicon-save", style: { marginLeft: 7 } })
                )
            )
        );
    },
    componentDidMount: function () {
        this.OldPassword.focus();
        setComponent(this);
    },
    showMe: function () {
        _Main.EAccountHome.hideAll();
        this.show();
    },
    keyPress: function (event) {
        if (event.charCode == 13 && !this.state.NotValidInput) {
            this.updatePassword();
        }
    },
    showPassword: function () {
        this.NewPassword.type = this.ShowPassword.checked ? "text" : "password";
        this.RetypeNewPassword.type = this.ShowPassword.checked ? "text" : "password";
        this.OldPassword.type = this.ShowPassword.checked ? "text" : "password";
    },
    inputChange: function () {
        if (this.OldPassword.value.length == 0 || this.NewPassword.value.length == 0 || this.NewPassword.value != this.RetypeNewPassword.value) this.setState({ NotValidInput: true });else this.setState({ NotValidInput: false });
    },
    updatePassword: function () {
        var urlParams = "?LoginId=" + _LoginAccount.LoginId + "&OldPassword=" + this.OldPassword.value + "&NewPassword=" + this.NewPassword.value;
        _ProgressBar.IMBusy();
        ajaxGet('user/UpdatePassword' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) this.props.ShowList();else _Alert.showWarning(data.Error, 2000);
        }.bind(this));
    }
});