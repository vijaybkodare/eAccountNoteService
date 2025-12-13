var AddAdvMonthlyMaintainance = React.createClass({
    displayName: 'AddAdvMonthlyMaintainance',

    getInitialState: function () {
        return {
            AllowEdit: true,
            NotValidInput: true,
            Account: {},
            Item: { ItemId: -1, ItemName: '', AccountName: '', AccountId: -1 }
        };
    },
    render: function () {
        return React.createElement(
            'div',
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: 'panel panel-EAccNotePrim' },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: 'Advance Maintainance' }),
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'div',
                    { className: 'listItem6Sel fontSizeS' },
                    React.createElement(
                        'div',
                        { className: 'row' },
                        React.createElement(
                            'div',
                            { className: 'col col-xs-5 paddingR5 textAlignR' },
                            'Account:'
                        ),
                        React.createElement(
                            'div',
                            { className: 'col col-xs-7 paddingL5 fontWeightB' },
                            this.state.Account.AccountName
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'row' },
                        React.createElement(
                            'div',
                            { className: 'col col-xs-5 paddingR5 textAlignR' },
                            'Item:'
                        ),
                        React.createElement(
                            'div',
                            { className: 'col col-xs-7 paddingL5 fontWeightB' },
                            this.state.Item.ItemName
                        )
                    )
                ),
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
        this.getRecord();
        this.getMonthlyMaintainanceItem();
        this.getAccount();
        this.show();
    },
    inputChange: function () {
        this.setState({ NotValidInput: this.isValidInput() });
    },
    isValidInput: function () {
        return this.Amount.value == 0 || this.state.Item.ItemId == -1 || this.TransactionId.value.trim().length == 0;
    },
    save: function () {
        var entity = {
            OrgId: _LoginAccount.OrgId,
            AdvChargeNo: '',
            ItemId: this.state.Item.ItemId,
            DrAccountId: _LoginAccount.AccountId,
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
                this.props.ShowNextComponent();
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
    getMonthlyMaintainanceItem: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/AppSetting/monthly_maintainance_item' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Item: data
            });
        }.bind(this));
    },
    getAccount: function () {
        var urlParams = "?id=" + _LoginAccount.AccountId;
        _ProgressBar.IMBusy();
        ajaxGet('account/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Account: data
            });
        }.bind(this));
    },
    fillFormDetailFromImage: function (imgData) {
        this.TransactionId.value = imgData.TransactionId;
        this.Remark.value = imgData.Remark;
        this.inputChange();
    }
});