var PayAccountList = React.createClass({
    displayName: "PayAccountList",

    getInitialState: function () {
        return {
            Filter: "",
            Items: []
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, ItemSelMode: false, Title: "Charges" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ListFilter, { FilterChange: this.filterChange }),
                React.createElement(
                    "div",
                    { className: "listHeader2" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-8" },
                            "Account"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-4", style: { textAlign: "right" } },
                            "Pending"
                        )
                    )
                ),
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
        var urlParams = "?profileId=" + _LoginAccount.ProfileId;
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/PayAccounts' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            if (item.AccountName.toLowerCase().indexOf(this.state.Filter.toLowerCase()) > -1 || this.state.Filter == "") {
                //item.PendingAmount > 0 &&
                return React.createElement(PayAccountRow, {
                    key: item.AccountId,
                    Item: item,
                    ActionOnItemSelect: this.actionOnItemSelect
                });
            }
        }.bind(this));
    },
    actionOnItemSelect: function (item) {
        this.props.ShowPayChargeList(item.AccountId);
    },
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    }
});