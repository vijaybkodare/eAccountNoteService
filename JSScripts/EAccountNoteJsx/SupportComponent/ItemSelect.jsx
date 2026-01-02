var ItemSelect = React.createClass({
    render: function() {
        return (
            <div className="input-group" style={{ marginBottom: 3 }}>
                <input ref={function (node) { this.SelItem = node; }.bind(this)} type="text" className="form-control" disabled={true} value={this.props.ItemText} onChange={this.inputChange} />
                <span className="input-group-btn">
                    <button type="button" className="btn btn-danger" onClick={this.props.ClearItemSelect}>
                        <span className="glyphicon glyphicon-remove"/>
                    </button>
                    <button type="button" className="btn btn-primary" onClick={this.props.GoForItemSelect}>
                        <span className="glyphicon glyphicon-list-alt" style={{ marginRight: 7 }} />
                        Select
                    </button>
                </span>
            </div>
        );
    },
    inputChange: function(){
        this.props.ItemChange(this.SelItem.value);
    },
});