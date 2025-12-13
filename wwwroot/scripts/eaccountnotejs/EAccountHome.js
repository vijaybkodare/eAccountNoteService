var EAccountHome = React.createClass({
    displayName: "EAccountHome",

    nodes: [],
    addNode: function (node) {
        if (node) this.nodes.push(node);
    },
    getInitialState: function () {
        return {};
    },
    render: function () {
        this.nodes = [];
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this) },
            React.createElement(Dashboard, { ref: function (node) {
                    this.Dashboard = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowItemList: (itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowPayAccountList: () => this.PayAccountList.showMe(),
                ShowUserList: () => this.UserList.showMe(),
                ShowUserProfile: () => this.UserProfile.showMe(),
                ShowChangePassword: () => this.ChangePassword.showMe(),
                ShowChargeList: () => this.ChargeList.showMe(),
                ShowBillList: () => this.BillList.showMe(),
                ShowJVList: () => this.JVList.showMe(),
                ShowPayBillList: () => this.PayBillList.showMe(),
                ShowChargeTransRep: filter => this.ChargeTransRep.showMe(filter),
                ShowAccountRep: () => this.AccountRep.showMe(),
                ShowChargeOrderRep: () => this.ChargeOrderRep.showMe(),
                ShowChargePayeeItemRep: () => this.ChargePayeeItemRep.showMe(),
                ShowBillOrderRep: () => this.BillOrderRep.showMe(),
                ShowReportFilter: (item, itemType) => this.ReportFilter2.showMe2(item, itemType),
                ShowAdvChargeList: () => this.AdvChargeList.showMe(),
                ShowAddAdvMonthlyMaintainance: () => this.AddAdvMonthlyMaintainance.showMe(),
                ShowRevertAdvChargeTransList: () => this.RevertAdvChargeTransList.showMe(),
                ShowRevertChargeTransList: () => this.RevertChargeTransList.showMe(),
                ShowRevertCummChargeTransList: () => this.RevertCummChargeTransList.showMe(),
                ShowRevertBillTransList: () => this.RevertBillTransList.showMe(),
                ShowReconciliation: (item, itemType) => this.Reconciliation.showMe(item, itemType),
                ShowReconciliationRep: filter => this.ReconciliationRep.showMe(filter),
                ShowBankStatementList: () => this.BankStatementList.showMe(),
                ShowBankStatementRep: filter => this.BankStatementRep.showMe(filter),
                ShowAutoTransEntryRep: () => this.AutoTransEntryRep.showMe(),
                ShowAutoTransEntry: () => this.AutoTransEntry.showMe(),
                ShowAccountExpRep: () => this.AccountExpRep.showMe(),
                ShowTransMapper: () => goToTrnsMapper(),
                ShowTransTokenAccountList: () => this.TransTokenAccountList.showMe(),
                ShowBankStatementRep2: () => this.BankStatementRep2.showMe(),
                ShowOrgList: () => this.OrgList.showMe(),
                ShowEditOrg: () => this.EditOrg2.showMe2(),
                ShowDonationList: (item, itemType) => this.DonationList.showMe(item, itemType)

            }),
            React.createElement(AccountList, { ref: function (node) {
                    this.AccountList = node;this.addNode(node);
                }.bind(this),
                AccountType: -1,
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddAccount.showMe(item, itemType),
                Accounts: this.state.Accounts }),
            React.createElement(AccountList, { ref: function (node) {
                    this.MemberAccountList = node;this.addNode(node);
                }.bind(this),
                AccountType: 1 }),
            React.createElement(AccountList, { ref: function (node) {
                    this.BankAccountList = node;this.addNode(node);
                }.bind(this),
                AccountType: 2 }),
            React.createElement(AccountList, { ref: function (node) {
                    this.AllAccountList = node;this.addNode(node);
                }.bind(this),
                AccountType: -1,
                ItemType: 14 }),
            React.createElement(AddAccount, { ref: function (node) {
                    this.AddAccount = node;this.addNode(node);
                }.bind(this),
                ShowList: (itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)
            }),
            React.createElement(ItemList, { ref: function (node) {
                    this.ItemList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddItem.showMe(item, itemType) }),
            React.createElement(AddItem, { ref: function (node) {
                    this.AddItem = node;this.addNode(node);
                }.bind(this),
                ToggleSelectAccount: this.showSelectAccount,
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowAddItem: (item, itemType) => this.AddItem.showMe(item, itemType),
                ShowList: (itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect) }),
            React.createElement(ChargeList, { ref: function (node) {
                    this.ChargeList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddCharge.showMe(item, itemType) }),
            React.createElement(AddCharge, { ref: function (node) {
                    this.AddCharge = node;this.addNode(node);
                }.bind(this),
                ToggleSelectAccount: this.showSelectItem,
                ShowItemList: (itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.MemberAccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowAddCharge: (item, itemType) => this.AddCharge.showMe(item, itemType),
                ShowList: () => this.ChargeList.showMe() }),
            React.createElement(PayAccountList, { ref: function (node) {
                    this.PayAccountList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowPayChargeList: accountId => this.PayChargeList.showMe(accountId),
                Items: this.state.PayAccounts }),
            React.createElement(PayChargeList, { ref: function (node) {
                    this.PayChargeList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: accountId => this.PayAccountList.showMe(accountId),
                ShowAdd: item => this.AddChargePayment.showMe(item) }),
            React.createElement(AddChargePayment, { ref: function (node) {
                    this.AddChargePayment = node;this.addNode(node);
                }.bind(this),
                ShowList: accountId => this.PayChargeList.showMe(accountId) }),
            React.createElement(UserList, { ref: function (node) {
                    this.UserList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddUser.showMe(item, itemType) }),
            React.createElement(AddUser, { ref: function (node) {
                    this.AddUser = node;this.addNode(node);
                }.bind(this),
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.MemberAccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowAddUser: (item, itemType) => this.AddUser.showMe(item, itemType),
                ShowList: () => this.UserList.showMe() }),
            React.createElement(UserProfile, { ref: function (node) {
                    this.UserProfile = node;this.addNode(node);
                }.bind(this),
                ShowList: (item, itemType) => this.Dashboard.showMe(item, itemType) }),
            React.createElement(ChangePassword, { ref: function (node) {
                    this.ChangePassword = node;this.addNode(node);
                }.bind(this),
                ShowList: (item, itemType) => this.Dashboard.showMe(item, itemType) }),
            React.createElement(BillList, { ref: function (node) {
                    this.BillList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddBill.showMe(item, itemType),
                Items: this.state.BillOrders }),
            React.createElement(AddBill, { ref: function (node) {
                    this.AddBill = node;this.addNode(node);
                }.bind(this),
                ShowItemList: (itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowBankAccountList: (itemSelMode, showNextComponent, multiSelect) => this.BankAccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowAddBill: (item, itemType) => this.AddBill.showMe(item, itemType),
                ShowList: () => this.BillList.showMe() }),
            React.createElement(PayBillList, { ref: function (node) {
                    this.PayBillList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: item => this.AddPayBill.showMe(item) }),
            React.createElement(AddPayBill, { ref: function (node) {
                    this.AddPayBill = node;this.addNode(node);
                }.bind(this),
                ShowList: () => this.PayBillList.showMe() }),
            React.createElement(JVList, { ref: function (node) {
                    this.JVList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddJV.showMe(item, itemType) }),
            React.createElement(AddJV, { ref: function (node) {
                    this.AddJV = node;this.addNode(node);
                }.bind(this),
                ShowAddJV: (item, itemType) => this.AddJV.showMe(item, itemType),
                ShowDrAccountList: (itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowCrAccountList: (itemSelMode, showNextComponent, multiSelect) => this.AllAccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowList: () => this.JVList.showMe() }),
            React.createElement(ChargeTransRep, { ref: function (node) {
                    this.ChargeTransRep = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowChargeTransRep: filter => this.ChargeTransRep.showMe(filter),
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType) }),
            React.createElement(ReportFilter, { ref: function (node) {
                    this.ReportFilter = node;this.addNode(node);
                }.bind(this),
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType) }),
            React.createElement(ReportFilter, { ref: function (node) {
                    this.ReportFilter2 = node;this.addNode(node);
                }.bind(this),
                ShowAccount: false,
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType) }),
            React.createElement(AccountRep, { ref: function (node) {
                    this.AccountRep = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType) }),
            React.createElement(ChargeOrderRep, { ref: function (node) {
                    this.ChargeOrderRep = node;this.addNode(node);
                }.bind(this),
                ChargeOrderRep: this.ChargeOrderRep,
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowChargeOrderRep: filter => this.ChargeOrderRep.showMe(filter),
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType) }),
            React.createElement(ChargePayeeItemRep, { ref: function (node) {
                    this.ChargePayeeItemRep = node;this.addNode(node);
                }.bind(this),
                ChargePayeeItemRep: this.ChargePayeeItemRep,
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowChargePayeeItemRep: filter => this.ChargePayeeItemRep.showMe(filter),
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType) }),
            React.createElement(BillOrderRep, { ref: function (node) {
                    this.BillOrderRep = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType) }),
            React.createElement(AdvChargeList, { ref: function (node) {
                    this.AdvChargeList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddAdvCharge.showMe(item, itemType) }),
            React.createElement(AddAdvCharge, { ref: function (node) {
                    this.AddAdvCharge = node;this.addNode(node);
                }.bind(this),
                ShowAdd: (item, itemType) => this.AddAdvCharge.showMe(item, itemType),
                ShowDrAccountList: (itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowItemList: (itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowList: () => this.AdvChargeList.showMe() }),
            React.createElement(AddAdvMonthlyMaintainance, { ref: function (node) {
                    this.AddAdvMonthlyMaintainance = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAddAdvMonthlyMaintainance: () => this.AddAdvMonthlyMaintainance.showMe() }),
            React.createElement(RevertAdvChargeTransList, { ref: function (node) {
                    this.RevertAdvChargeTransList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                HideAll: this.hideAll,
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddRevertAdvChargeTrans.showMe(item, itemType) }),
            React.createElement(AddRevertAdvChargeTrans, { ref: function (node) {
                    this.AddRevertAdvChargeTrans = node;this.addNode(node);
                }.bind(this),
                HideAll: this.hideAll,
                ShowList: () => this.RevertAdvChargeTransList.showMe() }),
            React.createElement(RevertChargeTransList, { ref: function (node) {
                    this.RevertChargeTransList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                HideAll: this.hideAll,
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddRevertChargeTrans.showMe(item, itemType) }),
            React.createElement(AddRevertChargeTrans, { ref: function (node) {
                    this.AddRevertChargeTrans = node;this.addNode(node);
                }.bind(this),
                HideAll: this.hideAll,
                ShowList: () => this.RevertChargeTransList.showMe() }),
            React.createElement(RevertCummChargeTransList, { ref: function (node) {
                    this.RevertCummChargeTransList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                HideAll: this.hideAll,
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddRevertCummChargeTrans.showMe(item, itemType) }),
            React.createElement(AddRevertCummChargeTrans, { ref: function (node) {
                    this.AddRevertCummChargeTrans = node;this.addNode(node);
                }.bind(this),
                HideAll: this.hideAll,
                ShowList: () => this.RevertCummChargeTransList.showMe() }),
            React.createElement(RevertBillTransList, { ref: function (node) {
                    this.RevertBillTransList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                HideAll: this.hideAll,
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddRevertBillTrans.showMe(item, itemType) }),
            React.createElement(AddRevertBillTrans, { ref: function (node) {
                    this.AddRevertBillTrans = node;this.addNode(node);
                }.bind(this),
                HideAll: this.hideAll,
                ShowList: () => this.RevertBillTransList.showMe() }),
            React.createElement(BankStatementList, { ref: function (node) {
                    this.BankStatementList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: (item, itemType) => this.AddBankStatement.showMe(item, itemType),
                ShowRep: item => this.BankStatementRep.showMe(item) }),
            React.createElement(AddBankStatement, { ref: function (node) {
                    this.AddBankStatement = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowList: () => this.BankStatementList.showMe() }),
            React.createElement(BankStatementRep, { ref: function (node) {
                    this.BankStatementRep = node;this.addNode(node);
                }.bind(this),
                BankStatementRep: this.BankStatementRep,
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowBankStatementRep: filter => this.BankStatementRep.showMe(filter),
                ShowList: () => this.BankStatementList.showMe() }),
            React.createElement(Reconciliation, { ref: function (node) {
                    this.Reconciliation = node;this.addNode(node);
                }.bind(this),
                Reconciliation: this.Reconciliation,
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowReconciliation: (item, itemType) => this.Reconciliation.showMe(item, itemType),
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType),
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.MemberAccountList.showMe(itemSelMode, showNextComponent, multiSelect) }),
            React.createElement(ReconciliationRep, { ref: function (node) {
                    this.ReconciliationRep = node;this.addNode(node);
                }.bind(this),
                ReconciliationRep: this.ReconciliationRep,
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowReconciliationRep: filter => this.ReconciliationRep.showMe(filter),
                ShowReportFilter: (item, itemType) => this.ReportFilter.showMe(item, itemType) }),
            React.createElement(AutoTransEntryRep, { ref: function (node) {
                    this.AutoTransEntryRep = node;this.addNode(node);
                }.bind(this),
                AutoTransEntryRep: this.AutoTransEntryRep,
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowAutoTransEntryRep: () => this.AutoTransEntryRep.showMe() }),
            React.createElement(AutoTransEntry, { ref: function (node) {
                    this.AutoTransEntry = node;this.addNode(node);
                }.bind(this),
                AutoTransEntry: this.AutoTransEntry,
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowAutoTransEntry: (item, itemType) => this.AutoTransEntry.showMe(item, itemType),
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect) }),
            React.createElement(AccountExpRep, { ref: function (node) {
                    this.AccountExpRep = node;this.addNode(node);
                }.bind(this),
                AccountExpRep: this.AccountExpRep,
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowAccountExpRep: (item, itemType) => this.AccountExpRep.showMe(item, itemType),
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect) }),
            React.createElement(RegisterMobileNo, { ref: function (node) {
                    this.RegisterMobileNo = node;this.addNode(node);
                }.bind(this),
                ShowNext: () => this.Dashboard.showMe() }),
            React.createElement(TransTokenAccountList, { ref: function (node) {
                    this.TransTokenAccountList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: (item, itemType) => this.Dashboard.showMe(item, itemType),
                ShowAdd: item => this.AddTransToken.showMe(item) }),
            React.createElement(AddTransToken, { ref: function (node) {
                    this.AddTransToken = node;this.addNode(node);
                }.bind(this),
                ShowList: () => this.TransTokenAccountList.showMe() }),
            React.createElement(BankStatementRep2, { ref: function (node) {
                    this.BankStatementRep2 = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowAccountExpRep: (item, itemType) => this.AccountExpRep.showMe(item, itemType) }),
            React.createElement(OrgList, { ref: function (node) {
                    this.OrgList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowAdd: () => this.AddOrg.showMe(),
                ShowEdit: item => this.EditOrg.showMe(item) }),
            React.createElement(AddOrg, { ref: function (node) {
                    this.AddOrg = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowList: () => this.OrgList.showMe() }),
            React.createElement(EditOrg, { ref: function (node) {
                    this.EditOrg = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowList: () => this.OrgList.showMe() }),
            React.createElement(EditOrg, { ref: function (node) {
                    this.EditOrg2 = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowList: () => this.Dashboard.showMe() }),
            React.createElement(AddDonation, { ref: function (node) {
                    this.AddDonation = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowItemList: showNextComponent => this.ItemList.showMe(true, showNextComponent, false),
                ShowAccountList: (itemSelMode, showNextComponent, multiSelect) => this.MemberAccountList.showMe(itemSelMode, showNextComponent, multiSelect),
                ShowAddDonation: (item, itemType) => this.AddDonation.showMe(item, itemType),
                ShowAddDonationDetail: (item, itemType) => this.AddDonationDetail.showMe(item, itemType),
                ShowList: () => this.DonationList.showMe() }),
            React.createElement(DonationList, { ref: function (node) {
                    this.DonationList = node;this.addNode(node);
                }.bind(this),
                ShowNextComponent: () => this.Dashboard.showMe(),
                ShowAdd: item => this.AddDonation.showMe(item, 1) }),
            React.createElement(AddDonationDetail, { ref: function (node) {
                    this.AddDonationDetail = node;this.addNode(node);
                }.bind(this),
                ShowAccountList: showNextComponent => this.AccountList.showMe(true, showNextComponent, false),
                ShowAddDonationDetail: (item, itemType) => this.AddDonationDetail.showMe(item, itemType),
                ShowList: item => this.AddDonation.showMe(item, 1) })
        );
    },
    customShow: function () {
        this.hideAll();
        if (_LoginAccount && _LoginAccount.MobileNo) {
            this.Dashboard.showMe();
        } else {
            this.RegisterMobileNo.show();
        }
    },
    componentDidMount: function () {
        setComponent(this);
    },
    hideAll: function () {
        this.nodes.forEach(node => {
            if (node) node.hide();
        });
    },
    showHome: function () {
        this.hideAll();
        this.Dashboard.showMe();
    }
});