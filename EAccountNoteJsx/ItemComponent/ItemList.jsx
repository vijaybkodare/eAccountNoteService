var ItemList = React.createClass({
    getInitialState: function () {
        return { 
            Filter: "",
            ItemSelMode: false,
            MultiSelect: false,
            ShowNextComponent: null,
            Items: [],
        };
    },
    render: function() {
        var showNextComponent = this.state.ShowNextComponent? this.state.ShowNextComponent : this.props.ShowNextComponent;
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={showNextComponent} ItemSelMode={this.state.ItemSelMode} Title="Items"/>    
                <div className="panel-body">
                    <ListCommand 
                        ItemSelMode={this.state.ItemSelMode} 
                        MultiSelect={this.state.MultiSelect}
                        ShowAdd={this.props.ShowAdd}
                        SelectionComplete={this.selectionComplete}
                        ToggleAllSelect={this.toggleAllSelect}
                        ShowNextComponent={showNextComponent}/>
                    <ListFilter FilterChange={this.filterChange}/>
                    <div className="listHeader2">
                        <div className="row">
                            <div className="col-xs-6">
                                Item Name
                            </div>
                            <div className="col-xs-6">
                                Account
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
    showMe: function (itemSelMode, showNextComponent, multiSelect) {
        _Main.EAccountHome.hideAll();
        this.loadList()
        this.show(null, itemSelMode, showNextComponent, multiSelect);
    },
    loadList: function(){
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('item/list' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function(){
        var srNo = 0;
        return this.state.Items.map(function(item){
            if(item.Active){
                if(item.ItemName.toLowerCase().indexOf(this.state.Filter) > -1 
                || this.state.Filter == ""){
                    srNo += 1;
                    return (
                        <ItemRow
                            SrNo = {srNo}
                            key={item.ItemId}
                            Item = {item}
                            ItemSelected = {this.itemSelected}
                            ActionOnItemSelect = {this.actionOnItemSelect}
                            Selected = {item.Selected}
                        />
                    );
                }
            }
        }.bind(this));
    },
    actionOnItemSelect: function(item){
        if(this.state.ItemSelMode){
            if(this.state.MultiSelect){
                item.Selected = !item.Selected
                this.setState({});
            } else {
                this.state.ShowNextComponent(item, 22);
            }
        } else {
            this.props.ShowAdd(item, 21);
        }
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
    }
});