var AddDonationDetail = React.createClass({
    getInitialState: function () {
        return{
            NotValidInput: true,
            Entity: {},
            TransMode: 0,
            Account: {},
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowList} Title="Donation Entry" />
                <div className="panel-body">
                    <div className="form-group">
                        <label className="mandatory">Account</label>
                        <ItemSelect ItemText={this.state.Account.AccountName} ItemChange={this.inputChange} GoForItemSelect={this.goForSelectAccount} />
                    </div>
                    <div className="form-group">
                        <label className="mandatory">Amount</label>
                        <div className="alert alert-info alert2 fontSizeSr">
                            <ul className="ulList">
                                <li>In case of <span className="colorRed">Online Payment</span>, <span className="colorRed">Amount</span> should be match with Amount associated with Transaction ID, else it will <span className="colorRed fontWeightB">fail</span> in reconciliation.</li>
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
                                        Online Payment
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
                        <label className="mandatory">Remark</label>
                        <input ref={function (node) { this.Remark = node; }.bind(this)}
                            type="text" className="form-control" placeholder="Remark" onChange={this.inputChange} />
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
    showMe: function (item, itemType){
        _Main.EAccountHome.hideAll();
        this.show();
        if (itemType == 1) {
            this.updateEntity(item)
        }
        if (itemType == 12) {
            this.updateAccount(item)
        }
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
        var notValidAmount = this.Amount.value == 0 || this.Remark.value.trim().length == 0;
        this.setState({
            NotValidInput: notValidAmount || notValidTransId
        });
    },
    updateEntity: function (entity) {
        this.setState({
            Entity: entity,
        });
    },
    save: function () {
        let uri = 'api/Donation/addDonationDetail';
        var transId = '';
        if (this.state.TransMode == 0) {
            transId = this.TransactionId.value;
        }
        var entity = {
            OrgId: _LoginAccount.OrgId,
            DonationHeaderId: this.state.Entity.DonationHeaderId,
            DrAccountId: this.state.Account.AccountId,
            Remark: this.Remark.value,
            Amount: this.Amount.value,
            TransactionId: transId,
            Status: 0,
            RefType: 0,
            RefId: 0,
            TransMode: this.state.TransMode,
        }
        _ProgressBar.IMBusy();
        axiosPost(uri, entity, function(data){
            _ProgressBar.IMDone();
            if(data.IsSuccess){
                this.props.ShowList(this.state.Entity);           
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
    goForSelectAccount: function () {
        this.props.ShowAccountList(this.props.ShowAddDonationDetail);
    },
    updateAccount: function (account) {
        if (typeof (account.AccountId) == "undefined") {
            account = { AccountId: -1, AccountName: '' };
        }
        this.setState({
            Account: account,
            NotValidInput: account.AccountName == ""
        });
    },
});