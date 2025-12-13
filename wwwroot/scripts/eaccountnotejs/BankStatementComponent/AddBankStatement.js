var AddBankStatement = React.createClass({
    displayName: "AddBankStatement",

    getInitialState: function () {
        return {
            File: null
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: "Upload Bank Statement" }),
            React.createElement(
                "div",
                { className: "panel-body" },
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
                                "Statement No."
                            ),
                            React.createElement("input", { ref: function (node) {
                                    this.OrderNo = node;
                                }.bind(this), readOnly: true,
                                type: "text", className: "form-control", placeholder: "Statement No." })
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
                React.createElement(DateSelector, { Label: "From Date", ref: function (node) {
                        this.FromDt = node;
                    }.bind(this) }),
                React.createElement(DateSelector, { Label: "To Date", ref: function (node) {
                        this.ToDt = node;
                    }.bind(this) }),
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
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "Select Bank Statement:"
                    ),
                    React.createElement(
                        "ul",
                        { className: "ulList" },
                        React.createElement(
                            "li",
                            null,
                            "File must be in .xls or .xlsx format."
                        ),
                        React.createElement(
                            "li",
                            null,
                            "Data must be exist in 1st sheet."
                        ),
                        React.createElement(
                            "li",
                            null,
                            "1st row must be header row, containing column names: Date, Remark, Amount."
                        )
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.FileInput = node;
                        }.bind(this),
                        type: "file", accept: ".xls,.xlsx", className: "btn btn-primary form-control", onChange: this.fileChange })
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "Worksheet name"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.WorksheetName = node;
                        }.bind(this),
                        type: "text", className: "form-control", placeholder: "Worksheet name", onChange: this.inputChange })
                )
            ),
            React.createElement(
                "div",
                { className: "panel-footer text-center" },
                React.createElement(
                    "button",
                    { type: "button", className: "btn btn-success", disabled: !this.state.File, onClick: this.save },
                    "Upload"
                )
            )
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
        if (itemType == 12) {
            this.updateBankAccount(item);
        }
    },
    updateEntity: function (entity) {
        if (entity == null || typeof entity == "undefined" || typeof entity.BankStatementHeaderId == "undefined") {
            entity = { BankStatementHeaderId: -1 };
        }
        this.getRecord(entity);
    },
    upload: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;

        var formData = new FormData();
        formData.append('file', this.FileInput.files[0]);

        _ProgressBar.IMBusy();

        ajaxDownloadPdfPost('api/BankStatement/uploadBankStatement' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'UnProcessedBankStatement.pdf', formData);
    },
    save: function () {
        var dataToPost = new FormData();
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&id=" + this.state.Entity.BankStatementHeaderId;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue();
        urlParams += "&remark=" + this.Remark.value;
        urlParams += "&worksheetName=" + this.WorksheetName.value;
        dataToPost.append('file', this.FileInput.files[0]);
        _ProgressBar.IMBusy();
        ajaxPost('api/BankStatement/save' + urlParams, dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data) {
                this.props.ShowList();
            } else {
                _Alert.showWarning("Server side error", 2000);
            }
        }.bind(this));
    },
    fileChange: function (e) {
        const fileInput = e.target;
        const file = fileInput.files[0];
        this.setState({
            File: file
        });
    },
    getRecord: function (entity) {
        var urlParams = "?id=" + entity.BankStatementHeaderId + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/BankStatement/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.OrderNo.value = data.BankStatementNo;
            this.Date.value = getFormattedDate3(data.AddedDt);
            this.Remark.value = data.Remark;
            if (entity.BankStatementHeaderId == -1) {
                this.setState({
                    AllowEdit: true,
                    Entity: data,
                    NotValidInput: true
                });
            } else {
                this.setState({
                    AllowEdit: false,
                    Entity: data,
                    NotValidInput: true
                });
            }
        }.bind(this));
    }
});