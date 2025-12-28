var UserRow = React.createClass({
    render: function() {
        return (
            <div className="listItem" onClick={this.actionOnItemSelect}>
                <div className="row">
                    <div className="col col-xs-6">
                        <span>
                            <span className="badge badge-dark" style={{ marginRight: 4 }}>{this.props.SrNo}</span>
                            <span className="glyphicon glyphicon-user" style={{ marginRight: 7 }}></span>
                        </span>
                        {this.props.Item.UserName}
                    </div>
                    <div className="col col-xs-6">
                        {this.props.Item.MobileNo}
                    </div>
                </div>
            </div>
        );
    },
    actionOnItemSelect: function(){
        this.props.ActionOnItemSelect(this.props.Item);
    },
});