var BillTransMapper = React.createClass({
    getInitialState: function () {
        return {
            BankStatements: [],
            BillTransactions: [],
            SelBill: {},
            SelBank: {},
            Filter: "",
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowNext} Title="Bill Transaction Mapper" />
                <div className="panel-body">
                    <div className="row">
                        <div className="col-sm-4">
                            <DateSelector Label="From Date" ref={function (node) { this.FromDt = node; }.bind(this)} />
                        </div>
                        <div className="col-sm-4">
                            <DateSelector Label="To Date" ref={function (node) { this.ToDt = node; }.bind(this)} />
                        </div>
                        <div className="col-sm-4 textAlignC" style={{ paddingRight: "0px", marginTop: "25px" }}>
                            <button type="button" className="btn btn-primary" onClick={this.getBillTransMapping}>Get Bill Trans Mapping</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 textAlignC" style={{ borderRightStyle: "solid" }}>
                            Bank Statements Transactions
                        </div>
                        <div className="col-sm-6 textAlignC" style={{ borderLeftStyle: "solid" }}>
                            WCPF Bill Transactions
                        </div>
                    </div>
                    {
                        -this.state.SelBank.Amount == this.state.SelBill.Amount?
                            <div className="row">
                                <div className="col-sm-12 textAlignC">
                                    <button type="button" className="btn btn-success" onClick={this.mapBillTrans}>Save Trans Mapping</button>
                                </div>
                            </div>
                            :
                            <div className="row">
                                <div className="col-sm-4"></div>
                                <div className="col-sm-4 textAlignC">
                                    <input ref={function (node) { this.TxtAmount = node; }.bind(this)}
                                        type="number" className="form-control" placeholder="Search by Amount" onChange={this.searchChange} />
                                </div>
                            </div>
                    }
                    <div className="row">
                        <div className="col-sm-6" style={{ borderRightStyle: "solid" }}>
                            {this.loadBankStatements()}  
                        </div>
                        <div className="col-sm-6" style={{ borderLeftStyle: "solid" }}>
                            {this.loadBillTransactions()}  
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function () {
        _Main.EAccountHome.hideAll();
        this.show();
    },
    searchChange: function () {
        this.setState({ Filter: this.TxtAmount.value });
    },
    getBankStatements: function () {
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxGet('api/BillTransMap/bankstatements' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                BankStatements: data,
            });
        }.bind(this));
    },
    getBillTransactions: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + this.FromDt.getValue();
        urlParams += "&toDate=" + this.ToDt.getValue() + " 23:59:59";
        _ProgressBar.IMBusy();
        ajaxGet('api/BillTransMap/billtransactions' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                BillTransactions: data,
            });
        }.bind(this));
    },
    getBillTransMapping: function () {
        this.getBankStatements();
        this.getBillTransactions();
    },
    loadBillTransMapping: function () {
        this.loadBankStatements();
        this.loadBillTransactions();
    },
    loadBillTransactions: function () {
        return this.state.BillTransactions.map(function (item) {
            if (item.Amount == parseInt(this.state.Filter) || this.state.Filter == "") {
                return (
                    <BillTransMapBillRow
                        key={item.BillPayTransId}
                        Item={item}
                        ActionOnItemSelect={this.actionOnBillSelect}
                    />
                );
            }
        }.bind(this));
    },
    loadBankStatements: function () {
        return this.state.BankStatements.map(function (item) {
            if (Math.abs(item.Amount) == parseInt(this.state.Filter) || this.state.Filter == "") {
                return (
                    <BillTransMapBankRow
                        key={item.BankStatementId}
                        Item={item}
                        ActionOnItemSelect={this.actionOnBankSelect}
                    />
                );
            }
        }.bind(this));
    },
    actionOnBillSelect: function (item) {
        item.Selected = !item.Selected;
        this.state.BillTransactions.forEach((itm, index) => {
            if(itm == item) return;
            itm.Selected = false;
        });
        this.setState({ SelBill: item });
    },
    actionOnBankSelect: function (item) {
        item.Selected = !item.Selected;
        this.state.BankStatements.forEach((itm, index) => {
            if (itm == item) return;
            itm.Selected = false;
        });
        this.setState({ SelBank: item });
    },
    mapBillTrans: function () {
        let dataToPost = {
            BankStatementId: this.state.SelBank.BankStatementId,
            BillPayTransId: this.state.SelBill.BillPayTransId
        };
        _ProgressBar.IMBusy();
        axiosPost('api/BillTransMap/mapbilltrans', dataToPost, function (data) {
            _ProgressBar.IMDone();
            this.setState({ SelBank: {}, SelBill: {}, Filter: "" });
            this.getBillTransMapping();  
        }.bind(this));
    },
});