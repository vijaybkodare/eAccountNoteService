var DonationList = React.createClass({
    getInitialState: function () {
        return {
            Filter: "",
            Items: [],
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Donation" />
                <div className="panel-body">
                    <ListCommand
                        ShowAdd={this.props.ShowAdd}
                        ShowNextComponent={this.props.ShowNextComponent} />
                    <ListFilter FilterChange={this.filterChange} FilterText="Filter by Remark" />
                    {this.getList()}
                </div>
            </div>
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
        ajaxGet('api/Donation/list' + urlParams, function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function () {
        return this.state.Items.map(function (item) {
            if (item.Remark.toLowerCase().indexOf(this.state.Filter) > -1
                || this.state.Filter == "") {
                return (
                    <DonationRow
                        key={item.DonationHeaderId}
                        Item={item}
                        ActionOnItemSelect={this.actionOnItemSelect}
                    />
                );
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
    },
});