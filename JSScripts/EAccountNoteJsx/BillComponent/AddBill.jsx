var AddBill = React.createClass({
    getInitialState: function () {
        return {
            AllowEdit: true,
            NotValidInput: true,
            Item: {ItemId: -1, ItemName:'', AccountId:-1, AccountName:''},
            BankAccount: {AccountId: -1, AccountName:''},
            Entity: {BillOrderId: -1, ItemId:-1, AccountId:-1, BankAccountId:-1, Amount:0, PaidAmount:0},
        };
    },
    render: function() {
        return (
            <div ref={function(node){this.Component = node;}.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowList} Title="Add/Edit Bill"/>
                <div className="panel-body">
                    <form>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label className="mandatory">Bill No.</label>
                                    <input ref={function (node) { this.OrderNo = node; }.bind(this)} readOnly={true}
                                        type="text" className="form-control" placeholder="Order No." />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label className="mandatory">Date</label>
                                    <input ref={function (node) { this.Date = node; }.bind(this)} readOnly={true}
                                        type="text" className="form-control" placeholder="Date" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="mandatory">Item</label>
                            <ItemSelect ItemText={this.state.Item.ItemName} ItemChange={this.inputChange} GoForItemSelect={this.goForItemSelect}/>
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Amount Credit To</label>
                            <input ref={function (node) { this.Account = node; }.bind(this)} readOnly={true}
                                type="text" value={this.state.Item.AccountName} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Amount Debited From</label>
                            <ItemSelect ItemText={this.state.BankAccount.AccountName} ItemChange={this.inputChange} GoForItemSelect={this.goForBankAccountSelect}/>
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Remark</label>
                            <input ref={function(node){this.Remark = node;}.bind(this)} 
                                type="text" className="form-control" placeholder="Remark" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Amount</label>
                            <input ref={function(node){this.Amount = node;}.bind(this)} style={{ textAlign: 'right' }}
                                type="number" className="form-control" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label>Upload Bill</label>
                            <div className="alert alert-info alert2 fontSizeSr">
                                <ul className="ulList">
                                    <li>File size must be less than 1 MB</li>
                                </ul>
                            </div>
                            <div className="input-group">
                                <input ref={function (node) { this.FileInput = node; }.bind(this)}
                                    type="file" className="btn btn-primary form-control"></input>
                                <span className="input-group-addon">
                                    {
                                        this.state.Entity.BillOrderId > -1 &&
                                        <span className="glyphicon glyphicon-ok paddingR5" style={{ color: "green" }} onClick={this.saveBillFile} aria-hidden="true" />
                                    }
                                </span>
                            </div>
                            
                        </div>
                        
                    </form>
                </div>
                {this.state.AllowEdit &&
                    <AddEditFooter Clear={this.clear} Save={this.save} NotValidInput={this.state.NotValidInput} />
                }
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.show();
        if(itemType == 0 || itemType == 1) {
            this.updateEntity(item);
        }
        if(itemType == 22){
            this.updateItem(item);
        }
        if(itemType == 12){
            this.updateBankAccount(item);
        } 
    },
    clear: function(){
        this.setState({NotValidInput: false, Account: {AccountName:''}});
        this.ItemName.value = "";
    },
    inputChange: function () {
        this.setState({ NotValidInput:  this.isValidInput(this.state.Item, this.state.BankAccount)});
    },
    isValidInput: function (item, account) {
        return this.Remark.value == "" || this.Amount.value == 0 || item.ItemName == "" || account.AccountName == "";
    },
    goForItemSelect: function (e) {
        this.props.ShowItemList(true, this.props.ShowAddBill, false);
    },
    goForBankAccountSelect: function (e) {
        this.props.ShowBankAccountList(true, this.props.ShowAddBill, false);
    },
    updateItem: function (item) {
        this.setState({
            Item: item,
            NotValidInput: this.isValidInput(item, this.state.BankAccount)
        });
    },
    updateBankAccount: function (item) {
        this.setState({
            BankAccount: item,
            NotValidInput: this.isValidInput(this.state.Item, item)
        });
    },
    updateEntity: function (entity) {
        if(entity == null || typeof(entity) == "undefined" || typeof(entity.BillOrderId) == "undefined"){
            entity = {BillOrderId: -1, ItemId:-1, AccountId:-1, BankAccountId:-1, Amount:0, PaidAmount:0};
        }
        this.getRecord(entity);
    },
    save: function () {
        var dataToPost = new FormData();
        var entity = {
            BillOrderId: this.state.Entity.BillOrderId,
            OrgId: _LoginAccount.OrgId,
            ItemId: this.state.Item.ItemId,
            AccountId: this.state.Item.AccountId,
            BankAccountId: this.state.BankAccount.AccountId, 
            Remark: this.Remark.value,
            Amount: this.Amount.value,
            //AccessKey: _LoginAccount.AccessKey,
        }
        appendObjectToFormData(entity, dataToPost, "");
        if (isValidFile(this.FileInput)) {
            dataToPost.append('file', this.FileInput.files[0]);
        }
        _ProgressBar.IMBusy();
        axiosPost('BillOrder/save', dataToPost, function(data){
            _ProgressBar.IMDone();
            if(data.IsSuccess){
                this.props.ShowList();           
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
    getRecord: function (entity) {
        var urlParams = "?billOrderId=" + entity.BillOrderId + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('BillOrder/entity' + urlParams, function(data){
            _ProgressBar.IMDone();
            this.OrderNo.value = data.Data.BillNo;
            this.Date.value = getFormattedDate(data.Data.BillDt);
            this.Amount.value = data.Data.Amount;
            this.Remark.value = data.Data.Remark;
            if (entity.BillOrderId == -1) {
                this.setState({
                    AllowEdit: true,
                    Entity: data.Data,
                    NotValidInput: true,
                    Item: {ItemId: -1, ItemName:''},
                    BankAccount: {AccountId: -1, AccountName:''},
                });    
            } else {
                this.setState({
                    AllowEdit: data.Data.PaidAmount == 0,
                    Entity: data.Data,
                    NotValidInput: false,
                    Item: {ItemId: data.Data.ItemId, ItemName: data.Data.ItemName, AccountId: data.Data.AccountId, AccountName: data.Data.AccountName},
                    BankAccount: {AccountId: data.Data.BankAccountId, AccountName: data.Data.BankAccount},
                    Accounts: data.Data.ChargePayeeDetails,
                });
            }
        }.bind(this));
    },
    saveBillFile: function () {
        if (this.state.Entity.BillOrderId == -1 || !isValidFile(this.FileInput)) {
            return;
        }
        var formData = new FormData();
        formData.append('file', this.FileInput.files[0]);
        var urlParams = "?billOrderId=" + this.state.Entity.BillOrderId + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxPost('BillOrder/saveBillFile' + urlParams, formData, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            }
        }.bind(this));
    },
});