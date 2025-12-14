var ListHeader = React.createClass({
    render: function() {
        var className = "glyphicon  glyphicon-" + (this.props.ItemSelMode? "chevron-left" : "home");
        return (
            <div className="panel-heading">
                <button className="btn btn-primary" style={{ marginRight: 7 }} onClick={this.props.ShowNextComponent}>
                    <span className={className} />
                </button>
                {this.props.Title}
                <span style={{ position: "absolute", top: 17, right: 10 }}>
                    <span className="glyphicon glyphicon-th" />
                    <span className="urlTitle" >{_LoginAccount.OrgName}</span>
                </span>
            </div>
        );
    },
});