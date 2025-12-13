var EditOrg = React.createClass({
    displayName: 'EditOrg',

    getInitialState: function () {
        return {
            AllowDelete: false,
            NotValidInput: true,
            Entity: { OrgId: -1, OrgName: '', Address: '' }
        };
    },
    render: function () {
        return React.createElement(
            'div',
            { ref: function (node) {
                    this.Component = node;
                }.bind(this),
                className: 'panel panel-EAccNotePrim' },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: 'Edit Organization' }),
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
                            'Organization'
                        ),
                        React.createElement('input', { ref: function (node) {
                                this.OrgName = node;
                            }.bind(this),
                            type: 'text', className: 'form-control', placeholder: 'Organization Name', onChange: this.inputChange })
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'mandatory' },
                            'Address'
                        ),
                        React.createElement('input', { ref: function (node) {
                                this.Address = node;
                            }.bind(this),
                            type: 'text', className: 'form-control', placeholder: 'Address', onChange: this.inputChange })
                    )
                )
            ),
            React.createElement(AddEditFooter, { AllowDelete: this.state.AllowDelete, Delete: this.delete, Clear: this.clear, Save: this.save, NotValidInput: this.state.NotValidInput })
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item) {
        _Main.EAccountHome.hideAll();
        this.show();
        this.updateEntity(item);
    },
    showMe2: function () {
        _Main.EAccountHome.hideAll();
        this.show();
        this.updateEntity({ OrgId: _LoginAccount.OrgId, OrgName: _LoginAccount.OrgName, Address: _LoginAccount.Address });
    },
    inputChange: function () {
        this.setState({
            NotValidInput: this.OrgName.value.length == 0 || this.Address.value.length == 0
        });
    },
    updateEntity: function (item) {
        this.OrgName.value = item.OrgName;
        this.Address.value = item.Address;
        this.setState({
            Entity: item,
            NotValidInput: false
        });
    },
    save: function () {
        var entity = {
            OrgId: this.state.Entity.OrgId,
            OrgName: this.OrgName.value,
            Address: this.Address.value
        };
        _ProgressBar.IMBusy();
        axiosPost('api/Org/update', entity, function (data) {
            _ProgressBar.IMDone();
            if (data) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 5000);
            }
        }.bind(this));
    }

});