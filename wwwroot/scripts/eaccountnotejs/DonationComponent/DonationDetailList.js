var DonationDetailList = React.createClass({
    displayName: "DonationDetailList",

    getInitialState: function () {
        return {
            Filter: "",
            Items: []
        };
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(DonationRow, { Item: this.props.Entity, RowClassName: "no-class" }),
            React.createElement("hr", null),
            React.createElement(
                "div",
                { style: { textAlign: "center", marginBottom: 3 } },
                React.createElement(
                    "button",
                    { className: "btn btn-primary", type: "button", onClick: this.actionOnAdd },
                    React.createElement("span", { className: "glyphicon glyphicon-plus" })
                )
            ),
            React.createElement(ListFilter, { FilterChange: this.filterChange, FilterText: "Filter by Remark" }),
            this.getList()
        );
    },
    actionOnAdd: function () {
        this.props.ShowAddDonationDetail(this.props.Entity, 1);
    },
    getList: function () {
        return this.props.Entity.Details.map(function (item) {
            if (item.Remark.toLowerCase().indexOf(this.state.Filter) > -1 || this.state.Filter == "") {
                return React.createElement(DonationDetailRow, {
                    key: item.DonationDetailId,
                    Item: item });
            }
        }.bind(this));
    },
    filterChange: function (filter) {
        this.setState({
            Filter: filter
        });
    }
});