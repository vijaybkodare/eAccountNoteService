var ReportFilter = React.createClass({
    displayName: "ReportFilter",

    getInitialState: function () {
        return {
            ShowNextComponent: null,
            Account: { AccountId: -1, AccountName: '' }
        };
    },
    render: function () {
        let showAccount = typeof this.props.ShowAccount == "undefined" ? true : this.props.ShowAccount;
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(
                "div",
                { className: "panel-heading" },
                React.createElement(
                    "button",
                    { className: "btn btn-primary", onClick: this.state.ShowNextComponent },
                    React.createElement("span", { className: "glyphicon glyphicon-chevron-left" })
                ),
                "\xA0 Report Filter"
            ),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(DateSelector, { Label: "From Date", ref: function (node) {
                        this.FromDt = node;
                    }.bind(this) }),
                React.createElement(DateSelector, { Label: "To Date", ref: function (node) {
                        this.ToDt = node;
                    }.bind(this) }),
                isAdmin() && showAccount && React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "mandatory" },
                        "Account"
                    ),
                    React.createElement(ItemSelect, { ItemText: this.state.Account.AccountName, ItemChange: this.inputChange, ClearItemSelect: this.clearItemSelect, GoForItemSelect: this.goForSelectAccount })
                )
            ),
            React.createElement(
                "div",
                { className: "panel-footer text-center" },
                React.createElement(
                    "div",
                    { className: "btn-group", role: "group" },
                    React.createElement(
                        "button",
                        { type: "button", className: "btn btn-success", onClick: this.applyFilter },
                        "Apply"
                    )
                )
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        if (itemType == 1) {
            this.updateNextComponent(item);
        }
        if (itemType == 12) {
            this.updateAccount(item);
        }
        this.show();
    },
    showMe2: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        if (itemType == 1) {
            this.updateNextComponent(item);
        }
        this.show();
    },
    clearItemSelect: function () {
        this.setState({ Account: { AccountId: -1, AccountName: '' } });
    },
    goForSelectAccount: function () {
        this.props.ShowAccountList(true, this.props.ShowReportFilter);
    },
    updateAccount: function (account) {
        if (typeof account.AccountId == "undefined") {
            account = { AccountId: -1, AccountName: '' };
        }
        this.setState({
            Account: account
        });
    },
    filterChange: function () {
        this.props.FilterChange(this.Filter.value);
    },
    updateNextComponent: function (showNextComponent) {
        this.setState({ ShowNextComponent: showNextComponent });
    },
    applyFilter: function () {
        let filter = {
            FromDate: this.FromDt.getValue(),
            ToDate: this.ToDt.getValue() + " 23:59:59",
            AccountId: this.state.Account.AccountId,
            Account: this.state.Account
        };
        this.state.ShowNextComponent(filter);
    }
});