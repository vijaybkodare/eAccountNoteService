var Reconciliation = React.createClass({
    getInitialState: function () {
        return {
            File: null,
            NotValidInput: false,
            UseStoredBankStatement: true,
        };
    },
    counter: 0,
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Process Reconciliation" />
                <div className="panel-body">
                    <Filter ref={function (node) { this.Filter = node; }.bind(this)}
                        ShowNextComponent={this.props.ShowReconciliation}
                        ShowAccountList={this.props.ShowAccountList} />
                    <div className="checkbox" style={{ marginBottom: 10, marginTop: 0 }}>
                        <label><input ref={function (node) { this.ChkUseStoredBankStatement = node; }.bind(this)}
                            type="checkbox" checked={this.state.UseStoredBankStatement} onChange={this.chkUseStoredBankStatementChange} />Use stored Bank Statement</label>
                    </div>
                    {!this.state.UseStoredBankStatement &&
                        <div className="form-group">
                            <label>Select Transaction statement to reconcile:</label>
                            <ul className="ulList">
                                <li>File must be in .xls or .xlsx format.</li>
                                <li>Data must be exist in 1st sheet.</li>
                                <li>1st row must be header row, containing column names: Remark, Amount.</li>
                            </ul>
                            <input ref={function (node) { this.FileInput = node; }.bind(this)}
                                type="file" accept=".xls,.xlsx" className="btn btn-primary form-control" onChange={this.fileChange}></input>
                        </div>
                    }
                </div>
                
                <div className="panel-footer text-center">
                    <button type="button" className="btn btn-success" disabled={this.state.NotValidInput} onClick={this.processReconciliation}>Process Reconciliation</button>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        //this.setState({});
        this.show();
        if (itemType == 12) {
            this.Filter.updateAccount(item);
        }
    },
    processReconciliation: function () {
        let filter = this.Filter.value()
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        urlParams += "&accountId=" + filter.AccountId;
        urlParams += "&useStoredBankStatement=" + this.state.UseStoredBankStatement;

        var formData = new FormData();
        if (!this.state.UseStoredBankStatement) {
            formData.append('file', this.FileInput.files[0]);
        }
        
        _ProgressBar.IMBusy();
        
        ajaxDownloadPdfPost('api/Reconciliation/processreconciliation' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'Reconciliation.pdf', formData);
    },
    fileChange: function (e) {
        this.setState({
            NotValidInput: false
        });
    },
    chkUseStoredBankStatementChange: function (e) {
        this.setState({
            UseStoredBankStatement: e.target.checked,
            NotValidInput: !e.target.checked
        });
    },
});