var UserList = React.createClass({
    getInitialState: function () {
        return { 
            Filter: "",
            Items: [],
        };
    },
    render: function() {
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} ItemSelMode={false} Title="Users"/>    
                <div className="panel-body">
                    <ListCommand 
                        ItemSelMode={false} 
                        ShowAdd={this.props.ShowAdd}
                        />
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
        ajaxGet('User/list' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function(){
        return this.state.Items.map(function (item) {
            if (item.UserName.toLowerCase().indexOf(this.state.Filter.toLowerCase()) > -1
                || this.state.Filter == "") {
                return (
                    <UserRow
                        key={item.UserId}
                        Item={item}
                        ActionOnItemSelect={this.actionOnItemSelect}
                    />
                );
            }
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
});