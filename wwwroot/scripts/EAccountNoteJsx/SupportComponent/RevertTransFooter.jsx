var RevertTransFooter = React.createClass({
    render: function() {
        return (
            <div className="panel-footer text-center">
                <button type="button" className="btn btn-danger" onClick={this.props.Revert}>Revert</button>
            </div>
        );
    },
});