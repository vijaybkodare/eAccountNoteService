var AccountRow = React.createClass({
    getInitialState: function () {
        return { 
        };
    },
    render: function() {
        return(
            <div className={this.props.Selected? "listItemSelected":"listItem"} onClick={this.actionOnItemSelect}>
                <div className="row">
                    <div className="col-xs-5">
                        <span className="badge badge-dark" style={{ marginRight: 4 }}>{this.props.SrNo}</span>
                        {this.props.Account.AccountName}
                    </div>
                    <div className="col-xs-4">
                        {getAccountType(this.props.Account.AccountType)}
                    </div>
                    <div className="col-xs-3" style={{ textAlign: "right", color: this.props.Account.Amount > 0 ? "green" : "red" }}>
                        {Math.abs(this.props.Account.Amount)}
                    </div>
                </div>
            </div>
        );
    },
    actionOnItemSelect: function(){
        this.props.ActionOnItemSelect(this.props.Account);
    },
});