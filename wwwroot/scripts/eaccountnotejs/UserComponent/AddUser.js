var AddUser = React.createClass({
    displayName: 'AddUser',

    getInitialState: function () {
        return {
            ActiveTab: 1,
            AllowDelete: true,
            NotValidInput: true,
            Entity: { UserId: -1, EmailId: '', LoginId: '', MobileNo: '', UserName: '', RoleId: 2, OrgId: _LoginAccount.OrgId }
        };
    },
    render: function () {
        return React.createElement(
            'div',
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: 'panel panel-EAccNotePrim' },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: 'Add/Edit User' }),
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'ul',
                    { className: 'nav nav-tabs' },
                    React.createElement(
                        'li',
                        { role: 'presentation', className: this.state.ActiveTab == 1 ? "active" : "" },
                        React.createElement(
                            'a',
                            { href: '#', onClick: this.activateTab1 },
                            'General Info'
                        )
                    ),
                    React.createElement(
                        'li',
                        { role: 'presentation', className: this.state.ActiveTab == 2 ? "active" : "" },
                        React.createElement(
                            'a',
                            { href: '#', onClick: this.activateTab2 },
                            'Account Access'
                        )
                    )
                ),
                React.createElement(
                    'form',
                    { ref: function (node) {
                            this.UserGeneralInfo = node;
                        }.bind(this) },
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'mandatory' },
                            'User Name'
                        ),
                        React.createElement('input', { ref: function (node) {
                                this.UserName = node;
                            }.bind(this),
                            type: 'text', className: 'form-control', placeholder: 'User Name', onChange: this.inputChange })
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'mandatory' },
                            'Login Id'
                        ),
                        React.createElement('input', { ref: function (node) {
                                this.LoginId = node;
                            }.bind(this),
                            type: 'text', className: 'form-control', 'aria-describedby': 'mobileNoHelp', placeholder: 'LLogin Id', onChange: this.inputChange })
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'mandatory' },
                            'Email Id'
                        ),
                        React.createElement('input', { ref: function (node) {
                                this.EmailId = node;
                            }.bind(this),
                            type: 'text', className: 'form-control', placeholder: 'Email Id', onChange: this.inputChange }),
                        React.createElement(
                            'small',
                            { id: 'mobileNoHelp', className: 'form-text text-muted' },
                            'Enter valid EmailId, password will be send on EmailId.'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            null,
                            'Mobile No'
                        ),
                        React.createElement('input', { ref: function (node) {
                                this.MobileNo = node;
                            }.bind(this), type: 'number', className: 'form-control', 'aria-describedby': 'mobileNoHelp', placeholder: 'Mobile No', onChange: this.inputChange })
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            null,
                            'Role'
                        ),
                        React.createElement(
                            'div',
                            { className: 'row' },
                            React.createElement(
                                'div',
                                { className: 'col-xs-6' },
                                React.createElement(
                                    'div',
                                    { className: 'radio' },
                                    React.createElement(
                                        'label',
                                        null,
                                        React.createElement('input', { ref: 'UserAccount', type: 'radio', name: 'Role', value: '1', checked: this.state.Entity.RoleId == 1, onChange: this.roleChange }),
                                        'Admin'
                                    )
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'col-xs-6' },
                                React.createElement(
                                    'div',
                                    { className: 'radio' },
                                    React.createElement(
                                        'label',
                                        null,
                                        React.createElement('input', { type: 'radio', name: 'Role', value: '2', checked: this.state.Entity.RoleId == 2, onChange: this.roleChange }),
                                        'User'
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(AssignUserAccount, { ref: function (node) {
                        this.AssignUserAccount = node;
                    }.bind(this),
                    ShowAccountList: this.props.ShowAccountList,
                    Entity: this.state.Entity,
                    ShowList: this.props.ShowList,
                    ShowAddUser: this.props.ShowAddUser })
            ),
            this.state.ActiveTab == 1 && React.createElement(AddEditFooter, { AllowDelete: this.state.AllowDelete, Delete: this.confirmDelete, Save: this.save, NotValidInput: this.state.NotValidInput }),
            this.state.ActiveTab == 2 && React.createElement(AddEditFooter, { AllowDelete: false, Save: this.saveUserAccountAssignment, NotValidInput: false })
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.show();
        if (itemType == 0 || itemType == 1) {
            this.updateEntity(item);
        }
        if (itemType == 13) {
            this.updateAccounts(item);
        }
    },
    activateTab1: function () {
        this.setState({ ActiveTab: 1 });
        this.UserGeneralInfo.style.display = "block";
        this.AssignUserAccount.hide();
    },
    activateTab2: function () {
        this.setState({ ActiveTab: 2 });
        this.UserGeneralInfo.style.display = "none";
        this.AssignUserAccount.show();
    },
    clear: function () {
        this.setState({ NotValidInput: false, Account: { AccountName: '' } });
        this.ItemName.value = "";
    },
    inputChange: function () {
        this.setState({ NotValidInput: this.UserName.value.length == 0 || this.EmailId.value.length == 0 });
    },
    roleChange: function (e) {
        let entity = this.state.Entity;
        entity.RoleId = e.currentTarget.value;
        this.setState({ Entity: entity });
    },
    updateEntity: function (entity) {
        if (entity == null || typeof entity.UserId == "undefined") {
            entity = { UserId: -1, ProfileId: -1, EmailId: '', LoginId: '', MobileNo: '', UserName: '', RoleId: 2, OrgId: _LoginAccount.OrgId };
        }
        this.EmailId.value = entity.EmailId;
        this.LoginId.value = entity.LoginId;
        this.MobileNo.value = entity.MobileNo;
        this.UserName.value = entity.UserName;
        this.AssignUserAccount.updateEntity(entity);
        this.setState({
            Entity: entity,
            AllowDelete: entity.LoginId != 'vijaybkodare@gmail.com'
        });
    },
    updateAccounts: function (items) {
        this.AssignUserAccount.updateAccounts(items);
    },
    save: function () {
        var entity = {
            UserId: this.state.Entity.UserId,
            LoginId: this.LoginId.value,
            EmailId: this.EmailId.value,
            MobileNo: this.MobileNo.value,
            UserName: this.UserName.value,
            OrgId: _LoginAccount.OrgId,
            RoleId: this.state.Entity.RoleId,
            ProfileId: this.state.Entity.ProfileId
        };
        _ProgressBar.IMBusy();
        axiosPost('api/Org/save', entity, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            }
        }.bind(this));
    },
    confirmDelete: function () {
        _Confirmation.show('Is it confirm that you want to Delete this User?', function () {
            this.delete();
        }.bind(this));
    },
    delete: function () {
        var dataToPost = new FormData();
        dataToPost.append('id', this.state.Entity.UserId);
        dataToPost.append('AccessKey', _LoginAccount.AccessKey);
        _ProgressBar.IMBusy();
        ajaxPost('user/delete', dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
    saveUserAccountAssignment: function () {
        this.AssignUserAccount.saveUserAccountAssignment();
    }
});