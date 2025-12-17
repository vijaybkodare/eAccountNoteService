var AddChargePayment = React.createClass({
    getInitialState: function () {
        return{
            NotValidInput: true,
            Entity: { ChargePayeeDetailIds: [] },
            TransMode: 0,
        };
    },
    render: function () {
        
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.actionOnBack} Title="Charge Payment" />
                <div className="panel-body">
                    <ChargeDetail Entity={this.state.Entity}/>
                    
                    <div className="form-group">
                        <label className="mandatory">Amount to Pay</label>
                        <div className="alert alert-info alert2 fontSizeSr">
                            <ul className="ulList">
                                <li><span className="colorRed">Amount</span> should be less than or equal to Pending Amount.</li>
                                <li><span className="colorRed">Amount</span> should be match with Amount associated with Transaction ID, else it will <span className="colorRed fontWeightB">fail</span> in reconciliation.</li>
                            </ul>
                            
                        </div>
                        <input ref={function (node) { this.Amount = node; }.bind(this)} style={{ textAlign: 'right', fontSize: "larger", fontWeight: "900" }}
                            type="number" className="form-control" onChange={this.inputChange} />
                    </div>
                    <div className="form-group">
                        <label>Transaction Mode</label>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="radio inline">
                                    <label>
                                        <input type="radio" name="TransMode" value="0" checked={this.state.TransMode == 0} onChange={this.transModeChange} />
                                        Regular Online Transfer
                                    </label>
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="radio inline">
                                    <label>
                                        <input type="radio" name="TransMode" value="1" checked={this.state.TransMode == 1} onChange={this.transModeChange} />
                                        Cash Payment
                                    </label>
                                </div>
                            </div>
                            {this.getBalAdvPayment() > 0 &&
                                <div className="col-xs-12">
                                    <div className="radio inline">
                                        <label>
                                            <input type="radio" name="TransMode" value="2" checked={this.state.TransMode == 2} onChange={this.transModeChange} />
                                            Adjust in Advance Payment <span className="colorRed fontWeightB">({this.getBalAdvPayment()})</span>
                                        </label>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    {this.state.TransMode == 0 &&
                        <div className="form-group">
                            <label className="mandatory">Transaction ID</label>
                            <input ref={function (node) { this.TransactionId = node; }.bind(this)}
                                type="text" className="form-control" placeholder="Transaction ID" onChange={this.inputChange} />
                        </div>
                    }
                    <div className="form-group">
                        <label>Remark</label>
                        <input ref={function (node) { this.Remark = node; }.bind(this)}
                            type="text" className="form-control" placeholder="Remark" />
                    </div>
                    {this.state.TransMode == 0 &&
                        <div className="form-group">
                            <label>Payment Screenshot</label>
                            <input ref={function (node) { this.FileInput = node; }.bind(this)}
                                type="file" className="btn btn-primary form-control" onChange={this.fillFormDetailFromImage}></input>
                        </div>
                    }
                </div>
                <AddEditFooter AllowClear={false} Save={this.save} NotValidInput={this.state.NotValidInput} />
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(item){
        _Main.EAccountHome.hideAll();
        this.updateEntity(item);
        this.show();
    },
    clear: function(){
        this.setState({NotValidInput: false, Account: {AccountName:''}});
        this.ItemName.value = "";
    },
    transModeChange: function (e) {
        this.setState({ TransMode: e.currentTarget.value });
        setTimeout(this.inputChange, 100);
    },
    inputChange: function () {
        var transMode = this.state.TransMode;
        var notValidTransId = true;
        if (transMode && (transMode == 1 || transMode == 2)) {
            notValidTransId = false;
        } else {
            if (this.TransactionId) {
                notValidTransId = this.TransactionId.value.trim().length == 0;
            }
        }
        var notValidAmount = this.Amount.value == 0 ||
            this.Amount.value > this.state.Entity.Amount - this.state.Entity.PaidAmount;
        if (!notValidAmount && transMode == 2) {
            notValidAmount = this.Amount.value > this.getBalAdvPayment();
        }
        this.setState({
            NotValidInput: notValidAmount || notValidTransId
        });
    },
    updateEntity: function (entity) {
        this.Amount.value = 0;// entity.Amount - entity.PaidAmount;
        this.Remark.value = "";
        if (this.TransactionId) {
            this.TransactionId.value = "";
            this.FileInput.value = null;
        }
        this.setState({
            Entity: entity,
            TransMode: 0,
        });
    },
    actionOnBack: function(){
        this.props.ShowList(this.state.Entity.AccountId);
    },
    save: function () {
        let uri = 'ChargeOrder/cummulativeChargePayment';
        var transId = '';
        if (this.state.TransMode == 0) {
            transId = this.TransactionId.value;
        }
        var entity = {
            ChargePayeeDetailId: this.state.Entity.ChargePayeeDetailId,
            OrgId: _LoginAccount.OrgId,
            AccountId: this.state.Entity.AccountId,
            DrAccountId: this.state.Entity.AccountId,
            CrAccountId: this.state.Entity.ItemAccountId,
            Remark: this.Remark.value? this.Remark.value : "",
            Amount: this.Amount.value,
            TransactionId: transId,
            Status: 0,
            RefType: 0,
            RefId: _LoginAccount.AdvPaySummary.AdvChargeId,
            TransMode: this.state.TransMode,
            ChargePayeeDetailIds: this.state.Entity.ChargePayeeDetailIds,
        }
        if (this.state.TransMode == 2) {
            entity.RefType = 1;
            entity.RefId = _LoginAccount.AdvPaySummary.AdvChargeId;
        }
        _ProgressBar.IMBusy();
        axiosPost(uri, entity, function(data){
            _ProgressBar.IMDone();
            if(data.IsSuccess){
                this.props.ShowList(this.state.Entity.AccountId);           
            } else {
                _Alert.showWarning(data.Error, 5000);
            }
        }.bind(this));
    },
    fillFormDetailFromImage: function (e) {
        const fileInput = e.target;// document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (!file) {
            return;
        }
        
        var formData = new FormData();
        formData.append('file', file);

        _ProgressBar.IMBusy();
        ajaxPost('LoadFile/LoadImage', formData, function(data){
            _ProgressBar.IMDone();
            if(data.IsSuccess){
                //this.Amount.value = data.Data.Amount;
                this.TransactionId.value = data.Data.TransactionId;
                this.Remark.value = data.Data.Remark;
                this.inputChange();                
            }
        }.bind(this));
    },
    getBalAdvPayment: function () {
        let balAdvPay = 0;
        if (_LoginAccount.AdvPaySummary) {
            balAdvPay = _LoginAccount.AdvPaySummary.Amount - _LoginAccount.AdvPaySummary.SettleAmount;
        }
        return balAdvPay;
    },
});