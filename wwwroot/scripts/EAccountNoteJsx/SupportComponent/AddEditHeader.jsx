var AddEditHeader = React.createClass({
    render: function() {
        return (
            <div className="panel-heading">
                <button className="btn btn-primary" onClick={this.props.ShowList}>
                    <span className="glyphicon glyphicon-chevron-left" />
                </button> &nbsp;
                {this.props.Title}
                <span style={{ position: "absolute", top: 17, right: 10 }}>
                    <span className="glyphicon glyphicon-th" />
                    <span className="urlTitle" >{_LoginAccount.OrgName}</span>
                </span>
            </div>
        );
    },
});