var BankStatementRep2 = React.createClass({
    displayName: "BankStatementRep2",

    getInitialState: function () {
        return {
            Items: [],
            Status: -1
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Bank Statements" }),
            React.createElement(
                "div",
                { className: "panel-body" },
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
                        null,
                        "Remark"
                    ),
                    React.createElement("input", { ref: function (node) {
                            this.Remark = node;
                        }.bind(this),
                        type: "text", className: "form-control", placeholder: "Remark filter" })
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        null,
                        "Mapped status"
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-4" },
                            React.createElement(
                                "div",
                                { className: "radio" },
                                React.createElement(
                                    "label",
                                    null,
                                    React.createElement("input", { ref: "UserAccount", type: "radio", name: "Role", value: "-1", onChange: this.statusChange }),
                                    "All"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-4" },
                            React.createElement(
                                "div",
                                { className: "radio" },
                                React.createElement(
                                    "label",
                                    null,
                                    React.createElement("input", { ref: "UserAccount", type: "radio", name: "Role", value: "1", onChange: this.statusChange }),
                                    "Mapped"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-4" },
                            React.createElement(
                                "div",
                                { className: "radio" },
                                React.createElement(
                                    "label",
                                    null,
                                    React.createElement("input", { type: "radio", name: "Role", value: "0", onChange: this.statusChange }),
                                    "Not Mapped"
                                )
                            )
                        )
                    )
                ),
                React.createElement("hr", null),
                React.createElement(
                    "div",
                    { className: "text-center" },
                    React.createElement(
                        "button",
                        { className: "btn btn-primary marginR5", type: "button", onClick: this.getRecord },
                        React.createElement("span", { className: "glyphicon glyphicon-search" })
                    ),
                    React.createElement(
                        "button",
                        { className: "btn btn-primary", type: "button", onClick: this.downloadCsv },
                        React.createElement("span", { className: "glyphicon glyphicon-download-alt" })
                    )
                ),
                React.createElement("hr", null),
                this.getList()
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (id) {
        _Main.EAccountHome.hideAll();
        this.getRecord(id);
        this.show();
    },
    statusChange: function (e) {
        this.setState({ Status: e.currentTarget.value });
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            return this.getRow(item);
        }.bind(this));
    },
    getRecord: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&remark=" + this.Remark.value;
        urlParams += "&status=" + this.state.Status;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxGet('api/BankStatement/statements' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({ Items: data });
        }.bind(this));
    },
    downloadCsv: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&remark=" + this.Remark.value;
        urlParams += "&status=" + this.state.Status;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxDownload('report/getStatementInCsv' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'bankstatement.csv');
    },
    getRow: function (item) {
        return React.createElement(
            "div",
            { key: item.Id, className: item.Status == 1 ? "listItem6" : "listItem0" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        item.Status == 1 && React.createElement("span", { className: "selIcon glyphicon glyphicon-ok-circle", style: { fontSize: "15px" } }),
                        "Date"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingL5" },
                        item.TransDt.substring(0, 10)
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Amount"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingL5 fontWeightB" },
                        item.Amount
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Remark"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9" },
                        item.Remark
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Trans ID"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9 paddingL5 fontWeightB" },
                        item.TransactionId
                    )
                )
            )
        );
    }
});