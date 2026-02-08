var Filter = React.createClass({
    getInitialState: function () {
        return {
            ShowNextComponent: null,
            Account: { AccountId: -1, AccountName: '' }
        };
    },
    render: function () {
        let showAccount = typeof (this.props.ShowAccount) == "undefined" ? true : this.props.ShowAccount;
        return (
            <div>
                <div className="row">
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
                </div>
                {
                    showAccount && <div className="form-group">
                        <label className="mandatory">Account</label>
                        <ItemSelect ItemText={this.state.Account.AccountName} ItemChange={this.inputChange} ClearItemSelect={this.clearItemSelect} GoForItemSelect={this.goForSelectAccount} />
                    </div>
                }

            </div>

        );
    },
    componentDidMount: function () {
        
    },
    clearItemSelect: function () {
        this.setState({ Account: { AccountId: -1, AccountName: '' } });
    },
    goForSelectAccount: function () {
        this.props.ShowAccountList(true, this.props.ShowNextComponent);
    },
    updateAccount: function (account) {
        if(typeof(account.AccountId) == "undefined"){
            account = {AccountId:-1, AccountName:''};
        }
        this.setState({
            Account: account,
        });
    },
    value: function () {
        let filter = {
            FromDate: this.FromDt.getValue(),
            ToDate: this.ToDt.getValue() + " 23:59:59",
            AccountId: this.state.Account.AccountId,
            Account: this.state.Account,
        }
        return filter;
    }
});