var JVList = React.createClass({
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
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="JV"/>    
                <div className="panel-body">
                    <ListCommand 
                        ItemSelMode={this.state.ItemSelMode} 
                        MultiSelect={this.state.MultiSelect}
                        ShowAdd={this.props.ShowAdd}
                        SelectionComplete={this.selectionComplete}
                        ToggleAllSelect={this.toggleAllSelect}
                        ShowNextComponent={showNextComponent}/>
                    <ListFilter FilterChange={this.filterChange}/>
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
        ajaxGet('JVOrder/list' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function(){
        return this.state.Items.map(function (item) {
            if (item.DrAccount.toLowerCase().indexOf(this.state.Filter) > -1
            || item.CrAccount.toLowerCase().indexOf(this.state.Filter) > -1
                || this.state.Filter == "") {
                return (
                    <JVRow
                        key={item.JVOrderId}
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