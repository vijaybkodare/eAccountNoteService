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
                <DateSelector Label="From Date" ref={function (node) { this.FromDt = node; }.bind(this)} />
                <DateSelector Label="To Date" ref={function (node) { this.ToDt = node; }.bind(this)} />
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