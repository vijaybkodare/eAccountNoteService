var BillList = React.createClass({
    getInitialState: function () {
        return { 
            Filter: "",
            Items: [],
        };
    },
    render: function() {
        var showNextComponent = this.state.ShowNextComponent? this.state.ShowNextComponent : this.props.ShowNextComponent;
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Bill"/>    
                <div className="panel-body">
                    <ListCommand 
                        ItemSelMode={this.state.ItemSelMode} 
                        MultiSelect={this.state.MultiSelect}
                        ShowAdd={this.props.ShowAdd}
                        SelectionComplete={this.selectionComplete}
                        ToggleAllSelect={this.toggleAllSelect}
                        ShowNextComponent={showNextComponent}/>
                    <ListFilter FilterChange={this.filterChange}/>
                    {/*<div className="listHeader2">
                        <div className="row">
                            <div className="col-xs-3">
                                Bill #
                            </div>
                            <div className="col-xs-5">
                                Item Name
                            </div>
                            <div className="col-xs-4">
                                Amount
                            </div>
                        </div>
                    </div>*/}
                    
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
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('BillOrder/list' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function(){
        return this.state.Items.map(function (item) {
            if (item.ItemName.toLowerCase().indexOf(this.state.Filter) > -1
                || this.state.Filter == "") {
                return (
                    <BillRow
                        key={item.BillId}
                        Item={item}
                        ActionOnItemSelect = {this.actionOnItemSelect}
                    />
                );
            }

        }.bind(this));
    },
    filterChange: function(filter){
        this.setState({
            Filter: filter
        });
    },
    actionOnItemSelect: function(item){
        this.props.ShowAdd(item, 1);
    },
});