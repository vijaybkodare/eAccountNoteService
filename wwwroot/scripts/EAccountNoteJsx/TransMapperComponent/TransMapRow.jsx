var TransMapRow = React.createClass({
    getInitialState: function () {
        return {
            
        };
    },
    render: function () {
        return (
            <div className="row listItem4" style={{ marginLeft: "5px", marginRight: "5px" }}>
                <div className="col col-sm-3">
                    <span className="badge badge-dark" style={{ marginRight: 4 }}>{this.props.SrNo}</span>
                    <span className="fontSizeSm">
                        {getFormattedDate(this.props.Item.BankStatement.TransDt)}
                    </span>&nbsp;&nbsp;&nbsp;
                    <span className="fontSizeLg fontWeightB">
                        {this.props.Item.BankStatement.Amount}
                    </span>
                    <br />
                    {this.props.Item.BankStatement.Remark}
                </div>
                <div className="col col-sm-9">
                    {this.loadMapAccounts()}
                </div>
            </div>
        );
    },
    loadMapAccounts: function () {
        if (!this.props.Item.accountDtos) {
            return null;
        }
        return this.props.Item.accountDtos.map(function (item) {
            return <TransMapAccountRow
                key={item.AccountMaster.AccountId}
                BankStatement={this.props.Item.BankStatement}
                AccountDto={item}
                SelCharges={this.props.SelCharges}
                ChargeItemSelChange={this.props.ChargeItemSelChange}
            />
        }.bind(this));
    },
});