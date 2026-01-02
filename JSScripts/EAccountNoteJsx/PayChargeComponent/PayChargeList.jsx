var PayChargeList = React.createClass({
    getInitialState: function () {
        return {
            ItemSelect: false,
            ToggleSel: true,
            TotalPendingAmount: 0,
            Items: [],
        };
    },
    render: function () {
        let renderData = this.getRenderData(this.state.ToggleSel, this.state.ItemSelect);
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} 
                className={!this.props.HideListHeader ? "panel panel-EAccNotePrim" : ""}>
                {
                    !this.props.HideListHeader &&
                    <ListHeader ShowNextComponent={this.props.ShowNextComponent} ItemSelMode={true} Title="Charges"/>    
                }
                <div className="panel-body">
                    {renderData.List.length > 0 &&
                        <div style={{ textAlign: "center", marginBottom: 3 }}>
                            <button id="payPendingBtn" className="btn btn-primary" type="button" disabled={renderData.TotalPendingAmount == 0} onClick={function () { this.payCummulative(renderData) }.bind(this)}>
                                <span className="glyphicon glyphicon-arrow-right"/>&nbsp;Pay:&nbsp; {renderData.TotalPendingAmount}
                            </button>
                            <span id="toggleSelBtn" className={this.getCSSClass()}>
                                <span className="glyphicon glyphicon-ok-circle" onClick={this.actionOnToggle} />
                            </span>
                            {renderData.TotalPendingAmount == 0 &&
                                < div className="alert alert-danger alert1">
                                    Please select Charge Items to Pay
                                </div>
                    }
                        </div>
                    }
                    {renderData.List.length == 0 &&
                        <div className="alert alert-info textAlignC">
                            No pending charges. Good to Enjoy!!
                        </div>
                    } 
                    {renderData.List}
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(accountId){
        if(!this.props.HideListHeader) {
            _Main.EAccountHome.hideAll();
        }
        this.loadList(accountId);
        this.loadAdvPaySummary(accountId)
        this.show();
    },
    loadList: function(accountId){
        var urlParams = "?orgId=" + _LoginAccount.OrgId + "&accountId=" + accountId;
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/PayCharges' + urlParams,function(data){
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
                //ToggleSel: data.length == 1? true : false,
            });
        }.bind(this));
    },
    loadAdvPaySummary: function (accountId) {
        var urlParams = "?orgId=" + _LoginAccount.OrgId + "&accountId=" + accountId;
        _ProgressBar.IMBusy();
        ajaxGet('api/AdvCharge/account_summary' + urlParams, function (data) {
            _ProgressBar.IMDone();
            _LoginAccount.AdvPaySummary = data;
        }.bind(this));
    },
    getCSSClass: function () {
        return this.state.ToggleSel ? "unSelIcon" : "selIcon";
    },
    actionOnToggle: function () {
        this.setState({ ToggleSel: !this.state.ToggleSel, ItemSelect: false});
    },
    payCummulative: function (renderData) {
        let chargeItem = this.getTopSelectedChargeItem();
        var item = {
            Amount: renderData.TotalPendingAmount,
            PaidAmount: 0,
            AccountName: chargeItem.AccountName,
            AccountId: chargeItem.AccountId,
            ItemAccountId: chargeItem.ItemAccountId,
            ChargePayeeDetailIds: renderData.ChargePayeeDetailIds,
            ChargeItem: chargeItem,
        }
        this.props.ShowAdd(item, 1);
    },
    actionOnItemSelect: function(item){
        item.IsCummulative = false;
        item.Selected = !item.Selected;
        this.setState({
            ItemSelect: true
        });
    },
    getRenderData: function(toggleSel, itemSel){
        let totalPendingAmount = 0;
        let chargePayeeDetailIds = [];
        let list = this.state.Items.map(function (item) {
            if (!itemSel) {
                item.Selected = toggleSel;
            }
            if (item.Selected) {
                totalPendingAmount += item.Amount - item.PaidAmount;
                chargePayeeDetailIds.push(item.ChargePayeeDetailId);
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
        }
    },
    getTopSelectedChargeItem: function () {
        let chargeItem = {};
        this.state.Items.forEach(function (item) {
            if (item.Selected) {
                chargeItem = item;
                return
            }
        });
        return chargeItem;
    },
});