var AddAdvCharge = React.createClass({
    displayName: 'AddAdvCharge',

    getInitialState: function () {
        return {
            AllowEdit: true,
            NotValidInput: true,
            Item: { ItemId: -1, ItemName: '', AccountName: '', AccountId: -1 },
            DrAccount: { AccountId: -1, AccountName: '' }
        };
    },
    render: function () {
        return React.createElement(
            'div',
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: 'panel panel-EAccNotePrim' },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: 'Add Advance Charges' }),
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-xs-6' },
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                { className: 'mandatory' },
                                'Adv Charge No.'
                            ),
                            React.createElement('input', { ref: function (node) {
                                    this.AdvChargeNo = node;
                                }.bind(this), readOnly: true,
                                type: 'text', className: 'form-control', placeholder: 'Order No.' })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-6' },
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                { className: 'mandatory' },
                                'Date'
                            ),
                            React.createElement('input', { ref: function (node) {
                                    this.AdvChargeDt = node;
                                }.bind(this), readOnly: true,
                                type: 'text', className: 'form-control', placeholder: 'Date' })
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'mandatory' },
                        'Debit Account'
                    ),
                    React.createElement(ItemSelect, { ItemText: this.state.DrAccount.AccountName, ItemChange: this.inputChange, GoForItemSelect: this.goForDrAccountSelect })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'mandatory' },
                        'Item'
                    ),
                    React.createElement(ItemSelect, { ItemText: this.state.Item.ItemName, ItemChange: this.inputChange, GoForItemSelect: this.goForItemSelect })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'mandatory' },
                        'Credit Account'
                    ),
                    React.createElement('input', { ref: function (node) {
                            this.Account = node;
                        }.bind(this), readOnly: true,
                        type: 'text', value: this.state.Item.AccountName, className: 'form-control' })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'mandatory' },
                        'Amount'
                    ),
                    React.createElement('input', { ref: function (node) {
                            this.Amount = node;
                        }.bind(this), style: { textAlign: 'right' },
                        type: 'number', className: 'form-control', onChange: this.inputChange })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'mandatory' },
                        'Transaction ID'
                    ),
                    React.createElement('input', { ref: function (node) {
                            this.TransactionId = node;
                        }.bind(this),
                        type: 'text', className: 'form-control', placeholder: 'Transaction ID', onChange: this.inputChange })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        null,
                        'Remark'
                    ),
                    React.createElement('input', { ref: function (node) {
                            this.Remark = node;
                        }.bind(this),
                        type: 'text', className: 'form-control', placeholder: 'Remark', onChange: this.inputChange })
                ),
                React.createElement(PaymentScreenshot, { FillFormDetailFromImage: this.fillFormDetailFromImage })
            ),
            this.state.AllowEdit && React.createElement(AddEditFooter, { AllowClear: false, Save: this.save, NotValidInput: this.state.NotValidInput })
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        if (itemType == 0) {
            this.updateEntity(null);
        }
        if (itemType == 12) {
            this.updateDrAccount(item);
        }
        if (itemType == 22) {
            this.updateItem(item);
        }
        this.show();
    },
    inputChange: function () {
        this.setState({ NotValidInput: this.isValidInput(this.state.Item, this.state.DrAccount) });
    },
    goForDrAccountSelect: function (e) {
        this.props.ShowDrAccountList(true, this.props.ShowAdd, false);
    },
    goForItemSelect: function (e) {
        this.props.ShowItemList(true, this.props.ShowAdd);
    },
    updateDrAccount: function (item) {
        this.setState({
            DrAccount: item,
            NotValidInput: this.isValidInput(this.state.Item, item)
        });
    },
    updateItem: function (item) {
        this.setState({
            Item: item,
            NotValidInput: this.isValidInput(item, this.state.CrAccount)
        });
    },
    updateEntity: function (entity) {
        if (entity == null) {
            this.getRecord();
        } else {
            this.Remark.value = entity.Remark;
            this.JVOrderNo.value = entity.JVOrderNo;
            this.Amount.value = entity.Amount;
            this.setState({
                AllowEdit: false,
                DrAccount: { AccountId: entity.DrAccountId, AccountName: entity.DrAccount },
                CrAccount: { AccountId: entity.CrAccountId, AccountName: entity.CrAccount }
            });
        }
    },
    isValidInput: function (item, drAccount) {
        return this.Amount.value == 0 || item.ItemId == -1 || drAccount.AccountId == -1 || this.TransactionId.value.trim().length == 0;
    },
    save: function () {
        var entity = {
            OrgId: _LoginAccount.OrgId,
            AdvChargeNo: '',
            ItemId: this.state.Item.ItemId,
            DrAccountId: this.state.DrAccount.AccountId,
            CrAccountId: this.state.Item.AccountId,
            TransactionId: this.TransactionId.value,
            Remark: this.Remark.value,
            Amount: this.Amount.value,
            Status: 0,
            RefType: 0,
            RefId: 0
        };
        _ProgressBar.IMBusy();
        ajaxPostJson('api/AdvCharge/save', entity, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
    getRecord: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/AdvCharge/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.AdvChargeNo.value = data.AdvChargeNo;
            this.AdvChargeDt.value = getFormattedDate3(data.AdvChargeDt);
            this.Remark.value = "";
            this.Amount.value = 0;
            this.setState({
                AllowEdit: true,
                DrAccount: { AccountId: -1, AccountName: '' },
                Item: { ItemId: -1, ItemName: '', AccountName: '', AccountId: -1 }
            });
        }.bind(this));
    },
    fillFormDetailFromImage: function (imgData) {
        this.TransactionId.value = imgData.TransactionId;
        this.Remark.value = imgData.Remark;
        this.inputChange();
    }
});