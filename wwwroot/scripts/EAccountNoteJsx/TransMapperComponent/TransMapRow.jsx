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
                        {getFormattedDate3(this.props.Item.bankStatement.TransDt)}
                    </span>&nbsp;&nbsp;&nbsp;
                    <span className="fontSizeLg fontWeightB">
                        {this.props.Item.bankStatement.Amount}
                    </span>
                    <br />
                    {this.props.Item.bankStatement.Remark}
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
                key={item.accountMaster.AccountId}
                BankStatement={this.props.Item.bankStatement}
                AccountDto={item}
                SelCharges={this.props.SelCharges}
                ChargeItemSelChange={this.props.ChargeItemSelChange}
            />
        }.bind(this));
    },
});