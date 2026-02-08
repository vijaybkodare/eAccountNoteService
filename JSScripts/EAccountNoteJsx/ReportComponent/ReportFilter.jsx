var ReportFilter = React.createClass({
    getInitialState: function () {
        return{
            ShowNextComponent: null,
            Account:{AccountId:-1, AccountName:''}
        };
    },
    render: function() {
        let showAccount = typeof(this.props.ShowAccount) == "undefined"? true : this.props.ShowAccount;
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <div className="panel-heading">
                    <button className="btn btn-primary" onClick={this.state.ShowNextComponent}>
                        <span className="glyphicon glyphicon-chevron-left" />
                    </button>
                    &nbsp;
                    Report Filter
                </div>
                <div className="panel-body">
                    <div className="col-xs-6">
                        <div className="form-group">
                            <label className="mandatory">From Date</label>
                            <FlatPickrDate ref={function (node) { this.FromDt = node; }.bind(this)} />
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="form-group">
                            <label className="mandatory">To Date</label>
                            <FlatPickrDate ref={function (node) { this.ToDt = node; }.bind(this)} />
                        </div>
                    </div>
                    {
                        isAdmin() && showAccount && <div className="form-group">
                            <label className="mandatory">Account</label>
                            <ItemSelect ItemText={this.state.Account.AccountName} ItemChange={this.inputChange} ClearItemSelect={this.clearItemSelect} GoForItemSelect={this.goForSelectAccount} />
                        </div>
                    }
                    
                </div>
                <div className="panel-footer text-center">
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-success" onClick={this.applyFilter}>Apply</button>
                    </div>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(item, itemType){
        _Main.EAccountHome.hideAll();
        if(itemType == 1) {
            this.updateNextComponent(item);
        }
        if(itemType == 12){
            this.updateAccount(item);
        }
        this.show();
    },
    showMe2: function(item, itemType){
        _Main.EAccountHome.hideAll();
        if(itemType == 1) {
            this.updateNextComponent(item);
        }
        this.show();
    },
    clearItemSelect: function () {
        this.setState({ Account: { AccountId: -1, AccountName: '' } });
    },
    goForSelectAccount: function () {
        this.props.ShowAccountList(true, this.props.ShowReportFilter);
    },
    updateAccount: function (account) {
        if(typeof(account.AccountId) == "undefined"){
            account = {AccountId:-1, AccountName:''};
        }
        this.setState({
            Account: account,
        });
    },
    filterChange: function(){
       this.props.FilterChange(this.Filter.value);
    },
    updateNextComponent: function (showNextComponent) {
        this.setState({ ShowNextComponent: showNextComponent });
    },
    applyFilter: function () {
        let filter = {
            FromDate: this.FromDt.getValue(),
            ToDate: this.ToDt.getValue() + " 23:59:59",
            AccountId: this.state.Account.AccountId,
            Account: this.state.Account,
        }
        this.state.ShowNextComponent(filter);
    }
});