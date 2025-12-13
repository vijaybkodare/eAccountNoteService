var JVList = React.createClass({
    displayName: "JVList",

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
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, Title: "JV" }),
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
        _ProgressBar.IMBusy();
        ajaxGet('JVOrder/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            if (item.DrAccount.toLowerCase().indexOf(this.state.Filter) > -1 || item.CrAccount.toLowerCase().indexOf(this.state.Filter) > -1 || this.state.Filter == "") {
                return React.createElement(JVRow, {
                    key: item.JVOrderId,
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
        this.props.ShowAdd(item, 1);
    }
});