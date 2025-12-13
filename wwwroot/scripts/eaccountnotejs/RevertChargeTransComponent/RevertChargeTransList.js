var RevertChargeTransList = React.createClass({
    displayName: "RevertChargeTransList",

    getInitialState: function () {
        return {
            Filter: null,
            Items: []
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(ListHeader, { ShowNextComponent: this.props.ShowNextComponent, ItemSelMode: true, Title: "Revert Charge Trans" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(ReportCommand, { ShowDownload: false, ShowReportFilter: this.showReportFilter }),
                React.createElement("hr", null),
                this.getList()
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (filter) {
        this.props.HideAll();
        this.loadList(filter ? filter : this.state.Filter);
        this.show();
    },
    loadList: function (filter) {
        if (!filter || typeof filter.FromDate == "undefined") {
            filter = { FromDate: get1stDayOfCurrentMonth(), ToDate: getCurrentDateWithEODTime(), AccountId: -1 };
        }
        this.setState({ Filter: filter });
        var urlParams = "?orgId=" + _LoginAccount.OrgId;
        urlParams += "&accountId=" + filter.AccountId;
        urlParams += "&fromDate=" + filter.FromDate;
        urlParams += "&toDate=" + filter.ToDate;
        _ProgressBar.IMBusy();
        ajaxGet('RevertTrans/listChargeTrans' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data
            });
        }.bind(this));
    },
    showReportFilter: function () {
        this.props.ShowReportFilter(this.showMe, 1);
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            return React.createElement(RevertChargeTransRow, {
                key: item.ChargePayTransId,
                Item: item,
                ActionOnItemSelect: this.actionOnItemSelect
            });
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