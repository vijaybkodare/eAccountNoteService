var BankStatementRep = React.createClass({
    displayName: "BankStatementRep",

    getInitialState: function () {
        return {
            Entity: {}
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: "Bank Statement Report" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ReportCommand, { ShowFilter: false, DownloadReport: this.downloadReport }),
                React.createElement("hr", null),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Order No:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-2 paddingL5 fontWeightB" },
                        this.state.Entity.BankStatementNo
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Date:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 paddingL5" },
                        getFormattedDate3(this.state.Entity.AddedDt)
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3  paddingR5 textAlignR fontWeightB" },
                        "From Date:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingL5 fontWeightB" },
                        getFormattedDate3(this.state.Entity.FromDt)
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-3  paddingR5 textAlignR" },
                        "To Date:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingL5" },
                        getFormattedDate3(this.state.Entity.ToDt)
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3  paddingR5 textAlignR" },
                        "Remark:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9 paddingL5" },
                        this.state.Entity.Remark
                    )
                ),
                React.createElement("hr", null),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3  paddingR5 textAlignR" },
                        "Details:"
                    )
                ),
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
    getList: function () {
        if (this.state.Entity.Details == null) return null;
        return this.state.Entity.Details.map(function (item) {
            return this.getRow(item);
        }.bind(this));
    },
    getRecord: function (id) {
        var urlParams = "?id=" + id + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/BankStatement/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({ Entity: data });
        }.bind(this));
    },
    downloadReport: function () {
        var urlParams = "?id=" + this.state.Entity.BankStatementHeaderId + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/BankStatement/report' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'bankstatement.pdf');
    },
    getRow: function (item) {
        return React.createElement(
            "div",
            { key: item.Id, className: "listItem0" },
            React.createElement(
                "div",
                { className: "row fontSizeSr" },
                React.createElement(
                    "div",
                    { className: "col col-xs-3 paddingR5 textAlignR" },
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
                    item.TransactionId,
                    " \xA0"
                )
            )
        );
    }
});