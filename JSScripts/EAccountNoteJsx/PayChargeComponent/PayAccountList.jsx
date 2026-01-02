var PayAccountList = React.createClass({
    getInitialState: function () {
        return { 
            Filter: "",
            Items: [],
        };
    },
    render: function() {
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} ItemSelMode={false} Title="Charges"/>    
                <div className="panel-body">
                    <ListFilter FilterChange={this.filterChange}/>
                    <div className="listHeader2">
                        <div className="row">
                            <div className="col-xs-8">
                                Account
                            </div>
                            <div className="col-xs-4" style={{textAlign: "right"}}>
                                Pending
                            </div>
                        </div>
                    </div>
                    {this.getList()}    
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(){
        _Main.EAccountHome.hideAll();
        this.loadList();
        this.show();
    },
    loadList: function(){
        var urlParams = "?profileId=" + _LoginAccount.ProfileId;
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/PayAccounts' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function(){
        return this.state.Items.map(function (item) {
            if ( (item.AccountName.toLowerCase().indexOf(this.state.Filter.toLowerCase()) > -1
                || this.state.Filter == "")) { //item.PendingAmount > 0 &&
                return (
                    <PayAccountRow
                        key={item.AccountId}
                        Item={item}
                        ActionOnItemSelect={this.actionOnItemSelect}
                    />
                );
            }
        }.bind(this));
    },
    actionOnItemSelect: function(item){
        this.props.ShowPayChargeList(item.AccountId);
    },
    filterChange: function(filter){
        this.setState({
            Filter: filter
        });
    },
});