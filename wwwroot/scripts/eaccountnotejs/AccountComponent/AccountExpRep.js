var AccountExpRep = React.createClass({
    displayName: "AccountExpRep",

    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Account Exp Report" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(Filter, { ref: function (node) {
                        this.Filter = node;
                    }.bind(this), ShowAccountList: this.props.ShowAccountList, ShowNextComponent: this.showMe })
            ),
            React.createElement(
                "div",
                { className: "panel-footer text-center" },
                React.createElement(
                    "div",
                    { className: "btn-group", role: "group" },
                    React.createElement(
                        "button",
                        { type: "button", className: "btn btn-success", onClick: this.downloadReport },
                        "Download"
                    )
                )
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.setState({});
        this.show();
        if (itemType == 12) {
            this.Filter.updateAccount(item);
        }
    },
    prepareAutoTransEntry: function () {
        let filter = this.Filter.value();
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        urlParams += "&accountId=" + filter.AccountId;

        var formData = new FormData();

        _ProgressBar.IMBusy();

        ajaxPost('api/AutoTransEntry/prepare' + urlParams, formData, function () {
            _ProgressBar.IMDone();
            this.downloadReport();
        }.bind(this));
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.Filter.value().FromDate;
        urlParams += "&toDate=" + this.Filter.value().ToDate;
        urlParams += "&accountId=" + this.Filter.value().AccountId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/PdfReport/expense-report' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'expense-report.pdf');
    }
});