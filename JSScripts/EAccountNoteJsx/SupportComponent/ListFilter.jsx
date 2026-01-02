var ListFilter = React.createClass({
    render: function() {
        var className = this.props.ShowAdd != null ? "input-group" : "";
        var filterText = this.props.FilterText ? this.props.FilterText : "Filter by Item name";
        return (
            <div className={className} style={{ marginBottom: 3 }}>
                <input ref={function (node) { this.Filter = node; }.bind(this)} type="text" className="form-control" placeholder={filterText} onChange={this.filterChange} />
            </div>
        );
    },
    filterChange: function(){
       this.props.FilterChange(this.Filter.value);
    }
});