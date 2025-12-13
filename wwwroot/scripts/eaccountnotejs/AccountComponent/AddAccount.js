var AddAccount = React.createClass({
    displayName: "AddAccount",

    getInitialState: function () {
        return {
            AllowDelete: true,
            NotValidInput: true,
            AccountType: 1,
            Entity: { AccountId: -1, AccountName: '', AccountType: 1, Amount: 0, BalAmount: 0 }
        };
    },
    defaultBehaviour: 1,
    role: "REG",
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this),
                className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: "Add/Edit Account" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "form",
                    null,
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            null,
                            "Account Type"
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-6" },
                                React.createElement(
                                    "div",
                                    { className: "radio" },
                                    React.createElement(
                                        "label",
                                        null,
                                        React.createElement("input", { ref: "UserAccount", type: "radio", name: "AccountType", value: "1", checked: this.state.Entity.AccountType == 1, onChange: this.accountTypeChange }),
                                        "Member Account"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-6" },
                                React.createElement(
                                    "div",
                                    { className: "radio" },
                                    React.createElement(
                                        "label",
                                        null,
                                        React.createElement("input", { type: "radio", name: "AccountType", value: "2", checked: this.state.Entity.AccountType == 2, onChange: this.accountTypeChange }),
                                        "Bank Account"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-6" },
                                React.createElement(
                                    "div",
                                    { className: "radio" },
                                    React.createElement(
                                        "label",
                                        null,
                                        React.createElement("input", { type: "radio", name: "AccountType", value: "3", checked: this.state.Entity.AccountType == 3, onChange: this.accountTypeChange }),
                                        "Income Account"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-6" },
                                React.createElement(
                                    "div",
                                    { className: "radio" },
                                    React.createElement(
                                        "label",
                                        null,
                                        React.createElement("input", { type: "radio", name: "AccountType", value: "4", checked: this.state.Entity.AccountType == 4, onChange: this.accountTypeChange }),
                                        "Expense Account"
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { className: "mandatory" },
                            "Account Name"
                        ),
                        React.createElement("input", { ref: function (node) {
                                this.AccountName = node;
                            }.bind(this),
                            type: "text", className: "form-control", id: "AccountName", placeholder: "Account Name", onChange: this.inputChange })
                    )
                )
            ),
            React.createElement(AddEditFooter, { AllowDelete: this.state.AllowDelete, Delete: this.delete, Clear: this.clear, Save: this.save, NotValidInput: this.state.NotValidInput })
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.show();
        this.updateEntity(item);
    },
    clear: function () {
        this.refs.UserAccount.checked = true;
        this.setState({ AccountType: "1" });
        this.AccountName.value = "";
    },
    inputChange: function () {
        let entity = this.state.Entity;
        entity.AccountName = this.AccountName.value;
        this.setState({ Entity: entity, NotValidInput: this.AccountName.value.length == 0 });
    },
    accountTypeChange: function (e) {
        let entity = this.state.Entity;
        entity.AccountType = e.currentTarget.value;
        this.setState({ Entity: entity });
    },
    updateEntity: function (item) {
        if (!item || typeof item.AccountId == "undefined") {
            item = { AccountId: -1, AccountName: '', AccountType: 1, Amount: 0, BalAmount: 0 };
        }
        this.AccountName.value = item.AccountName;
        this.setState({
            Entity: item,
            NotValidInput: item.AccountName == ""
        });
    },
    save: function () {
        var dataToPost = new FormData();
        console.log(_LoginAccount);
        dataToPost.append('OrgId', _LoginAccount.OrgId);
        dataToPost.append('AccountId', this.state.Entity.AccountId);
        dataToPost.append('AccessKey', _LoginAccount.AccessKey);
        dataToPost.append('AccountType', this.state.Entity.AccountType);
        dataToPost.append('AccountName', this.AccountName.value);
        _ProgressBar.IMBusy();
        ajaxPost('account/save', dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
    delete: function () {
        var dataToPost = new FormData();
        dataToPost.append('id', this.state.Entity.AccountId);
        dataToPost.append('AccessKey', _LoginAccount.AccessKey);
        _ProgressBar.IMBusy();
        ajaxPost('account/delete', dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning("Account can't be deleted. Ensure it is not used anywhere.", 2000);
            }
        }.bind(this));
    }
});