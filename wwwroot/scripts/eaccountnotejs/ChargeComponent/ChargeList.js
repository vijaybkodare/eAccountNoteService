var ChargeList = React.createClass({
    displayName: "ChargeList",

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
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "Charge Orders" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ListCommand, {
                    ItemSelMode: this.state.ItemSelMode,
                    MultiSelect: this.state.MultiSelect,
                    ShowAdd: this.props.ShowAdd,
                    SelectionComplete: this.selectionComplete,
                    ToggleAllSelect: this.toggleAllSelect,
                    ShowNextComponent: showNextComponent }),
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
        urlParams += "&fromDate=";
        urlParams += "&toDate=";
        _ProgressBar.IMBusy();
        ajaxGet('ChargeOrder/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            if (item.ItemName.toLowerCase().indexOf(this.state.Filter) > -1 || this.state.Filter == "") {
                return React.createElement(ChargeRow, {
                    key: item.ChargeOrderId,
                    Item: item,
                    ActionOnItemSelect: this.actionOnItemSelect
                });
            }
        }.bind(this));
    },
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    },
    actionOnItemSelect: function (item) {
        if (this.state.ItemSelMode) {
            if (this.state.MultiSelect) {
                item.Selected = !item.Selected;
                this.setState({});
            } else {
                this.state.ShowNextComponent(item, 2);
            }
        } else {
            this.props.ShowAdd(item, 1);
        }
    }
});