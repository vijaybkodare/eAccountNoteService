var AddItem = React.createClass({
    displayName: 'AddItem',

    getInitialState: function () {
        return {
            AllowDelete: true,
            NotValidInput: true,
            Account: { AccountName: '' },
            Entity: { AccountId: -1, ItemId: -1, ItemName: '' }
        };
    },
    render: function () {
        return React.createElement(
            'div',
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: 'panel panel-EAccNotePrim' },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: 'Add/Edit Item' }),
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'form',
                    null,
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'mandatory' },
                            'Item Name'
                        ),
                        React.createElement('input', { ref: function (node) {
                                this.ItemName = node;
                            }.bind(this),
                            type: 'text', className: 'form-control', id: 'ItemName', placeholder: 'Item Name', onChange: this.inputChange })
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'mandatory' },
                            'Amount Credit To'
                        ),
                        React.createElement(ItemSelect, { ItemText: this.state.Account.AccountName, ItemChange: this.inputChange, GoForItemSelect: this.goForSelectAccount })
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
        if (itemType == 12) {
            this.updateAccount(item);
        }
        if (itemType == 21 || itemType == 0) {
            this.updateEntity(item);
        }
    },
    clear: function () {
        this.setState({ NotValidInput: false, Account: { AccountName: '' } });
        this.ItemName.value = "";
    },
    inputChange: function () {
        this.setState({ NotValidInput: this.ItemName.value.length == 0 || this.state.Account.AccountName == "" });
    },
    goForSelectAccount: function () {
        this.props.ShowAccountList(true, this.props.ShowAddItem);
    },
    updateAccount: function (account) {
        if (typeof account.AccountId == "undefined") {
            account = { AccountId: -1, AccountName: '' };
        }
        this.setState({
            Account: account,
            NotValidInput: this.ItemName.value.length == 0 || account.AccountName == ""
        });
    },
    updateEntity: function (entity) {
        if (!entity || typeof entity == "undefined" || typeof entity.ItemId == "undefined") {
            entity = { AccountId: -1, ItemId: -1, ItemName: '' };
        }
        this.ItemName.value = entity.ItemName;
        this.setState({
            Entity: entity,
            Account: { AccountId: entity.AccountId, AccountName: entity.AccountName },
            NotValidInput: entity.ItemName == "" || entity.AccountName == ""
        });
    },
    save: function () {
        var dataToPost = new FormData();
        dataToPost.append('OrgId', _LoginAccount.OrgId);
        dataToPost.append('AccessKey', _LoginAccount.AccessKey);
        dataToPost.append('ItemId', this.state.Entity.ItemId);
        dataToPost.append('AccountId', this.state.Account.AccountId);
        dataToPost.append('ItemName', this.ItemName.value);
        _ProgressBar.IMBusy();
        ajaxPost('item/save', dataToPost, function (data) {
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
        dataToPost.append('id', this.state.Entity.ItemId);
        dataToPost.append('AccessKey', _LoginAccount.AccessKey);
        _ProgressBar.IMBusy();
        ajaxPost('item/delete', dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning("Item can't be deleted. Ensure it is not used anywhere.", 2000);
            }
        }.bind(this));
    }
});