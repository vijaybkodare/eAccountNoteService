var AddCharge = React.createClass({
    displayName: "AddCharge",

    getInitialState: function () {
        return {
            AllowEdit: true,
            NotValidInput: true,
            Item: { ItemId: -1, ItemName: '' },
            Accounts: [],
            Entity: { ChargeOrderId: -1, ItemId: -1, AccountId: -1, Amount: 0, Charges: 0 }
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: "Add/Edit Charge Order" }),
            isAdmin() && this.state.Entity.ChargeOrderId > 0 && React.createElement(
                "div",
                { className: "text-center marginT5" },
                React.createElement(
                    "button",
                    { className: "btn btn-primary", type: "button", onClick: this.downloadReport },
                    React.createElement("span", { className: "glyphicon glyphicon-download-alt" })
                )
            ),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "form",
                    null,
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-6" },
                            React.createElement(
                                "div",
                                { className: "form-group" },
                                React.createElement(
                                    "label",
                                    { className: "mandatory" },
                                    "Order No."
                                ),
                                React.createElement("input", { ref: function (node) {
                                        this.OrderNo = node;
                                    }.bind(this), readOnly: true,
                                    type: "text", className: "form-control", placeholder: "Order No." })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-6" },
                            React.createElement(
                                "div",
                                { className: "form-group" },
                                React.createElement(
                                    "label",
                                    { className: "mandatory" },
                                    "Date"
                                ),
                                React.createElement("input", { ref: function (node) {
                                        this.Date = node;
                                    }.bind(this), readOnly: true,
                                    type: "text", className: "form-control", placeholder: "Date" })
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { className: "mandatory" },
                            "Item"
                        ),
                        React.createElement(ItemSelect, { ItemText: this.state.Item.ItemName, ItemChange: this.inputChange, GoForItemSelect: this.goForSelectItem })
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { className: "mandatory" },
                            "Amount Credit To"
                        ),
                        React.createElement("input", { ref: function (node) {
                                this.Account = node;
                            }.bind(this), readOnly: true,
                            type: "text", value: this.state.Item.AccountName, className: "form-control" })
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { className: "mandatory" },
                            "Remark"
                        ),
                        React.createElement("input", { ref: function (node) {
                                this.Remark = node;
                            }.bind(this),
                            type: "text", className: "form-control", placeholder: "Remark", onChange: this.inputChange })
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-6" },
                            React.createElement(
                                "div",
                                { className: "form-group" },
                                React.createElement(
                                    "label",
                                    { className: "mandatory" },
                                    "Charges/Account"
                                ),
                                React.createElement("input", { ref: function (node) {
                                        this.Charges = node;
                                    }.bind(this), style: { textAlign: 'right' },
                                    type: "number", className: "form-control", placeholder: "Charges", onChange: this.chargesChange })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-6" },
                            React.createElement(
                                "div",
                                { className: "form-group" },
                                React.createElement(
                                    "label",
                                    { className: "mandatory" },
                                    "Total"
                                ),
                                React.createElement("input", { ref: function (node) {
                                        this.Amount = node;
                                    }.bind(this), readOnly: true, style: { textAlign: 'right' },
                                    type: "number", className: "form-control", placeholder: "Total", onChange: this.inputChange })
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
                                "button",
                                { type: "button", className: "form-control btn btn-primary", onClick: this.goForAddSelectedAccounts },
                                "Selct Memb Acc"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-6" },
                            React.createElement(
                                "button",
                                { type: "button", className: "form-control btn btn-success", onClick: this.addAllMemberAccounts },
                                "Add all Memb Acc"
                            )
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
                                { className: "col-xs-6" },
                                "Account Name"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-2", style: { textAlign: "right" } },
                                "Amount"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-2", style: { textAlign: "right" } },
                                "Paid"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-2" },
                                "Actions"
                            )
                        )
                    ),
                    this.getList()
                )
            ),
            this.state.AllowEdit && React.createElement(AddEditFooter, { Clear: this.clear, Save: this.save, NotValidInput: this.state.NotValidInput })
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
        if (itemType == 22) {
            this.updateItem(item);
        }
        if (itemType == 13) {
            this.updateChargeAccounts(item);
        }
    },
    clear: function () {
        this.setState({ NotValidInput: false, Account: { AccountName: '' } });
        this.ItemName.value = "";
    },
    inputChange: function () {
        this.setState({ NotValidInput: this.Charges.value == 0 || this.Remark.value.length == 0 || this.state.Item.ItemName == "" || this.state.Accounts.length == 0 });
    },
    chargesChange: function () {
        this.state.Accounts.map(function (account) {
            account.Amount = this.Charges.value;
        }.bind(this));
        this.updateTotal(this.state.Accounts);
        this.inputChange();
    },
    getList: function () {
        var srNo = 0;
        return this.state.Accounts.map(function (account) {
            srNo += 1;
            return React.createElement(ChargeAccountRow, { key: srNo, Account: account, SrNo: srNo, Remove: this.remove, AllowEdit: this.state.AllowEdit });
        }.bind(this));
    },
    goForSelectItem: function (e) {
        this.props.ShowItemList(true, this.props.ShowAddCharge);
    },
    updateItem: function (item) {

        this.setState({
            Item: item,
            NotValidInput: this.Charges.value == 0 || item.ItemName == "" || this.state.Accounts.length == 0
        });
    },
    updateChargeAccounts: function (items) {
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

        items.map(function (item) {
            if (item.PaidAmount == null || typeof item.PaidAmount == "undefined") {
                item.PaidAmount = 0;
            }
            item.Amount = this.Charges.value;
        }.bind(this));

        this.updateTotal(items);

        this.setState({
            Accounts: items,
            NotValidInput: this.Charges.value == 0 || this.state.Item.ItemName == "" || items.length == 0
        });
    },
    updateTotal: function (accounts) {
        let total = 0;
        accounts.map(function (item) {
            total += parseInt(item.Amount);
        }.bind(this));
        this.Amount.value = total;
    },
    updateEntity: function (entity) {
        if (entity == null || typeof entity == "undefined" || typeof entity.ChargeOrderId == "undefined") {
            entity = { ChargeOrderId: -1, ItemId: -1 };
        }
        this.getRecord(entity);
    },
    loadAccounts: function () {
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('account/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    addAllMemberAccounts: function () {
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('account/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            const memberAccounts = data.filter(function (account) {
                return account.AccountType == 1;
            });
            this.updateChargeAccounts(memberAccounts);
        }.bind(this));
    },
    goForAddSelectedAccounts: function () {
        this.props.ShowAccountList(true, this.props.ShowAddCharge, true);
    },
    remove: function (account) {
        if (!this.state.AllowEdit) {
            this.makeAccountChargeZero(account);
            return;
        } else {
            var index = this.state.Accounts.indexOf(account);
            if (index > -1) {
                this.state.Accounts.splice(index, 1);
                this.setState({ Accounts: this.state.Accounts });
                this.updateTotal(this.state.Accounts);
            }
        }
    },
    makeAccountChargeZero: function (account) {
        axiosPost('ChargeOrder/makeAccountChargeZero', { chargePayeeDetailId: account.ChargePayeeDetailId }, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                account.Amount = 0;
                this.setState({ Accounts: this.state.Accounts });
                this.updateTotal(this.state.Accounts);
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
    save: function () {
        var dataToPost = new FormData();
        var entity = {
            ChargeOrderId: this.state.Entity.ChargeOrderId,
            OrgId: _LoginAccount.OrgId,
            ItemId: this.state.Item.ItemId,
            AccountId: this.state.Item.AccountId,
            Remark: this.Remark.value,
            Charges: this.Charges.value,
            ChargePayeeDetails: this.state.Accounts
        };
        appendObjectToFormData(entity, dataToPost, "");
        _ProgressBar.IMBusy();
        ajaxPost('ChargeOrder/save', dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
    getRecord: function (entity) {
        var urlParams = "?chargeOrderId=" + entity.ChargeOrderId + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.OrderNo.value = data.Data.ChargeOrderNo;
            this.Remark.value = data.Data.Remark;
            this.Date.value = getFormattedDate(data.Data.ChargeDt);
            this.Charges.value = data.Data.Charges;
            this.Amount.value = data.Data.Amount;
            this.Remark.value = data.Data.Remark;
            if (entity.ChargeOrderId == -1) {
                this.setState({
                    AllowEdit: true,
                    Entity: data.Data,
                    NotValidInput: true,
                    Item: { ItemId: -1, ItemName: '' },
                    Accounts: []
                });
            } else {
                this.setState({
                    AllowEdit: data.Data.PaidAmount == 0,
                    Entity: data.Data,
                    NotValidInput: false,
                    Item: { ItemId: data.Data.ItemId, ItemName: data.Data.ItemName, AccountId: data.Data.AccountId, AccountName: data.Data.AccountName },
                    Accounts: data.Data.ChargePayeeDetails
                });
            }
        }.bind(this));
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&chargeOrderId=" + this.state.Entity.ChargeOrderId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/chargeOrder' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'ChargeOrder.pdf');
    }
});