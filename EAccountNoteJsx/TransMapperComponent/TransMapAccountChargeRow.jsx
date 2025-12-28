var TransMapAccountChargeRow = React.createClass({
    getInitialState: function () {
        return {
            ItemSelect: false,
            Items: [],
            IsProcessed: false,
        };
    },
    render: function () {
        let renderData = this.getRenderData();
        return (
            <div>
                <div style={{ textAlign: "center", marginBottom: 3 }}>
                    {renderData.List.length > 0 && !this.state.IsProcessed && renderData.TotalPendingAmount >= this.props.BankStatement.Amount &&
                        <div style={{ textAlign: "center", marginBottom: 3 }}>
                            <button id="payPendingBtn" className="btn btn-primary" type="button" onClick={function () { this.save(renderData) }.bind(this)}>
                                <span className="glyphicon glyphicon-arrow-right" />&nbsp;Pay:&nbsp; {renderData.TotalPendingAmount}
                            </button>
                        </div>
                    }
                </div>
                {renderData.List}
            </div>
        );
    },
    loadAccountCharges: function () {
        return this.props.Items.map(function (item) {
            return <PayChargeRow
                key={item.ChargePayeeDetailId}
                Item={item}
                ActionOnItemSelect={this.actionOnItemSelect}
            />
        }.bind(this));
    },
    actionOnItemSelect: function (item) {
        if (this.state.IsProcessed) {
            return;
        }
        item.Selected = !item.Selected;
        this.setState({
            ItemSelect: true
        });
        this.props.ChargeItemSelChange(this.props.BankStatement.BankStatementId, item.ChargePayeeDetailId, item.Selected);
    },
    getRenderData: function () {
        let totalPendingAmount = 0;
        let chargePayeeDetailIds = [];
        let itemAccountId = -1;
        let list = this.props.Items.map(function (item) {
            let charges = this.props.SelCharges.filter(function (charge) {
                return charge.ChargePayeeDetailId == item.ChargePayeeDetailId &&
                    this.props.BankStatement.BankStatementId != charge.BankStatementId;
            }.bind(this));
            if (charges.length > 0) {
                return null;
            }

            if (item.Selected) {
                totalPendingAmount += item.Amount - item.PaidAmount;
                chargePayeeDetailIds.push(item.ChargePayeeDetailId);
                itemAccountId = item.ItemAccountId;
            }
            return (
                <PayChargeRow
                    key={item.ChargePayeeDetailId}
                    Item={item}
                    ActionOnItemSelect={this.actionOnItemSelect}
                />
            );
        }.bind(this));
        return {
            TotalPendingAmount: totalPendingAmount,
            List: list,
            ChargePayeeDetailIds: chargePayeeDetailIds,
            ItemAccountId: itemAccountId,
        }
    },
    save: function (renderData) {
        let uri = 'ChargeOrder/cummulativeChargePayment';
        var dataToPost = new FormData();
        var entity = {
            ChargePayeeDetailId: -1,
            OrgId: _LoginAccount.OrgId,
            AccountId: this.props.AccountId,
            DrAccountId: this.props.AccountId,
            CrAccountId: renderData.ItemAccountId,
            Remark: "Auto Entry",
            Amount: this.props.BankStatement.Amount,
            TransactionId: this.props.BankStatement.TransactionId,
            Status: 0,
            RefType: 0,
            RefId: 0,
            TransMode: 0,
            ChargePayeeDetailIds: renderData.ChargePayeeDetailIds,
            BankStatementId: this.props.BankStatement.BankStatementId,
        }
        appendObjectToFormData2(entity, dataToPost, "");
        _ProgressBar.IMBusy();
        ajaxPost(uri, dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.setState({
                    IsProcessed: true
                });
            } else {
                _Alert.showWarning(data.Error, 5000);
            }
        }.bind(this));
    },
});