var MemberAccountList = React.createClass({
    displayName: "MemberAccountList",

    getInitialState: function () {
        return {
            Filter: "",
            Items: []
        };
    },
    render: function () {
        var showNextComponent = this.state.ShowNextComponent ? this.state.ShowNextComponent : this.props.ShowNextComponent;
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Account Trans Tokens" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ListFilter, { FilterChange: this.filterChange }),
                this.getList()
            )
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
        ajaxGet('account/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    getList: function () {
        var srNo = 0;
        return this.state.Items.map(function (account) {
            if (account.Active && account.AccountType == 1) {
                if (account.AccountName.toLowerCase().indexOf(this.state.Filter.toLowerCase()) > -1 || this.state.Filter == "") {
                    srNo += 1;
                    return this.getListRow(account, srNo);
                }
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
    getListRow: function (account, srNo) {
        return React.createElement(AccountTransTokenRow, { key: account.AccountId,
            AddNavigEntity: this.props.AddNavigEntity,
            ToggleAccountTrans: this.props.ToggleAccountTrans,
            OperMode: this.props.OperMode,
            SelAll: this.state.SelAll,
            UnselectSelAll: this.unselectSelAll,
            Account: account,
            ActionOnItemSelect: this.actionOnItemSelect,
            Selected: account.Selected,
            SrNo: srNo });
    }
});