var AutoTransEntryRep = React.createClass({
    displayName: "AutoTransEntryRep",

    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Auto Trans Entry Report" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ReportCommand, { ShowFilter: false, DownloadReport: this.downloadReport })
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (filter) {
        _Main.EAccountHome.hideAll();
        this.setState({});
        this.show();
    },
    downloadReport: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxDownloadPdf('api/AutoTransEntry/report' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'AutoTransEntry.pdf');
    }

});