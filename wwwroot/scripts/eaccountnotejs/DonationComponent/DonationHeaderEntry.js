var DonationHeaderEntry = React.createClass({
    displayName: 'DonationHeaderEntry',

    getInitialState: function () {
        return {
            AllowEdit: true,
            NotValidInput: true,
            Item: { ItemId: -1, ItemName: '', AccountName: '', AccountId: -1 },
            Entity: { DonationHeaderId: -1, ItemId: -1, AccountId: -1, TotalAmount: 0 }
        };
    },
    render: function () {
        return React.createElement(
            'div',
            null,
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
                            'Donation No.'
                        ),
                        React.createElement('input', { readOnly: true, type: 'text', value: this.props.Entity.DonationNo, className: 'form-control' })
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
                        React.createElement('input', { readOnly: true, type: 'text', className: 'form-control', value: getFormattedDate3(this.props.Entity.DonationDt) })
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    { className: 'mandatory' },
                    'Item'
                ),
                React.createElement(ItemSelect, { ItemText: this.state.Item.ItemName, ItemChange: this.inputChange, GoForItemSelect: this.goForSelectItem })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    { className: 'mandatory' },
                    'Amount Credit To'
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
                    'Remark'
                ),
                React.createElement('input', { ref: function (node) {
                        this.Remark = node;
                    }.bind(this),
                    type: 'text', className: 'form-control', placeholder: 'Remark', onChange: this.inputChange })
            ),
            React.createElement(AddEditFooter, { Clear: this.clear, Save: this.save, NotValidInput: this.state.NotValidInput })
        );
    },
    goForSelectItem: function (e) {
        this.props.ShowItemList(this.props.ShowAddDonation);
    },
    updateItem: function (item) {
        this.setState({
            Item: item,
            NotValidInput: item.ItemName == ""
        });
    },
    save: function () {
        var entity = {
            OrgId: _LoginAccount.OrgId,
            ItemId: this.state.Item.ItemId,
            AccountId: this.state.Item.AccountId,
            Remark: this.Remark.value
        };
        _ProgressBar.IMBusy();
        axiosPost('api/Donation/save', entity, function (data) {
            _ProgressBar.IMDone();
            if (data) {
                this.props.ShowList();
            } else {
                _Alert.showWarning("Server side error", 2000);
            }
        }.bind(this));
    }
});