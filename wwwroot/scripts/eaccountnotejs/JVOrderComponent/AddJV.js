var AddJV = React.createClass({
    displayName: 'AddJV',

    getInitialState: function () {
        return {
            AllowEdit: true,
            NotValidInput: true,
            DrAccount: { AccountId: -1, AccountName: '' },
            CrAccount: { AccountId: -1, AccountName: '' }
        };
    },
    render: function () {
        return React.createElement(
            'div',
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: 'panel panel-EAccNotePrim' },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: 'Add JV' }),
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
                                'JV No.'
                            ),
                            React.createElement('input', { ref: function (node) {
                                    this.JVOrderNo = node;
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
                                    this.AddedDt = node;
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
                        'Credit Account'
                    ),
                    React.createElement(ItemSelect, { ItemText: this.state.CrAccount.AccountName, ItemChange: this.inputChange, GoForItemSelect: this.goForCrAccountSelect })
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
                        'Remark'
                    ),
                    React.createElement('input', { ref: function (node) {
                            this.Remark = node;
                        }.bind(this),
                        type: 'text', className: 'form-control', placeholder: 'Remark', onChange: this.inputChange })
                )
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
        if (itemType == 1) {
            this.updateEntity(item);
        }
        if (itemType == 12) {
            this.updateDrAccount(item);
        }
        if (itemType == 14) {
            this.updateCrAccount(item);
        }
        this.show();
    },
    inputChange: function () {
        this.setState({ NotValidInput: this.Amount.value == 0 || this.state.DrAccount.AccountId == -1 || this.state.CrAccount.AccountId == -1 || this.Remark.value.trim().length == 0 });
    },
    goForDrAccountSelect: function (e) {
        this.props.ShowDrAccountList(true, this.props.ShowAddJV, false);
    },
    goForCrAccountSelect: function (e) {
        this.props.ShowCrAccountList(true, this.props.ShowAddJV, false);
    },
    updateDrAccount: function (item) {
        this.setState({
            DrAccount: item,
            NotValidInput: this.isValidInput(this.state.CrAccount, item)
        });
    },
    updateCrAccount: function (item) {
        this.setState({
            CrAccount: item,
            NotValidInput: this.isValidInput(item, this.state.DrAccount)
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
    isValidInput: function (crAccount, drAccount) {
        return this.Amount.value == 0 || crAccount.AccountId == drAccount.AccountId || drAccount.AccountId == -1;
    },
    save: function () {
        var dataToPost = new FormData();
        var entity = {
            OrgId: _LoginAccount.OrgId,
            JVOrderNo: '',
            DrAccountId: this.state.DrAccount.AccountId,
            CrAccountId: this.state.CrAccount.AccountId,
            Remark: this.Remark.value,
            Amount: this.Amount.value
        };
        appendObjectToFormData(entity, dataToPost, "");
        _ProgressBar.IMBusy();
        ajaxPost('JVOrder/save', dataToPost, function (data) {
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
        ajaxGet('JVOrder/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.JVOrderNo.value = data.Data.JVOrderNo;
            this.AddedDt.value = getFormattedDate(data.Data.AddedDt);
            this.Remark.value = "";
            this.Amount.value = 0;
            this.setState({
                AllowEdit: true,
                DrAccount: { AccountId: -1, AccountName: '' },
                CrAccount: { AccountId: -1, AccountName: '' }
            });
        }.bind(this));
    }
});