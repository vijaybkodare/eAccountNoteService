var AssignUserAccount = React.createClass({
    displayName: "AssignUserAccount",

    getInitialState: function () {
        return {
            Accounts: []
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
                { style: { textAlign: "center", marginBottom: 3 } },
                React.createElement(
                    "button",
                    { className: "btn btn-primary", type: "button", onClick: this.goForAddSelectedAccounts },
                    React.createElement("span", { className: "glyphicon glyphicon-plus" })
                )
            ),
            React.createElement(
                "div",
                { className: "listHeader2" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-12" },
                        "Account Name"
                    )
                )
            ),
            this.getList()
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    goForAddSelectedAccounts: function () {
        this.props.ShowAccountList(true, this.props.ShowAddUser, true);
    },
    updateEntity: function (entity) {
        var urlParams = "?profileId=" + entity.ProfileId;
        _ProgressBar.IMBusy();
        ajaxGet('User/userAccounts' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Accounts: data
            });
        }.bind(this));
    },
    updateAccounts: function (items) {
        // Remove items already added
        items = items.filter(function (item) {
            const found = this.state.Accounts.filter(function (account) {
                return account.AccountId == item.AccountId;
            });
            return found.length == 0;
        }.bind(this));

        // Add existing items
        this.state.Accounts.map(function (item) {
            items.push(item);
        }.bind(this));

        this.setState({
            Accounts: items,
            NotValidInput: items.length == 0
        });
    },
    getList: function () {
        var srNo = 0;
        return this.state.Accounts.map(function (account) {
            srNo += 1;
            return React.createElement(
                "div",
                { className: "listItem" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-12" },
                        React.createElement("span", { className: "glyphicon glyphicon-remove", onClick: () => this.remove(account), style: { marginRight: 7 } }),
                        React.createElement(
                            "span",
                            null,
                            React.createElement(
                                "span",
                                { className: "badge badge-dark", style: { marginRight: 4 } },
                                srNo
                            )
                        ),
                        account.AccountName
                    )
                )
            );
        }.bind(this));
    },
    remove: function (account) {
        var index = this.state.Accounts.indexOf(account);
        if (index > -1) {
            this.state.Accounts.splice(index, 1);
            this.setState({ Accounts: this.state.Accounts });
        }
    },
    saveUserAccountAssignment: function () {
        var dataToPost = new FormData();
        var entity = {
            UserId: this.props.Entity.UserId,
            Accounts: this.state.Accounts,
            ProfileId: this.props.Entity.ProfileId
        };
        appendObjectToFormData(entity, dataToPost, "");
        _ProgressBar.IMBusy();
        ajaxPost('User/saveUserAccountAssignment', dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            }
        }.bind(this));
    }
});