var EAccountHome = React.createClass({
    nodes: [], 
    addNode: function(node) {
        if(node) this.nodes.push(node);
    },
    getInitialState: function () {
        return {
            
        };
    },
    render: function() {
        this.nodes = [];
        return (
            <div ref={function(node){this.Component = node;}.bind(this)}>
                <Dashboard ref={function (node) { this.Dashboard = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowItemList={(itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowPayAccountList={() => this.PayAccountList.showMe()}
                    ShowUserList={() => this.UserList.showMe()}
                    ShowUserProfile={()=> this.UserProfile.showMe()}
                    ShowChangePassword={() => this.ChangePassword.showMe()}
                    ShowChargeList={() => this.ChargeList.showMe()}
                    ShowBillList={() => this.BillList.showMe()}
                    ShowJVList={() => this.JVList.showMe()}
                    ShowPayBillList={() => this.PayBillList.showMe()}
                    ShowChargeTransRep={(filter) => this.ChargeTransRep.showMe(filter)} 
                    ShowBillTransRep={(filter) => this.BillTransRep.showMe(filter)} 
                    ShowAccountRep={() => this.AccountRep.showMe()}
                    ShowChargeOrderRep={() => this.ChargeOrderRep.showMe()}
                    ShowChargePayeeItemRep={() => this.ChargePayeeItemRep.showMe()}
                    ShowBillOrderRep={() => this.BillOrderRep.showMe()}
                    ShowReportFilter={(item, itemType) => this.ReportFilter2.showMe2(item, itemType)}
                    ShowAdvChargeList={() => this.AdvChargeList.showMe()}
                    ShowAddAdvMonthlyMaintainance={() => this.AddAdvMonthlyMaintainance.showMe()}
                    ShowRevertAdvChargeTransList={() => this.RevertAdvChargeTransList.showMe()}
                    ShowRevertChargeTransList={() => this.RevertChargeTransList.showMe()}
                    ShowRevertCummChargeTransList={() => this.RevertCummChargeTransList.showMe()}
                    ShowRevertBillTransList={() => this.RevertBillTransList.showMe()}
                    ShowReconciliation={(item, itemType) => this.Reconciliation.showMe(item, itemType)} 
                    ShowReconciliationRep={(filter) => this.ReconciliationRep.showMe(filter)} 
                    ShowBankStatementList={() => this.BankStatementList.showMe()}
                    ShowBankStatementRep={(filter) => this.BankStatementRep.showMe(filter)}
                    ShowAutoTransEntryRep={() => this.AutoTransEntryRep.showMe()}
                    ShowAutoTransEntry={() => this.AutoTransEntry.showMe()}
                    ShowAccountExpRep={() => this.AccountExpRep.showMe()}
                    ShowTransMapper={() => goToTrnsMapper()}
                    ShowBillTransMapper={() => goToBillTrnsMapper()}
                    ShowTransTokenAccountList={() => this.TransTokenAccountList.showMe()}
                    ShowBankStatementRep2={() => this.BankStatementRep2.showMe()}
                    ShowOrgList={() => this.OrgList.showMe()}
                    ShowEditOrg={() => this.EditOrg2.showMe2()}
                    ShowDonationList={(item, itemType) => this.DonationList.showMe(item, itemType)}
                    
                />
                
                <AccountList ref={function (node) { this.AccountList = node; this.addNode(node); }.bind(this)}
                    AccountType={-1}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddAccount.showMe(item, itemType)}
                    Accounts={this.state.Accounts}/>
                <AccountList ref={function (node) { this.MemberAccountList = node; this.addNode(node); }.bind(this)}
                    AccountType={1}/>
                <AccountList ref={function (node) { this.BankAccountList = node; this.addNode(node); }.bind(this)}
                    AccountType={2}/>
                <AccountList ref={function (node) { this.AllAccountList = node; this.addNode(node); }.bind(this)}
                    AccountType={-1}
                    ItemType={14}/>          
                <AddAccount ref={function(node){this.AddAccount = node; this.addNode(node);}.bind(this)}
                    ShowList={(itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)} 
                    />
                
                <ItemList ref={function (node) { this.ItemList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddItem.showMe(item, itemType)}/>
                <AddItem ref={function(node){this.AddItem = node; this.addNode(node);}.bind(this)}
                    ToggleSelectAccount={this.showSelectAccount}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowAddItem={(item, itemType) => this.AddItem.showMe(item, itemType)}
                    ShowList={(itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect)}/>    
                
                <ChargeList ref={function (node) { this.ChargeList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddCharge.showMe(item, itemType)}/> 
                <AddCharge ref={function(node){this.AddCharge = node; this.addNode(node);}.bind(this)}
                    ToggleSelectAccount={this.showSelectItem}
                    ShowItemList={(itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.MemberAccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowAddCharge={(item, itemType) => this.AddCharge.showMe(item, itemType)}
                    ShowList={()=>this.ChargeList.showMe()}/>
                
                <PayAccountList ref={function (node) { this.PayAccountList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowPayChargeList={(accountId) => this.PayChargeList.showMe(accountId)}
                    Items={this.state.PayAccounts}/>      
                <PayChargeList ref={function (node) { this.PayChargeList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(accountId) => this.PayAccountList.showMe(accountId)}
                    ShowAdd={(item) => this.AddChargePayment.showMe(item)}/>
                <AddChargePayment ref={function(node){this.AddChargePayment = node; this.addNode(node);}.bind(this)}
                    ShowList={(accountId) => this.PayChargeList.showMe(accountId)}/>
                
                <UserList ref={function (node) { this.UserList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddUser.showMe(item, itemType)}/>  
                <AddUser ref={function(node){this.AddUser = node; this.addNode(node);}.bind(this)}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.MemberAccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowAddUser={(item, itemType) => this.AddUser.showMe(item, itemType)}
                    ShowList={()=>this.UserList.showMe()}/>     
                
                <UserProfile ref={function (node) { this.UserProfile = node; this.addNode(node); }.bind(this)}
                    ShowList={(item, itemType) => this.Dashboard.showMe(item, itemType)}/>
                <ChangePassword ref={function (node) { this.ChangePassword = node; this.addNode(node); }.bind(this)}
                    ShowList={(item, itemType) => this.Dashboard.showMe(item, itemType)}/>
                
                <BillList ref={function (node) { this.BillList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddBill.showMe(item, itemType)}
                    Items={this.state.BillOrders}/>
                <AddBill ref={function(node){this.AddBill = node; this.addNode(node);}.bind(this)}
                    ShowItemList={(itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowBankAccountList={(itemSelMode, showNextComponent, multiSelect) => this.BankAccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowAddBill={(item, itemType) => this.AddBill.showMe(item, itemType)}
                    ShowList={() => this.BillList.showMe()}/>
                
                <PayBillList ref={function (node) { this.PayBillList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item) => this.AddPayBill.showMe(item)}/>
                <AddPayBill ref={function(node){this.AddPayBill = node; this.addNode(node);}.bind(this)}
                    ShowList={() => this.PayBillList.showMe()}/>   
                
                <JVList ref={function (node) { this.JVList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddJV.showMe(item, itemType)}/>
                <AddJV ref={function(node){this.AddJV = node; this.addNode(node);}.bind(this)}
                    ShowAddJV={(item, itemType) => this.AddJV.showMe(item, itemType)}
                    ShowDrAccountList={(itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowCrAccountList={(itemSelMode, showNextComponent, multiSelect) => this.AllAccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowList={() => this.JVList.showMe()}/>
                <ChargeTransRep ref={function(node){this.ChargeTransRep = node; this.addNode(node);}.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowChargeTransRep={(filter) => this.ChargeTransRep.showMe(filter)}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)} />
                <BillTransRep ref={function (node) { this.BillTransRep = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowBillTransRep={(filter) => this.BillTransRep.showMe(filter)}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)} />
                <ReportFilter ref={function(node){this.ReportFilter = node; this.addNode(node);}.bind(this)}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)}/>
                <ReportFilter ref={function(node){this.ReportFilter2 = node; this.addNode(node);}.bind(this)}
                    ShowAccount={false}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)}/>    
                <AccountRep ref={function(node){this.AccountRep = node; this.addNode(node);}.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}/>
                <ChargeOrderRep ref={function (node) { this.ChargeOrderRep = node; this.addNode(node); }.bind(this)}
                    ChargeOrderRep={this.ChargeOrderRep }
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowChargeOrderRep={(filter) => this.ChargeOrderRep.showMe(filter)}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)} />  
                <ChargePayeeItemRep ref={function (node) { this.ChargePayeeItemRep = node; this.addNode(node); }.bind(this)}
                    ChargePayeeItemRep={this.ChargePayeeItemRep}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowChargePayeeItemRep={(filter) => this.ChargePayeeItemRep.showMe(filter)}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)} />   
                <BillOrderRep ref={function (node) { this.BillOrderRep = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}/>
                <AdvChargeList ref={function (node) { this.AdvChargeList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddAdvCharge.showMe(item, itemType)}/>
                <AddAdvCharge ref={function(node){this.AddAdvCharge = node; this.addNode(node);}.bind(this)}
                    ShowAdd={(item, itemType) => this.AddAdvCharge.showMe(item, itemType)}
                    ShowDrAccountList={(itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowItemList={(itemSelMode, showNextComponent, multiSelect) => this.ItemList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowList={() => this.AdvChargeList.showMe()} />
                <AddAdvMonthlyMaintainance ref={function (node) { this.AddAdvMonthlyMaintainance = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAddAdvMonthlyMaintainance={() => this.AddAdvMonthlyMaintainance.showMe()} />
                <RevertAdvChargeTransList ref={function(node){this.RevertAdvChargeTransList = node; this.addNode(node);}.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    HideAll={this.hideAll}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddRevertAdvChargeTrans.showMe(item, itemType)}/>
                <AddRevertAdvChargeTrans ref={function(node){this.AddRevertAdvChargeTrans = node; this.addNode(node);}.bind(this)}
                    HideAll={this.hideAll}
                    ShowList={() => this.RevertAdvChargeTransList.showMe()}/>
                <RevertChargeTransList ref={function(node){this.RevertChargeTransList = node; this.addNode(node);}.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    HideAll={this.hideAll}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddRevertChargeTrans.showMe(item, itemType)}/>
                <AddRevertChargeTrans ref={function(node){this.AddRevertChargeTrans = node; this.addNode(node);}.bind(this)}
                    HideAll={this.hideAll}
                    ShowList={() => this.RevertChargeTransList.showMe()}/>    

                <RevertCummChargeTransList ref={function(node){this.RevertCummChargeTransList = node; this.addNode(node);}.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    HideAll={this.hideAll}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddRevertCummChargeTrans.showMe(item, itemType)}/>
                <AddRevertCummChargeTrans ref={function(node){this.AddRevertCummChargeTrans = node; this.addNode(node);}.bind(this)}
                    HideAll={this.hideAll}
                    ShowList={() => this.RevertCummChargeTransList.showMe()}/>   

                <RevertBillTransList ref={function(node){this.RevertBillTransList = node; this.addNode(node);}.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    HideAll={this.hideAll}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddRevertBillTrans.showMe(item, itemType)}/>
                <AddRevertBillTrans ref={function(node){this.AddRevertBillTrans = node; this.addNode(node);}.bind(this)}
                    HideAll={this.hideAll}
                    ShowList={() => this.RevertBillTransList.showMe()} />    

                <BankStatementList ref={function (node) { this.BankStatementList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item, itemType) => this.AddBankStatement.showMe(item, itemType)}
                    ShowRep={(item) => this.BankStatementRep.showMe(item)} />
                <AddBankStatement ref={function (node) { this.AddBankStatement = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowList={() => this.BankStatementList.showMe()}                />
                <BankStatementRep ref={function (node) { this.BankStatementRep = node; this.addNode(node); }.bind(this)}
                    BankStatementRep={this.BankStatementRep}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowBankStatementRep={(filter) => this.BankStatementRep.showMe(filter)}
                    ShowList={() => this.BankStatementList.showMe()} />
                <Reconciliation ref={function (node) { this.Reconciliation = node; this.addNode(node); }.bind(this)}
                    Reconciliation={this.Reconciliation}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowReconciliation={(item, itemType) => this.Reconciliation.showMe(item, itemType)}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.MemberAccountList.showMe(itemSelMode, showNextComponent, multiSelect)}                />
                <ReconciliationRep ref={function (node) { this.ReconciliationRep = node; this.addNode(node); }.bind(this)}
                    ReconciliationRep={this.ReconciliationRep}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowReconciliationRep={(filter) => this.ReconciliationRep.showMe(filter)}
                    ShowReportFilter={(item, itemType) => this.ReportFilter.showMe(item, itemType)} />
                <AutoTransEntryRep ref={function (node) { this.AutoTransEntryRep = node; this.addNode(node); }.bind(this)}
                    AutoTransEntryRep={this.AutoTransEntryRep}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowAutoTransEntryRep={() => this.AutoTransEntryRep.showMe()} />
                <AutoTransEntry ref={function (node) { this.AutoTransEntry = node; this.addNode(node); }.bind(this)}
                    AutoTransEntry={this.AutoTransEntry}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowAutoTransEntry={(item, itemType) => this.AutoTransEntry.showMe(item, itemType)}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)} />
                <AccountExpRep ref={function (node) { this.AccountExpRep = node; this.addNode(node); }.bind(this)}
                    AccountExpRep={this.AccountExpRep}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowAccountExpRep={(item, itemType) => this.AccountExpRep.showMe(item, itemType)}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.AccountList.showMe(itemSelMode, showNextComponent, multiSelect)}/>
                <RegisterMobileNo ref={function (node) { this.RegisterMobileNo = node; this.addNode(node); }.bind(this)}
                    ShowNext={() => this.Dashboard.showMe()} />
                <TransTokenAccountList ref={function (node) { this.TransTokenAccountList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={(item, itemType) => this.Dashboard.showMe(item, itemType)}
                    ShowAdd={(item) => this.AddTransToken.showMe(item)} />
                <AddTransToken ref={function (node) { this.AddTransToken = node; this.addNode(node); }.bind(this)}
                    ShowList={() => this.TransTokenAccountList.showMe()} />
                <BankStatementRep2 ref={function (node) { this.BankStatementRep2 = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowAccountExpRep={(item, itemType) => this.AccountExpRep.showMe(item, itemType)} />
                <OrgList ref={function (node) { this.OrgList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowAdd={() => this.AddOrg.showMe()}
                    ShowEdit={(item) => this.EditOrg.showMe(item)}/>
                <AddOrg ref={function (node) { this.AddOrg = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowList={() => this.OrgList.showMe()} />
                <EditOrg ref={function (node) { this.EditOrg = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowList={() => this.OrgList.showMe()} />
                <EditOrg ref={function (node) { this.EditOrg2 = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowList={() => this.Dashboard.showMe()} />
                <AddDonation ref={function (node) { this.AddDonation = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowItemList={(showNextComponent) => this.ItemList.showMe(true, showNextComponent, false)}
                    ShowAccountList={(itemSelMode, showNextComponent, multiSelect) => this.MemberAccountList.showMe(itemSelMode, showNextComponent, multiSelect)}
                    ShowAddDonation={(item, itemType) => this.AddDonation.showMe(item, itemType)}
                    ShowAddDonationDetail={(item, itemType) => this.AddDonationDetail.showMe(item, itemType)}
                    ShowList={() => this.DonationList.showMe()} />
                <DonationList ref={function (node) { this.DonationList = node; this.addNode(node); }.bind(this)}
                    ShowNextComponent={() => this.Dashboard.showMe()}
                    ShowAdd={(item) => this.AddDonation.showMe(item, 1)} />
                <AddDonationDetail ref={function (node) { this.AddDonationDetail = node; this.addNode(node); }.bind(this)}
                    ShowAccountList={(showNextComponent) => this.AccountList.showMe(true, showNextComponent, false)}
                    ShowAddDonationDetail={(item, itemType) => this.AddDonationDetail.showMe(item, itemType)}
                    ShowList={(item) => this.AddDonation.showMe(item, 1)}/>
            </div>
        );
    },
    customShow: function () {
        this.hideAll();
        if (_LoginAccount && _LoginAccount.MobileNo) {
            this.Dashboard.showMe()
        } else {
            this.RegisterMobileNo.show();
        }
    },
    componentDidMount: function () {
        setComponent(this);
    },
    hideAll: function() {
        this.nodes.forEach(node => {
            if(node)node.hide();
        });
    },
    showHome: function () {
        this.hideAll();
        this.Dashboard.showMe()
    },
});