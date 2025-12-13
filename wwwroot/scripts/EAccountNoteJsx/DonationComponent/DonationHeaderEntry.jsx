var DonationHeaderEntry = React.createClass({
    getInitialState: function () {
        return {
            AllowEdit: true,
            NotValidInput: true,
            Item: { ItemId: -1, ItemName: '', AccountName: '', AccountId: -1 },
            Entity: { DonationHeaderId: -1, ItemId: -1, AccountId: -1, TotalAmount: 0 },
        };
    },
    render: function () {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="form-group">
                            <label className="mandatory">Donation No.</label>
                            <input readOnly={true} type="text" value={this.props.Entity.DonationNo} className="form-control" />
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="form-group">
                            <label className="mandatory">Date</label>
                            <input readOnly={true} type="text" className="form-control" value={getFormattedDate3(this.props.Entity.DonationDt)} />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="mandatory">Item</label>
                    <ItemSelect ItemText={this.state.Item.ItemName} ItemChange={this.inputChange} GoForItemSelect={this.goForSelectItem} />
                </div>
                <div className="form-group">
                    <label className="mandatory">Amount Credit To</label>
                    <input ref={function (node) { this.Account = node; }.bind(this)} readOnly={true}
                        type="text" value={this.state.Item.AccountName} className="form-control" />
                </div>
                <div className="form-group">
                    <label className="mandatory">Remark</label>
                    <input ref={function (node) { this.Remark = node; }.bind(this)}
                        type="text" className="form-control" placeholder="Remark" onChange={this.inputChange} />
                </div>
                <AddEditFooter Clear={this.clear} Save={this.save} NotValidInput={this.state.NotValidInput} />
            </div>
        );
    },
    goForSelectItem: function (e) {
        this.props.ShowItemList(this.props.ShowAddDonation);
    },
    updateItem: function (item) {
        this.setState({
            Item: item,
            NotValidInput: item.ItemName == ""
        });
    },
    save: function () {
        var entity = {
            OrgId: _LoginAccount.OrgId,
            ItemId: this.state.Item.ItemId,
            AccountId: this.state.Item.AccountId,
            Remark: this.Remark.value,
        }
        _ProgressBar.IMBusy();
        axiosPost('api/Donation/save', entity, function (data) {
            _ProgressBar.IMDone();
            if (data) {
                this.props.ShowList();
            } else {
                _Alert.showWarning("Server side error", 2000);
            }
        }.bind(this));
    },
});