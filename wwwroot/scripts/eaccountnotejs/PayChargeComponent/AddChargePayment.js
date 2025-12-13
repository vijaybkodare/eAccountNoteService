var AddChargePayment = React.createClass({
    displayName: "AddChargePayment",

    getInitialState: function () {
        return {
            NotValidInput: true,
            Entity: { ChargePayeeDetailIds: [] },
            TransMode: 0
        };
    },
    render: function () {

        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.actionOnBack, Title: "Charge Payment" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ChargeDetail, { Entity: this.state.Entity }),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "mandatory" },
                        "Amount to Pay"
                    ),
                    React.createElement(
                        "div",
                        { className: "alert alert-info alert2 fontSizeSr" },
                        React.createElement(
                            "ul",
                            { className: "ulList" },
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "span",
                                    { className: "colorRed" },
                                    "Amount"
                                ),
                                " should be less than or equal to Pending Amount."
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "span",
                                    { className: "colorRed" },
                                    "Amount"
                                ),
                                " should be match with Amount associated with Transaction ID, else it will ",
                                React.createElement(
                                    "span",
                                    { className: "colorRed fontWeightB" },
                                    "fail"
                                ),
                                " in reconciliation."
                            )
                        )
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.Amount = node;
                        }.bind(this), style: { textAlign: 'right', fontSize: "larger", fontWeight: "900" },
                        type: "number", className: "form-control", onChange: this.inputChange })
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "Transaction Mode"
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-6" },
                            React.createElement(
                                "div",
                                { className: "radio inline" },
                                React.createElement(
                                    "label",
                                    null,
                                    React.createElement("input", { type: "radio", name: "TransMode", value: "0", checked: this.state.TransMode == 0, onChange: this.transModeChange }),
                                    "Regular Online Transfer"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-6" },
                            React.createElement(
                                "div",
                                { className: "radio inline" },
                                React.createElement(
                                    "label",
                                    null,
                                    React.createElement("input", { type: "radio", name: "TransMode", value: "1", checked: this.state.TransMode == 1, onChange: this.transModeChange }),
                                    "Cash Payment"
                                )
                            )
                        ),
                        this.getBalAdvPayment() > 0 && React.createElement(
                            "div",
                            { className: "col-xs-12" },
                            React.createElement(
                                "div",
                                { className: "radio inline" },
                                React.createElement(
                                    "label",
                                    null,
                                    React.createElement("input", { type: "radio", name: "TransMode", value: "2", checked: this.state.TransMode == 2, onChange: this.transModeChange }),
                                    "Adjust in Advance Payment ",
                                    React.createElement(
                                        "span",
                                        { className: "colorRed fontWeightB" },
                                        "(",
                                        this.getBalAdvPayment(),
                                        ")"
                                    )
                                )
                            )
                        )
                    )
                ),
                this.state.TransMode == 0 && React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "mandatory" },
                        "Transaction ID"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.TransactionId = node;
                        }.bind(this),
                        type: "text", className: "form-control", placeholder: "Transaction ID", onChange: this.inputChange })
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "Remark"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.Remark = node;
                        }.bind(this),
                        type: "text", className: "form-control", placeholder: "Remark" })
                ),
                this.state.TransMode == 0 && React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "Payment Screenshot"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.FileInput = node;
                        }.bind(this),
                        type: "file", className: "btn btn-primary form-control", onChange: this.fillFormDetailFromImage })
                )
            ),
            React.createElement(AddEditFooter, { AllowClear: false, Save: this.save, NotValidInput: this.state.NotValidInput })
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item) {
        _Main.EAccountHome.hideAll();
        this.updateEntity(item);
        this.show();
    },
    clear: function () {
        this.setState({ NotValidInput: false, Account: { AccountName: '' } });
        this.ItemName.value = "";
    },
    transModeChange: function (e) {
        this.setState({ TransMode: e.currentTarget.value });
        setTimeout(this.inputChange, 100);
    },
    inputChange: function () {
        var transMode = this.state.TransMode;
        var notValidTransId = true;
        if (transMode && (transMode == 1 || transMode == 2)) {
            notValidTransId = false;
        } else {
            if (this.TransactionId) {
                notValidTransId = this.TransactionId.value.trim().length == 0;
            }
        }
        var notValidAmount = this.Amount.value == 0 || this.Amount.value > this.state.Entity.Amount - this.state.Entity.PaidAmount;
        if (!notValidAmount && transMode == 2) {
            notValidAmount = this.Amount.value > this.getBalAdvPayment();
        }
        this.setState({
            NotValidInput: notValidAmount || notValidTransId
        });
    },
    updateEntity: function (entity) {
        this.Amount.value = 0; // entity.Amount - entity.PaidAmount;
        this.Remark.value = "";
        if (this.TransactionId) {
            this.TransactionId.value = "";
            this.FileInput.value = null;
        }
        this.setState({
            Entity: entity,
            TransMode: 0
        });
    },
    actionOnBack: function () {
        this.props.ShowList(this.state.Entity.AccountId);
    },
    save: function () {
        let uri = 'ChargeOrder/cummulativeChargePayment';
        var dataToPost = new FormData();
        var transId = '';
        if (this.state.TransMode == 0) {
            transId = this.TransactionId.value;
        }
        var entity = {
            ChargePayeeDetailId: this.state.Entity.ChargePayeeDetailId,
            OrgId: _LoginAccount.OrgId,
            AccountId: this.state.Entity.AccountId,
            DrAccountId: this.state.Entity.AccountId,
            CrAccountId: this.state.Entity.ItemAccountId,
            Remark: this.Remark.value ? this.Remark.value : "",
            Amount: this.Amount.value,
            TransactionId: transId,
            Status: 0,
            RefType: 0,
            RefId: _LoginAccount.AdvPaySummary.AdvChargeId,
            TransMode: this.state.TransMode,
            ChargePayeeDetailIds: this.state.Entity.ChargePayeeDetailIds
        };
        if (this.state.TransMode == 2) {
            entity.RefType = 1;
            entity.RefId = _LoginAccount.AdvPaySummary.AdvChargeId;
        }
        appendObjectToFormData2(entity, dataToPost, "");
        _ProgressBar.IMBusy();
        ajaxPost(uri, dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList(this.state.Entity.AccountId);
            } else {
                _Alert.showWarning(data.Error, 5000);
            }
        }.bind(this));
    },
    fillFormDetailFromImage: function (e) {
        const fileInput = e.target; // document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (!file) {
            return;
        }

        var formData = new FormData();
        formData.append('file', file);

        _ProgressBar.IMBusy();
        ajaxPost('LoadFile/LoadImage', formData, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                //this.Amount.value = data.Data.Amount;
                this.TransactionId.value = data.Data.TransactionId;
                this.Remark.value = data.Data.Remark;
                this.inputChange();
            }
        }.bind(this));
    },
    getBalAdvPayment: function () {
        let balAdvPay = 0;
        if (_LoginAccount.AdvPaySummary) {
            balAdvPay = _LoginAccount.AdvPaySummary.Amount - _LoginAccount.AdvPaySummary.SettleAmount;
        }
        return balAdvPay;
    }
});