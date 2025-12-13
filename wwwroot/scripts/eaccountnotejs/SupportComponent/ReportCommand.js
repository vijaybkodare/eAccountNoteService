var ReportCommand = React.createClass({
    displayName: "ReportCommand",

    render: function () {
        let showFilter = typeof this.props.ShowFilter == "undefined" ? true : this.props.ShowFilter;
        let showDownload = typeof this.props.ShowDownload == "undefined" ? true : this.props.ShowDownload;
        return React.createElement(
            "div",
            { style: { textAlign: "center", marginBottom: 5 } },
            React.createElement(
                "div",
                null,
                showFilter && React.createElement(
                    "button",
                    { className: "btn btn-primary marginR5", type: "button", onClick: this.props.ShowReportFilter },
                    React.createElement("span", { className: "glyphicon glyphicon-filter" })
                ),
                isAdmin() && showDownload && React.createElement(
                    "button",
                    { className: "btn btn-primary", type: "button", onClick: this.props.DownloadReport },
                    React.createElement("span", { className: "glyphicon glyphicon-download-alt" }),
                    this.props.downloadText
                )
            ),
            this.props.filterTitle && React.createElement(
                "div",
                { className: "listItem5 fontSizeSr" },
                this.props.filterTitle
            )
        );
    }
});