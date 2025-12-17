var TransTokenAccountList = React.createClass({
    getInitialState: function () {
        return {
            Filter: "",
            Items: [],
        };
    },
    render: function () {
        var showNextComponent = this.state.ShowNextComponent ? this.state.ShowNextComponent : this.props.ShowNextComponent;
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Account Trans Tokens" />
                <div className="panel-body">
                    <ListFilter FilterChange={this.filterChange} />
                    {this.getList()}
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function () {
        _Main.EAccountHome.hideAll();
        this.loadList();
        this.show();
    },
    loadList: function () {
        var urlParams = "?OrgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/AutoTransEntry/getAccountListWithTokens' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function () {
        var srNo = 0;
        return this.state.Items.map(function (accountDto) {
            if (accountDto.AccountMaster.AccountName.toLowerCase().indexOf(this.state.Filter.toLowerCase()) > -1
                || this.state.Filter == "") {
                srNo += 1;
                return this.getListRow(accountDto, srNo);
            }
            
        }.bind(this));
    },
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    },
    actionOnItemSelect: function (item) {
       this.props.ShowAdd(item, 1);
    },
    getListRow: function (accountDto, srNo) {
        return (
            <AccountTransTokenRow key={accountDto.AccountMaster.AccountId}
                AddNavigEntity={this.props.AddNavigEntity}
                ToggleAccountTrans={this.props.ToggleAccountTrans}
                OperMode={this.props.OperMode}
                SelAll={this.state.SelAll}
                UnselectSelAll={this.unselectSelAll}
                AccountDto={accountDto}
                ActionOnItemSelect={this.actionOnItemSelect}
                Selected={accountDto.Selected}
                SrNo={srNo} />
        );
    },
});