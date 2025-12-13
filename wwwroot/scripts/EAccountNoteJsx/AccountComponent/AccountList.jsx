var AccountList = React.createClass({
    getInitialState: function () {
        return {
            SelAll: false,
            Filter: "",
            ItemSelMode: false,
            MultiSelect: false,
            ShowNextComponent: null,
            Items: [],
        };
    },
    counter: 0,
    render: function() {
        this.rows = [];
        var showNextComponent = this.state.ShowNextComponent? this.state.ShowNextComponent : this.props.ShowNextComponent;
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader 
                    ShowNextComponent={showNextComponent} 
                    ItemSelMode={this.state.ItemSelMode}
                    Title="Accounts"/> 
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
                            <div className="col-xs-5">
                                Account Name
                            </div>
                            <div className="col-xs-4">
                                Type
                            </div>
                            <div className="col-xs-3">
                                Amount
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
        ajaxGet('account/list' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function(){
        var srNo = 0;
        return this.state.Items.map(function(account){
            if(account.Active && (account.AccountType == this.props.AccountType) || this.props.AccountType == -1){
                if(account.AccountName.toLowerCase().indexOf(this.state.Filter.toLowerCase()) > -1 
                || this.state.Filter == ""){
                    srNo += 1;
                    return this.getAccountRow(account, srNo);
                }
            }
        }.bind(this));
    },
    getAccountRow: function (account, srNo) {
        return (
            <AccountRow key={account.AccountId}
                AddNavigEntity={this.props.AddNavigEntity}
                ToggleAccountTrans={this.props.ToggleAccountTrans}
                OperMode={this.props.OperMode}
                SelAll={this.state.SelAll}
                UnselectSelAll={this.unselectSelAll}
                Account={account}
                ActionOnItemSelect = {this.actionOnItemSelect}
                Selected = {account.Selected}
                SrNo={srNo} />
        );
    },
    actionOnItemSelect: function(item){
        if(this.state.ItemSelMode){
            if(this.state.MultiSelect){
                item.Selected = !item.Selected
                this.setState({});
            } else {
                this.state.ShowNextComponent(item, this.props.ItemType? this.props.ItemType : 12);
            }
        } else {
            this.props.ShowAdd(item, 11);
        }
    },
    getSelectedItems: function(){
        var selectedItems = [];
        this.state.Items.map(function(item, i){
            if(item.Selected){
                selectedItems.push(item);
            }
        });
        return selectedItems;
    },
    selectionComplete: function(){
        this.state.ShowNextComponent(this.getSelectedItems(), 13);
    },
    toggleAllSelect: function(){
        this.state.Items.map(function(account){
            account.Selected = !account.Selected
        })
        this.setState({});
    },
    filterChange: function(filter){
        this.setState({
            Filter: filter,
        });
    },
    setItemSelMode: function(flag, nextComponent, multiSelect){
        this.setState({
            ItemSelMode: flag,
            MultiSelect: multiSelect,
            ShowNextComponent: nextComponent
        });
    },
});