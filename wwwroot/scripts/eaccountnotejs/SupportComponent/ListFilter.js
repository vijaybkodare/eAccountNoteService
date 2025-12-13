var ListFilter = React.createClass({
    displayName: "ListFilter",

    render: function () {
        var className = this.props.ShowAdd != null ? "input-group" : "";
        var filterText = this.props.FilterText ? this.props.FilterText : "Filter by Item name";
        return React.createElement(
            "div",
            { className: className, style: { marginBottom: 3 } },
            React.createElement("input", { ref: function (node) {
                    this.Filter = node;
                }.bind(this), type: "text", className: "form-control", placeholder: filterText, onChange: this.filterChange })
        );
    },
    filterChange: function () {
        this.props.FilterChange(this.Filter.value);
    }
});