var Dashboard = React.createClass({
    getInitialState: function () {
        return{
            ActiveTab: 0,
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <div className="panel-heading" style={{ position: "relative", height: 40 }}>
                    <span style={{ position: "absolute", top: 8, right: 10 }}>
                        <span className="glyphicon glyphicon-th" />
                        <span className="urlTitle" >{_LoginAccount.OrgName}</span>
                    </span>
                </div>
                <div className="panel-body">
                    <ul className="nav nav-tabs">
                        <li className={this.state.ActiveTab == 0 ? "active" : "deactive"}>
                            <a href="#" onClick={this.activateTab0}>Dashboard</a></li>
                        <li className={this.state.ActiveTab == 1 ? "active" : "deactive"}>
                            <a href="#" onClick={this.activateTab1}>Entries</a></li>
                        <li className={this.state.ActiveTab == 2 ? "active" : "deactive"}>
                            <a href="#" onClick={this.activateTab2}>Reports</a></li>
                    </ul>
                    <div ref={function (node) { this.Dashboard = node; }.bind(this)} >
                        <AccountSummary ref={function (node) { this.AccountSummary = node; }.bind(this)} />
                        <hr />
                        <ReportCommand ShowDownload={false} ShowReportFilter={this.showReportFilter} />
                        <hr />
                        {/*<PieChart ref={function (node) { this.PieChart = node; }.bind(this)}*/}
                        {/*    ShowReportFilter={this.props.ShowReportFilter}*/}
                        {/*    ShowNextComponent={this.props.ShowNextComponent} />*/}
                        {/*<hr />*/}
                        <IncomeExpChart ref={function (node) { this.IncomeExpChart = node; }.bind(this)}
                            ShowReportFilter={this.props.ShowReportFilter}
                            ShowNextComponent={this.props.ShowNextComponent} />
                        <hr />
                        <MonthwiseIncExpChart ref={function (node) { this.MonthwiseIncExpChart = node; }.bind(this)}
                            ShowReportFilter={this.props.ShowReportFilter}
                            ShowNextComponent={this.props.ShowNextComponent} />
                        <hr />
                        <PayChargeList ref={function (node) { this.PayChargeList = node; }.bind(this)}
                            HideListHeader={true}
                            ShowNextComponent={(accountId) => this.PayAccountList.showMe(accountId)}
                            ShowAdd={(item) => _Main.EAccountHome.AddChargePayment.showMe(item)} />
                        <hr />
                        <div className="text-center">
                            <span className="label label-primary glyphiconBtn" onClick={this.showTransactions}>Transactions</span>&nbsp;
                            <span className="label label-primary glyphiconBtn" onClick={this.showChargeItems}>Charge Items</span>
                        </div>
                    </div>
                    
                    <div ref={function (node) { this.Entries = node; }.bind(this)} >
                        <GroupHeader OnlyForAdmin={true} Title="Organization" />
                        <DashboardItem OnlyForAdmin={true} Icon="modal-window" Show={this.props.ShowEditOrg} Title="Org Profile" />
                        <DashboardItem OnlyForSuperAdmin={true} Icon="tree-deciduous" Show={this.props.ShowOrgList} Title="Organization" />
                        <GroupHeader Title="User"/>
                        <DashboardItem Icon="modal-window" Show={this.props.ShowUserProfile} Title="Profile" />
                        <DashboardItem OnlyForAdmin={true} Icon="user" Show={this.props.ShowUserList} Title="Users" />
                        <DashboardItem Icon="asterisk" Show={this.props.ShowChangePassword} Title="Password" />
                        <GroupHeader OnlyForAdmin={true} Title="Masters"/>
                        <DashboardItem OnlyForAdmin={true} Icon="king" Show={this.props.ShowAccountList} Title="Accounts" />
                        <DashboardItem OnlyForAdmin={true} Icon="bishop" Show={this.props.ShowItemList} Title="Items" />
                        <GroupHeader Title="Charges"/>
                        <DashboardItem OnlyForAdmin={true} Icon="queen" Show={this.props.ShowChargeList} Title="Charge Order" />
                        <DashboardItem Icon="piggy-bank" Show={this.props.ShowPayAccountList} Title="Pay Charges" />
                        <DashboardItem OnlyForAdmin={true} Icon="grain" Show={this.props.ShowAdvChargeList} Title="Advance Pay" />
                        {_LoginAccount.AccountId > 0 && <DashboardItem Icon="asterisk" Show={this.props.ShowAddAdvMonthlyMaintainance} Title="Advance Maintainance Pay" />}
                        <DashboardItem OnlyForAdmin={true} Icon="thumbs-up" Show={this.props.ShowDonationList} Title="Donation" />
                        <GroupHeader OnlyForAdmin={true} Title="Bill" />
                        <DashboardItem OnlyForAdmin={true} Icon="knight" Show={this.props.ShowBillList} Title="Bills" />
                        <DashboardItem OnlyForAdmin={true} Icon="star" Show={this.props.ShowPayBillList} Title="Pay Bills" />
                        <GroupHeader OnlyForAdmin={true} Title="Reject Transactions"/>
                        <DashboardItem OnlyForAdmin={true} Icon="remove" Show={this.props.ShowRevertChargeTransList} Title="Reject Charge Pay" />
                        <DashboardItem OnlyForAdmin={true} Icon="remove" Show={this.props.ShowRevertAdvChargeTransList} Title="Reject Advance Pay" />
                        <DashboardItem OnlyForAdmin={true} Icon="remove" Show={this.props.ShowRevertCummChargeTransList} Title="Reject Cummulative Pay" />
                        <DashboardItem OnlyForAdmin={true} Icon="remove" Show={this.props.ShowRevertBillTransList} Title="Reject Bill Pay" />
                        <GroupHeader OnlyForAdmin={true} Title="Other"/>
                        <DashboardItem OnlyForAdmin={true} Icon="adjust" Show={this.props.ShowJVList} Title="JV" />
                        <DashboardItem OnlyForAdmin={true} Icon="briefcase" Show={this.props.ShowBankStatementList} Title="Bank Statement" />
                        <DashboardItem OnlyForAdmin={true} Icon="cog" Show={this.props.ShowReconciliation} Title="Reconciliation" />
                        {/*{_LoginAccount.RoleId == 1 && <DashboardItem OnlyForAdmin={true} OnlyForAdmin={true} Icon="briefcase" Show={this.props.ShowAutoTransEntry} Title="ML Trans Entry " />}*/}
                        <DashboardItem OnlyForAdmin={true} Icon="tags" Show={this.props.ShowTransTokenAccountList} Title="Account Token" />
                        <DashboardItem OnlyForAdmin={true} Icon="cog" Show={this.props.ShowTransMapper} Title="Charge-Trans Mapper" />
                        <DashboardItem OnlyForAdmin={true} Icon="cog" Show={this.props.ShowBillTransMapper} Title="Bill-Trans Mapper" />
                    </div>
                    <div ref={function (node) { this.Reports = node; }.bind(this)} >
                        <GroupHeader Title="Account"/>
                        <DashboardItem Icon="asterisk" Show={this.props.ShowAccountRep} Title="Accounts" />
                        <DashboardItem Icon="asterisk" Show={this.props.ShowAccountExpRep} Title="Account Exp." />
                        <GroupHeader Title="Charges"/>
                        <DashboardItem Icon="queen" Show={this.props.ShowChargeOrderRep} Title="Charge Orders" />
                        <DashboardItem OnlyForAdmin={true} Icon="queen" Show={this.props.ShowChargeTransRep} Title="Edit Trans #" />
                        <DashboardItem Icon="briefcase" Show={this.props.ShowReconciliationRep} Title="Transactions" />
                        <DashboardItem Icon="queen" Show={this.props.ShowChargePayeeItemRep} Title="Charge Payee Items" />
                        <GroupHeader Title="Bill"/>
                        <DashboardItem Icon="knight" Show={this.props.ShowBillOrderRep} Title="Bill Report" />
                        <DashboardItem Icon="knight" Show={this.props.ShowBillTransRep} Title="Bill Trans Report" />
                        <GroupHeader OnlyForAdmin={true} Title="Other" />
                        <DashboardItem OnlyForAdmin={true} Icon="briefcase" Show={this.props.ShowBankStatementRep2} Title="Bank Statements" />
                        <DashboardItem OnlyForAdmin={true} Icon="cog" Show={this.props.ShowReconciliationRep} Title="Reconciliation Report" />
                        {/*{_LoginAccount.RoleId == 1 && <GroupHeader Title="Reconciliation" />}*/}
                        {/*{_LoginAccount.RoleId == 1 && <DashboardItem Icon="briefcase" Show={this.props.ShowBankStatementRep} Title="Bank Statement Report" />}*/}
                        {/*{_LoginAccount.RoleId == 1 && <DashboardItem Icon="briefcase" Show={this.props.ShowAutoTransEntryRep} Title="Auto Trans Entry Report" />}*/}
                    </div>
                </div>
            </div>
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
    customShow: function(){
        this.setState({});
    },
    showReportFilter: function(){
        this.props.ShowReportFilter(this.props.ShowNextComponent, 1);
    },
    loadPayChargeList: function(){
        var urlParams = "?profileId=" + _LoginAccount.ProfileId;
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/PayAccounts' + urlParams,function(data){
            _ProgressBar.IMDone();
            if (data.length == 1) {
                _LoginAccount.AccountId = data[0].AccountId;
                _LoginAccount.AccountName = data[0].AccountName;
                this.PayChargeList.showMe(data[0].AccountId);
            }
        }.bind(this));
    },
    refreshChart: function (filter) {
        if(!filter || typeof(filter.FromDate) == "undefined"){
            filter = {FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime()};
        }
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        _ProgressBar.IMBusy();
        ajaxGet('Report/summaryData' + urlParams,function(data){
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
    },
});