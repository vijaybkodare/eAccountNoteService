var PayBillList = React.createClass({
    displayName: "PayBillList",

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
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, ItemSelMode: true, Title: "Pay Bills" }),
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
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('BillOrder/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            if (item.ItemName.toLowerCase().indexOf(this.state.Filter.toLowerCase()) > -1 || this.state.Filter == "") {
                return React.createElement(PayBillRow, {
                    key: item.BillOrderId,
                    Item: item,
                    ActionOnItemSelect: this.actionOnItemSelect
                });
            }
        }.bind(this));
    },
    actionOnItemSelect: function (item) {
        this.props.ShowAdd(item, 1);
    },
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    },
    setItemSelMode: function (flag, nextComponent) {
        this.setState({
            ItemSelMode: flag,
            ShowNextComponent: nextComponent
        });
    }
});