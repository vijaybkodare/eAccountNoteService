var BankStatement = React.createClass({
    displayName: "BankStatement",

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
                                "Bill No."
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
                            "1st row must be header row, containing column names: Remark, Amount."
                        )
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.FileInput = node;
                        }.bind(this),
                        type: "file", accept: ".xls,.xlsx", className: "btn btn-primary form-control", onChange: this.fileChange })
                )
            ),
            React.createElement(
                "div",
                { className: "panel-footer text-center" },
                React.createElement(
                    "button",
                    { type: "button", className: "btn btn-success", disabled: !this.state.File, onClick: this.upload },
                    "Upload"
                )
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (filter) {
        _Main.EAccountHome.hideAll();
        this.show();
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
    fileChange: function (e) {
        const fileInput = e.target;
        const file = fileInput.files[0];
        this.setState({
            File: file
        });
    }
});