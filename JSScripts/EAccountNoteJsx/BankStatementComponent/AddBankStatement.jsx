var AddBankStatement = React.createClass({
    getInitialState: function () {
        return {
            File: null,
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowList} Title="Upload Bank Statement" />
                {/*<ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Upload Bank Statement" />*/}
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label className="mandatory">Statement No.</label>
                                <input ref={function (node) { this.OrderNo = node; }.bind(this)} readOnly={true}
                                    type="text" className="form-control" placeholder="Statement No." />
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
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label className="mandatory">From Date</label>
                                <FlatPickrDate ref={function (node) { this.FromDate = node; }.bind(this)} />
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label className="mandatory">To Date</label>
                                <FlatPickrDate ref={function (node) { this.ToDate = node; }.bind(this)} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="mandatory">Remark</label>
                        <input ref={function (node) { this.Remark = node; }.bind(this)}
                            type="text" className="form-control" placeholder="Remark" onChange={this.inputChange} />
                    </div>
                    <div className="form-group">
                        <label>Select Bank Statement:</label>
                        <ul className="ulList">
                            <li>File must be in .xls or .xlsx format.</li>
                            <li>Data must be exist in 1st sheet.</li>
                            <li>1st row must be header row, containing column names: Date, Remark, Amount.</li>
                        </ul>
                        <input ref={function (node) { this.FileInput = node; }.bind(this)}
                            type="file" accept=".xls,.xlsx" className="btn btn-primary form-control" onChange={this.fileChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Worksheet name</label>
                        <input ref={function (node) { this.WorksheetName = node; }.bind(this)}
                            type="text" className="form-control" placeholder="Worksheet name" onChange={this.inputChange} />
                    </div>
                </div>

                <div className="panel-footer text-center">
                    <button type="button" className="btn btn-success" disabled={!this.state.File} onClick={this.save}>Upload</button>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.show();
        if (itemType == 0 || itemType == 1) {
            this.updateEntity(item);
        }
        if (itemType == 22) {
            this.updateItem(item);
        }
        if (itemType == 12) {
            this.updateBankAccount(item);
        }
    },
    updateEntity: function (entity) {
        if (entity == null || typeof (entity) == "undefined" || typeof (entity.BankStatementHeaderId) == "undefined") {
            entity = { BankStatementHeaderId: -1};
        }
        this.getRecord(entity);
    },
    upload: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        
        var formData = new FormData();
        formData.append('file', this.FileInput.files[0]);

        _ProgressBar.IMBusy();

        ajaxDownloadPdfPost('api/BankStatement/uploadBankStatement' + urlParams, function () {
            _ProgressBar.IMDone();
        }.bind(this), 'UnProcessedBankStatement.pdf', formData);
    },
    save: function () {
        var dataToPost = new FormData();
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&id=" + this.state.Entity.BankStatementHeaderId;
        urlParams += "&fromDate=" + this.FromDate.getValue();
        urlParams += "&toDate=" + this.ToDate.getValue();
        urlParams += "&remark=" + this.Remark.value;
        urlParams += "&worksheetName=" + this.WorksheetName.value;
        dataToPost.append('file', this.FileInput.files[0]);
        _ProgressBar.IMBusy();
        ajaxPost('api/BankStatement/save123' + urlParams, dataToPost, function (data) {
            _ProgressBar.IMDone();
            if (data) {
                this.props.ShowList();
            } else {
                _Alert.showWarning("Server side error", 2000);
            }
        }.bind(this));
    },
    fileChange: function (e) {
        const fileInput = e.target;
        const file = fileInput.files[0];
        this.setState({
            File: file
        });
    },
    getRecord: function (entity) {
        var urlParams = "?id=" + entity.BankStatementHeaderId + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/BankStatement/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.OrderNo.value = data.BankStatementNo;
            this.Date.value = getFormattedDate(data.AddedDt);
            this.Remark.value = data.Remark;
            if (entity.BankStatementHeaderId == -1) {
                this.setState({
                    AllowEdit: true,
                    Entity: data,
                    NotValidInput: true,
                });
            } else {
                this.setState({
                    AllowEdit: false,
                    Entity: data,
                    NotValidInput: true,
                });
            }
        }.bind(this));
    }
});