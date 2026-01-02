var AutoTransEntryRep = React.createClass({
    render: function() {
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Auto Trans Entry Report"/>    
                <div className="panel-body">
                    <ReportCommand ShowFilter={false} DownloadReport={this.downloadReport} />
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(filter){
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
    },
    
});