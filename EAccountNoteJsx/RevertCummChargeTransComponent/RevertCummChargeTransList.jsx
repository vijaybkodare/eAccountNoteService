var RevertCummChargeTransList = React.createClass({
    getInitialState: function () {
        return { 
            Filter: "",
            Items: [],
        };
    },
    render: function() {
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} ItemSelMode={true} Title="Revert Charge Trans"/>    
                <div className="panel-body">
                    <ReportCommand ShowDownload={false} ShowReportFilter={this.showReportFilter} />
                    <hr/>
                    {this.getList()}    
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(filter){
        this.props.HideAll();
        this.loadList(filter);
        this.show();
    },
    loadList: function(filter){
        if(!filter || typeof(filter.FromDate) == "undefined"){
            filter = {FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1};
        }
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&accountId=" + filter.AccountId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        _ProgressBar.IMBusy();
        ajaxGet('RevertTrans/listCummulativeChargeTrans' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    showReportFilter: function(){
        this.props.ShowReportFilter(this.showMe, 1);
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            return (
                <RevertCummChargeTransRow
                    key={item.AdvChargeId}
                    Item={item}
                    ActionOnItemSelect={this.actionOnItemSelect}
                />
            );
        }.bind(this));
    },
    actionOnItemSelect: function(item){
        this.props.ShowAdd(item, 1);
    },
    filterChange: function(filter){
        this.setState({
            Filter: filter
        });
    },
    setItemSelMode: function(flag, nextComponent){
        this.setState({
            ItemSelMode: flag,
            ShowNextComponent: nextComponent
        });
    },
});