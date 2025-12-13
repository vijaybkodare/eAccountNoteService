var AddPayBill = React.createClass({
    displayName: "AddPayBill",

    getInitialState: function () {
        return {
            NotValidInput: false,
            Entity: {}
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: "Bill Payment" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "div",
                    { className: "listItem2" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontSize: "smaller", textAlign: "right" } },
                            "Date:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontSize: "smaller" } },
                            getFormattedDate(this.state.Entity.BillDt)
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontSize: "smaller", textAlign: "right" } },
                            "Bill No.:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontSize: "smaller" } },
                            this.state.Entity.BillNo
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { textAlign: "right" } },
                            "Item:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { fontWeight: "bold" } },
                            this.state.Entity.ItemName
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { textAlign: "right" } },
                            "Amount:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { color: "blue", fontWeight: "bold" } },
                            this.state.Entity.Amount
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { textAlign: "right" } },
                            "Paid Amount:"
                        ),
                        React.createElement(
                            "div",
                            { className: "col col-xs-6", style: { color: "green", fontWeight: "bold" } },
                            this.state.Entity.PaidAmount
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "mandatory" },
                        "Amount to Pay"
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
                        "Transaction ID"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.TransactionId = node;
                        }.bind(this),
                        type: "text", className: "form-control", placeholder: "Transaction ID" })
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
                React.createElement(
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
    inputChange: function () {
        this.setState({ NotValidInput: this.Amount.value == 0 || this.Amount.value > this.state.Entity.Amount - this.state.Entity.PaidAmount });
    },
    updateEntity: function (entity) {
        this.Amount.value = entity.Amount - entity.PaidAmount;
        this.Remark.value = "";
        this.TransactionId.value = "";
        this.setState({
            Entity: entity
        });
    },
    save: function () {
        var dataToPost = new FormData();
        var entity = {
            BillOrderId: this.state.Entity.BillOrderId,
            DrAccountId: this.state.Entity.BankAccountId,
            CrAccountId: this.state.Entity.AccountId,
            Remark: this.Remark.value ? this.Remark.value : "",
            Amount: this.Amount.value,
            TransactionId: this.TransactionId.value,
            Status: 0,
            RefType: 0,
            RefId: 0
        };
        appendObjectToFormData(entity, dataToPost, "");
        _ProgressBar.IMBusy();
        ajaxPost('BillOrder/billPayment', dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
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
    }
});