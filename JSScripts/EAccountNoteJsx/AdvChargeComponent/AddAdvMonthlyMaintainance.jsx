var AddAdvMonthlyMaintainance = React.createClass({
    getInitialState: function () {
        return {
            AllowEdit: true,
            NotValidInput: true,
            Account: {},
            Item: { ItemId: -1, ItemName: '', AccountName: '', AccountId: -1 },
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Advance Maintainance" />
                <div className="panel-body">
                    <div className="listItem6Sel fontSizeS">
                        <div className="row">
                            <div className="col col-xs-5 paddingR5 textAlignR">
                                Account:
                            </div>
                            <div className="col col-xs-7 paddingL5 fontWeightB">
                                {this.state.Account.AccountName}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-5 paddingR5 textAlignR">
                                Item:
                            </div>
                            <div className="col col-xs-7 paddingL5 fontWeightB">
                                {this.state.Item.ItemName}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label className="mandatory">Adv Charge No.</label>
                                <input ref={function (node) { this.AdvChargeNo = node; }.bind(this)} readOnly={true}
                                    type="text" className="form-control" placeholder="Order No." />
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label className="mandatory">Date</label>
                                <input ref={function (node) { this.AdvChargeDt = node; }.bind(this)} readOnly={true}
                                    type="text" className="form-control" placeholder="Date" />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="mandatory">Amount</label>
                        <input ref={function (node) { this.Amount = node; }.bind(this)} style={{ textAlign: 'right' }}
                            type="number" className="form-control" onChange={this.inputChange} />
                    </div>
                    <div className="form-group">
                        <label className="mandatory">Transaction ID</label>
                        <input ref={function (node) { this.TransactionId = node; }.bind(this)}
                            type="text" className="form-control" placeholder="Transaction ID" onChange={this.inputChange} />
                    </div>
                    <div className="form-group">
                        <label>Remark</label>
                        <input ref={function (node) { this.Remark = node; }.bind(this)}
                            type="text" className="form-control" placeholder="Remark" onChange={this.inputChange} />
                    </div>
                    <PaymentScreenshot FillFormDetailFromImage={this.fillFormDetailFromImage} />
                </div>
                {this.state.AllowEdit && <AddEditFooter AllowClear={false} Save={this.save} NotValidInput={this.state.NotValidInput} />}
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.getRecord();
        this.getMonthlyMaintainanceItem();
        this.getAccount();
        this.show();
    },
    inputChange: function () {
        this.setState({ NotValidInput: this.isValidInput() });
    },
    isValidInput: function () {
        return this.Amount.value == 0 || this.state.Item.ItemId == -1 || this.TransactionId.value.trim().length == 0;
    },
    save: function () {
        var entity = {
            OrgId: _LoginAccount.OrgId,
            AdvChargeNo: '',
            ItemId: this.state.Item.ItemId,
            DrAccountId: _LoginAccount.AccountId,
            CrAccountId: this.state.Item.AccountId,
            TransactionId: this.TransactionId.value,
            Remark: this.Remark.value,
            Amount: this.Amount.value,
            Status: 0,
            RefType: 0,
            RefId: 0,
        }
        _ProgressBar.IMBusy();
        ajaxPostJson('api/AdvCharge/save', entity, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowNextComponent();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
    getRecord: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/AdvCharge/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.AdvChargeNo.value = data.AdvChargeNo;
            this.AdvChargeDt.value = getFormattedDate3(data.AdvChargeDt);
            this.Remark.value = "";
            this.Amount.value = 0;
            this.setState({
                AllowEdit: true,
                DrAccount: { AccountId: -1, AccountName: '' },
                Item: { ItemId: -1, ItemName: '', AccountName: '', AccountId: -1 },
            });
        }.bind(this));
    },
    getMonthlyMaintainanceItem: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/AppSetting/monthly_maintainance_item' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Item: data,
            });
        }.bind(this));
    },
    getAccount: function () {
        var urlParams = "?id=" + _LoginAccount.AccountId;
        _ProgressBar.IMBusy();
        ajaxGet('account/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Account: data,
            });
        }.bind(this));
    },
    fillFormDetailFromImage: function (imgData) {
        this.TransactionId.value = imgData.TransactionId;
        this.Remark.value = imgData.Remark;
        this.inputChange();
    }
});