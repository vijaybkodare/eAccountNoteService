var OrgList = React.createClass({
    getInitialState: function () {
        return {
            Filter: "",
            Items: [],
        };
    },
    render: function () {
        var showNextComponent = this.state.ShowNextComponent ? this.state.ShowNextComponent : this.props.ShowNextComponent;
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <ListHeader ShowNextComponent={this.props.ShowNextComponent} Title="Organization" />
                <div className="panel-body">
                    <ListCommand
                        ShowAdd={this.props.ShowAdd}
                        ShowNextComponent={showNextComponent} />
                    <ListFilter FilterChange={this.filterChange} FilterText="Filter by Organization" />
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
        _ProgressBar.IMBusy();
        ajaxGet('api/Org/list', function (data) {
            _ProgressBar.IMDone();
            this.setState({
                Items: data,
            });
        }.bind(this));
    },
    getList: function () {
        var srNo = 0;
        return this.state.Items.map(function (item) {
            if (item.OrgName.toLowerCase().indexOf(this.state.Filter) > -1
                || this.state.Filter == "") {
                srNo += 1;
                return (
                    <OrgRow
                        key={item.OrgId}
                        Item={item}
                        SrNo={srNo}
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
        this.props.ShowEdit(item);
    },
});