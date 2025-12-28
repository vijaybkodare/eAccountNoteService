var AddEditFooter = React.createClass({
    render: function() {
        let allowClear = typeof(this.props.AllowClear) == "undefined"? true : this.props.AllowClear;
        let allowDelete = typeof(this.props.AllowDelete) == "undefined"? false : this.props.AllowDelete;
        return (
            <div className="panel-footer text-center">
                <div className="btn-group" role="group">
                    {
                        this.props.AllowDelete && <button type="button" className="btn btn-danger" onClick={this.props.Delete}>Delete</button>
                    }
                    {
                        this.props.AllowClear && <button type="button" className="btn btn-warning" onClick={this.props.Clear}>Clear</button>
                    }
                    <button type="button" className="btn btn-success" disabled={this.props.NotValidInput} onClick={this.props.Save}>Save</button>
                </div>
            </div>
        );
    },
});