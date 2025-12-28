var ReportCommand = React.createClass({
    render: function() {
        let showFilter = typeof(this.props.ShowFilter) == "undefined"? true : this.props.ShowFilter;
        let showDownload = typeof(this.props.ShowDownload) == "undefined"? true : this.props.ShowDownload;
        return (
            <div style={{ textAlign: "center", marginBottom: 5 }}>
                <div>
                {
                    showFilter && <button className="btn btn-primary marginR5" type="button" onClick={this.props.ShowReportFilter}>
                        <span className="glyphicon glyphicon-filter" />
                    </button>
                }
                {
                        isAdmin() && showDownload && <button className="btn btn-primary" type="button" onClick={this.props.DownloadReport}>
                            <span className="glyphicon glyphicon-download-alt" />{this.props.downloadText}
                    </button>
                 }
                </div>
                {
                    this.props.filterTitle && <div className="listItem5 fontSizeSr">
                        {this.props.filterTitle}
                    </div>
                }
            </div>
        );
    },
});