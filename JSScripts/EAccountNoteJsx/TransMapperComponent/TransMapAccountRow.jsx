var TransMapAccountRow = React.createClass({
    getInitialState: function () {
        return {

        };
    },
    render: function () {
        return (
            <div>
                <div className="row listItem7">
                        <div className="col col-sm-3 paddingR5 textAlignR">
                            Account:
                        </div>
                        <div className="col col-sm-3 paddingL5 fontWeightB">
                            {this.props.AccountDto.AccountMaster.AccountName}
                        </div>
                        <div className="col col-sm-3 paddingR5 textAlignR">
                            Weight:
                        </div>
                        <div className="col col-sm-3 paddingL5 fontWeightB">
                            {this.props.AccountDto.Weight}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-sm-6">
                            {this.loadAccountTransTokens()}
                        </div>
                    <div className="col col-sm-6">
                        <TransMapAccountChargeRow
                            key={this.props.BankStatement.BankStatementId + '-' + this.props.AccountDto.AccountMaster.AccountId}
                            AccountId={this.props.AccountDto.AccountMaster.AccountId}
                            BankStatement={this.props.BankStatement}
                            Items={this.props.AccountDto.ChargePayeeDetails}
                            SelCharges={this.props.SelCharges}
                            ChargeItemSelChange={this.props.ChargeItemSelChange}
                        />
                    </div>
                </div>
            </div>
        );
    },
    loadAccountTransTokens: function () {
        return this.props.AccountDto.AccountTransTokens.map(function (item) {
            return <TransMapAccountTokenRow
                key={this.props.BankStatement.BankStatementId + '-' + this.props.AccountDto.AccountMaster.AccountId + '-' + item.TokenValue}
                Item={item}
            />
        }.bind(this));
    },
});