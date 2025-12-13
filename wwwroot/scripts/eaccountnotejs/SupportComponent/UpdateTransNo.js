var UpdateTransNo = React.createClass({
    displayName: "UpdateTransNo",

    getInitialState: function () {
        return {
            NotValidInput: true,
            Entity: {},
            TransactionId: '',
            ActionOnSave: function () {},
            CashPayment: false
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.UpdateTransNo = node;
                }.bind(this),
                className: "panel panel-EAccNoteThrd",
                style: { display: "none", position: "fixed", top: "50%", left: "50%", marginTop: -75, marginLeft: -150, width: 300, zIndex: 100 } },
            React.createElement(
                "div",
                { className: "panel-heading" },
                "Update Transaction Id"
            ),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "mandatory" },
                        "Existing Transaction ID"
                    ),
                    React.createElement("input", { type: "text", className: "form-control", readOnly: true, value: this.state.Entity.TransactionId })
                ),
                React.createElement(
                    "div",
                    { className: "checkbox", style: { marginBottom: 0, marginTop: 0 } },
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", { ref: function (node) {
                                this.CashPayment = node;
                            }.bind(this),
                            type: "checkbox", checked: this.state.CashPayment, onChange: this.cashPaymentChange }),
                        "Cash Payment"
                    )
                ),
                !this.state.CashPayment && React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "mandatory" },
                        "New Transaction ID"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.TransactionId = node;
                        }.bind(this),
                        type: "text", className: "form-control", placeholder: "Transaction ID", value: this.state.TransactionId, onChange: this.transNoChange })
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
                        type: "text", className: "form-control", placeholder: "Remark", value: this.state.Remark, onChange: this.remarkChange })
                )
            ),
            React.createElement(
                "div",
                { className: "panel-footer", style: { textAlign: "right" } },
                React.createElement(
                    "button",
                    { className: "btn btn-danger", onClick: this.cancel },
                    "Cancel"
                ),
                "\xA0",
                React.createElement(
                    "button",
                    { className: "btn btn-primary", disabled: this.state.NotValidInput, onClick: this.save },
                    "Save"
                )
            )
        );
    },
    show: function (entity, actionOnSave) {
        this.UpdateTransNo.style.display = "block";
        this.setState({
            NotValidInput: false,
            Entity: entity,
            TransactionId: entity.TransactionId,
            ActionOnSave: actionOnSave,
            CashPayment: entity.TransMode == 1 ? true : false,
            Remark: entity.Remark
        });
    },
    cashPaymentChange: function (e) {
        this.setState({ CashPayment: e.target.checked });
        this.inputChange();
    },
    remarkChange: function (e) {
        this.setState({ Remark: e.target.value });
    },
    transNoChange: function (e) {
        this.setState({ TransactionId: e.target.value });
        this.inputChange();
    },
    inputChange: function () {
        var notValidTransId = true;
        if (this.CashPayment.checked) {
            notValidTransId = false;
        } else {
            if (this.TransactionId) {
                notValidTransId = this.TransactionId.value.trim().length == 0;
            }
        }
        this.setState({
            NotValidInput: notValidTransId,
            TransactionId: this.TransactionId.value
        });
    },
    cancel: function () {
        this.hide();
    },
    save: function () {
        let uri = 'ChargeOrder/updateChargePayTrans';
        var dataToPost = new FormData();
        var transId = '';
        if (!this.state.CashPayment) {
            transId = this.TransactionId.value;
        }
        var entity = {
            Id: this.state.Entity.Id,
            Source: this.state.Entity.Source,
            OrgId: _LoginAccount.OrgId,
            TransactionId: transId,
            TransMode: this.state.CashPayment ? 1 : 0,
            Remark: this.Remark.value
        };
        appendObjectToFormData(entity, dataToPost, "");
        _ProgressBar.IMBusy();
        ajaxPost(uri, dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.hide();
                this.state.ActionOnSave();
            } else {
                _Alert.showWarning(data.Error, 5000);
            }
        }.bind(this));
    },
    hide: function () {
        this.UpdateTransNo.style.display = "none";
    }
});