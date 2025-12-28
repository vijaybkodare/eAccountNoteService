var AddTransToken = React.createClass({
    getInitialState: function () {
        return {
            Items: [],
            TokenTypes: [],
            TokenWeight: 0,
            TokenValue: "",
            TokenTypeId: 1,
            NotValidInput: true,
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)}
                className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowList} Title={"Account Trans Token: " + this.AccountName} />
                <div className="panel-body">
                    {this.getList()}
                    <form>
                        <div className="form-group">
                            <label>Token Type</label>
                            <div className="row">
                                <div className="col-xs-8" style={{ paddingRight: "0px" }}>
                                    <select ref={function (node) { this.TokenTypes = node; }.bind(this)} className="form-control" onChange={this.actionOnTokenTypeChange}
                                        style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}>
                                        {
                                            this.state.TokenTypes.map((item, index) => <option key={index} value={item.TokenTypeId}>{item.TokenName}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-xs-6" style={{ paddingRight: "0px" }}>
                                    <label className="mandatory">Value</label>
                                    <input ref={function (node) { this.TokenValue = node; }.bind(this)} value={this.state.TokenValue}
                                        type="text" className="form-control" onChange={this.inputChange} />
                                </div>
                                <div className="col-xs-6">
                                    <label className="mandatory">Weight</label>
                                    <input ref={function (node) { this.TokenWeight = node; }.bind(this)} value={this.state.TokenWeight}
                                        type="number" className="form-control" onChange={this.inputChange} />
                                </div>
                            </div>
                            
                        </div>
                    </form>
                </div>
                <AddEditFooter AllowDelete={false} Clear={this.clear} Save={this.save} NotValidInput={this.state.NotValidInput} />
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (account) {
        this.AccountId = account.AccountId;
        this.AccountName = account.AccountName;
        _Main.EAccountHome.hideAll();
        this.show();
        this.loadTokenTypes();
        this.loadTokens();
    },
    clear: function () {
        this.refs.UserAccount.checked = true;
        this.setState({ AccountType: "1" });
        this.AccountName.value = "";
    },
    inputChange: function () {
        this.setState({
            TokenWeight: this.TokenWeight.value,
            TokenValue: this.TokenValue.value,
            NotValidInput: this.TokenValue.value.length == 0 || this.TokenWeight.value == 0
        });
    },
    actionOnTokenTypeChange: function (e) {
        this.tokenTypeChange(e.currentTarget.value);
    },
    tokenTypeChange: function (tokenTypeId) {
        let tokenType = this.state.TokenTypes.filter(item => item.TokenTypeId == tokenTypeId)[0];
        this.setState({
            TokenTypeId: tokenTypeId,
            TokenWeight: tokenType.TokenWeight,
            TokenValue: tokenType.TokenValue
        });
    },
    loadTokenTypes: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/AutoTransEntry/getTransTokenTypes' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                TokenTypes: data,
            });
            setTimeout(function () { this.tokenTypeChange(data[0].TokenTypeId); }.bind(this), 100);
        }.bind(this));
    },
    loadTokens: function () {
        var urlParams = "?accountId=" + this.AccountId;
        _ProgressBar.IMBusy();
        ajaxGet('api/AutoTransEntry/getTransTokens' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    save: function () {
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&accountId=" + this.AccountId;
        urlParams += "&tokenTypeId=" + this.state.TokenTypeId;
        urlParams += "&tokenValue=" + this.state.TokenValue;
        urlParams += "&tokenWeight=" + this.state.TokenWeight;
        _ProgressBar.IMBusy();
        ajaxPost('api/AutoTransEntry/addTransToken' + urlParams, null, function (data) {
            _ProgressBar.IMDone();
            if (data) {
                this.loadTokens();
            } else {
                _Alert.showWarning("Error", 2000);
            }
        }.bind(this));
    },
    delete: function (entity) {
        var urlParams = "?accountId=" + entity.AccountId;
        urlParams += "&tokenTypeId=" + entity.TokenTypeId;
        _ProgressBar.IMBusy();
        ajaxPost('api/AutoTransEntry/delTransToken' + urlParams, null, function (data) {
            _ProgressBar.IMDone();
            if (data) {
                this.loadTokens();
            } else {
                _Alert.showWarning("Entity can't be deleted.", 2000);
            }

        }.bind(this));
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            return this.getListRow(item);
        }.bind(this));
    },
    getListRow: function (item) {
        return (
            <TransTokenRow key={item.AccountId + item.TokenValue + item.TokenTypeId}
                Entity={item} 
                ActionOnItemDelete={this.delete}
                />
        );
    },
    
});