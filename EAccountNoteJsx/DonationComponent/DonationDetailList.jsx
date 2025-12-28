var DonationDetailList = React.createClass({
    getInitialState: function () {
        return {
            Filter: "",
            Items: [],
        };
    },
    render: function () {
        return (
            <div>
                <DonationRow Item={this.props.Entity} RowClassName="no-class" />
                <hr></hr>
                <div style={{ textAlign: "center", marginBottom: 3 }}>
                    <button className="btn btn-primary" type="button" onClick={this.actionOnAdd}>
                        <span className="glyphicon glyphicon-plus" />
                    </button>
                </div>
                <ListFilter FilterChange={this.filterChange} FilterText="Filter by Remark" />
                {this.getList()}
            </div>
        );
    },
    actionOnAdd: function () {
        this.props.ShowAddDonationDetail(this.props.Entity, 1);
    },
    getList: function () {
        return this.props.Entity.Details.map(function (item) {
            if (item.Remark.toLowerCase().indexOf(this.state.Filter) > -1
                || this.state.Filter == "") {
                return (
                    <DonationDetailRow
                        key={item.DonationDetailId}
                        Item={item}/>
                );
            }

        }.bind(this));
    },
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    },
});