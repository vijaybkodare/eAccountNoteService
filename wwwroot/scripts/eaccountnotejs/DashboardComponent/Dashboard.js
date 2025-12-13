var Dashboard = React.createClass({
    displayName: "Dashboard",

    getInitialState: function () {
        return {
            ActiveTab: 0
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(
                "div",
                { className: "panel-heading", style: { position: "relative", height: 40 } },
                React.createElement(
                    "span",
                    { style: { position: "absolute", top: 8, right: 10 } },
                    React.createElement("span", { className: "glyphicon glyphicon-th" }),
                    React.createElement(
                        "span",
                        { className: "urlTitle" },
                        _LoginAccount.OrgName
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "ul",
                    { className: "nav nav-tabs" },
                    React.createElement(
                        "li",
                        { className: this.state.ActiveTab == 0 ? "active" : "deactive" },
                        React.createElement(
                            "a",
                            { href: "#", onClick: this.activateTab0 },
                            "Dashboard"
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: this.state.ActiveTab == 1 ? "active" : "deactive" },
                        React.createElement(
                            "a",
                            { href: "#", onClick: this.activateTab1 },
                            "Entries"
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: this.state.ActiveTab == 2 ? "active" : "deactive" },
                        React.createElement(
                            "a",
                            { href: "#", onClick: this.activateTab2 },
                            "Reports"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { ref: function (node) {
                            this.Dashboard = node;
                        }.bind(this) },
                    React.createElement(AccountSummary, { ref: function (node) {
                            this.AccountSummary = node;
                        }.bind(this) }),
                    React.createElement("hr", null),
                    React.createElement(ReportCommand, { ShowDownload: false, ShowReportFilter: this.showReportFilter }),
                    React.createElement("hr", null),
                    React.createElement(IncomeExpChart, { ref: function (node) {
                            this.IncomeExpChart = node;
                        }.bind(this),
                        ShowReportFilter: this.props.ShowReportFilter,
                        ShowNextComponent: this.props.ShowNextComponent }),
                    React.createElement("hr", null),
                    React.createElement(MonthwiseIncExpChart, { ref: function (node) {
                            this.MonthwiseIncExpChart = node;
                        }.bind(this),
                        ShowReportFilter: this.props.ShowReportFilter,
                        ShowNextComponent: this.props.ShowNextComponent }),
                    React.createElement("hr", null),
                    React.createElement(PayChargeList, { ref: function (node) {
                            this.PayChargeList = node;
                        }.bind(this),
                        HideListHeader: true,
                        ShowNextComponent: accountId => this.PayAccountList.showMe(accountId),
                        ShowAdd: item => _Main.EAccountHome.AddChargePayment.showMe(item) }),
                    React.createElement("hr", null),
                    React.createElement(
                        "div",
                        { className: "text-center" },
                        React.createElement(
                            "span",
                            { className: "label label-primary glyphiconBtn", onClick: this.showTransactions },
                            "Transactions"
                        ),
                        "\xA0",
                        React.createElement(
                            "span",
                            { className: "label label-primary glyphiconBtn", onClick: this.showChargeItems },
                            "Charge Items"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { ref: function (node) {
                            this.Entries = node;
                        }.bind(this) },
                    React.createElement(GroupHeader, { OnlyForAdmin: true, Title: "Organization" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "modal-window", Show: this.props.ShowEditOrg, Title: "Org Profile" }),
                    React.createElement(DashboardItem, { OnlyForSuperAdmin: true, Icon: "tree-deciduous", Show: this.props.ShowOrgList, Title: "Organization" }),
                    React.createElement(GroupHeader, { Title: "User" }),
                    React.createElement(DashboardItem, { Icon: "modal-window", Show: this.props.ShowUserProfile, Title: "Profile" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "user", Show: this.props.ShowUserList, Title: "Users" }),
                    React.createElement(DashboardItem, { Icon: "asterisk", Show: this.props.ShowChangePassword, Title: "Password" }),
                    React.createElement(GroupHeader, { OnlyForAdmin: true, Title: "Masters" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "king", Show: this.props.ShowAccountList, Title: "Accounts" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "bishop", Show: this.props.ShowItemList, Title: "Items" }),
                    React.createElement(GroupHeader, { Title: "Charges" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "queen", Show: this.props.ShowChargeList, Title: "Charge Order" }),
                    React.createElement(DashboardItem, { Icon: "piggy-bank", Show: this.props.ShowPayAccountList, Title: "Pay Charges" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "grain", Show: this.props.ShowAdvChargeList, Title: "Advance Pay" }),
                    _LoginAccount.AccountId > 0 && React.createElement(DashboardItem, { Icon: "asterisk", Show: this.props.ShowAddAdvMonthlyMaintainance, Title: "Advance Maintainance Pay" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "thumbs-up", Show: this.props.ShowDonationList, Title: "Donation" }),
                    React.createElement(GroupHeader, { OnlyForAdmin: true, Title: "Bill" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "knight", Show: this.props.ShowBillList, Title: "Bills" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "star", Show: this.props.ShowPayBillList, Title: "Pay Bills" }),
                    React.createElement(GroupHeader, { OnlyForAdmin: true, Title: "Reject Transactions" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "remove", Show: this.props.ShowRevertChargeTransList, Title: "Reject Charge Pay" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "remove", Show: this.props.ShowRevertAdvChargeTransList, Title: "Reject Advance Pay" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "remove", Show: this.props.ShowRevertCummChargeTransList, Title: "Reject Cummulative Pay" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "remove", Show: this.props.ShowRevertBillTransList, Title: "Reject Bill Pay" }),
                    React.createElement(GroupHeader, { OnlyForAdmin: true, Title: "Other" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "adjust", Show: this.props.ShowJVList, Title: "JV" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "briefcase", Show: this.props.ShowBankStatementList, Title: "Bank Statement" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "cog", Show: this.props.ShowReconciliation, Title: "Reconciliation" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "tags", Show: this.props.ShowTransTokenAccountList, Title: "Account Trans Token" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "cog", Show: this.props.ShowTransMapper, Title: "Trans Mapper" })
                ),
                React.createElement(
                    "div",
                    { ref: function (node) {
                            this.Reports = node;
                        }.bind(this) },
                    React.createElement(GroupHeader, { Title: "Account" }),
                    React.createElement(DashboardItem, { Icon: "asterisk", Show: this.props.ShowAccountRep, Title: "Accounts" }),
                    React.createElement(DashboardItem, { Icon: "asterisk", Show: this.props.ShowAccountExpRep, Title: "Account Exp." }),
                    React.createElement(GroupHeader, { Title: "Charges" }),
                    React.createElement(DashboardItem, { Icon: "queen", Show: this.props.ShowChargeOrderRep, Title: "Charge Orders" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "queen", Show: this.props.ShowChargeTransRep, Title: "Edit Trans #" }),
                    React.createElement(DashboardItem, { Icon: "briefcase", Show: this.props.ShowReconciliationRep, Title: "Transactions" }),
                    React.createElement(DashboardItem, { Icon: "queen", Show: this.props.ShowChargePayeeItemRep, Title: "Charge Payee Items" }),
                    React.createElement(GroupHeader, { Title: "Bill" }),
                    React.createElement(DashboardItem, { Icon: "knight", Show: this.props.ShowBillOrderRep, Title: "Bill Report" }),
                    React.createElement(GroupHeader, { OnlyForAdmin: true, Title: "Other" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "briefcase", Show: this.props.ShowBankStatementRep2, Title: "Bank Statements" }),
                    React.createElement(DashboardItem, { OnlyForAdmin: true, Icon: "cog", Show: this.props.ShowReconciliationRep, Title: "Reconciliation Report" })
                )
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
        this.activateTab0();
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.show();
        this.refreshChart(item);
        this.loadPayChargeList();
    },
    customShow: function () {
        this.setState({});
    },
    showReportFilter: function () {
        this.props.ShowReportFilter(this.props.ShowNextComponent, 1);
    },
    loadPayChargeList: function () {
        var urlParams = "?profileId=" + _LoginAccount.ProfileId;
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/PayAccounts' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.length == 1) {
                _LoginAccount.AccountId = data[0].AccountId;
                _LoginAccount.AccountName = data[0].AccountName;
                this.PayChargeList.showMe(data[0].AccountId);
            }
        }.bind(this));
    },
    refreshChart: function (filter) {
        if (!filter || typeof filter.FromDate == "undefined") {
            filter = { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime() };
        }
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        _ProgressBar.IMBusy();
        ajaxGet('Report/summaryData' + urlParams, function (data) {
            _ProgressBar.IMDone();
            //this.PieChart.updateEntity(data.Data, filter);
            this.IncomeExpChart.updateEntity(data.Data, filter);
            this.MonthwiseIncExpChart.updateEntity(data.Data.PeriodIncomeExpenses, filter);
            this.AccountSummary.updateEntity(data.Data);
        }.bind(this));
    },
    activateTab0: function () {
        this.setState({ ActiveTab: 0 });
        this.Dashboard.style.display = "block";
        this.Entries.style.display = "none";
        this.Reports.style.display = "none";
    },
    activateTab1: function () {
        this.setState({ ActiveTab: 1 });
        this.Dashboard.style.display = "none";
        this.Entries.style.display = "block";
        this.Reports.style.display = "none";
    },
    activateTab2: function () {
        this.setState({ ActiveTab: 2 });
        this.Dashboard.style.display = "none";
        this.Entries.style.display = "none";
        this.Reports.style.display = "block";
    },
    underDev: function () {
        _Alert.showWarning("This functionality is under development. Soon will update on it.", 2000);
    },
    showTransactions: function () {
        this.props.ShowReconciliationRep();
    },
    showChargeItems: function () {
        this.props.ShowChargePayeeItemRep();
    }
});