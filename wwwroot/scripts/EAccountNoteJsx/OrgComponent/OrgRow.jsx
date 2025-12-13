var OrgRow = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    render: function () {
        return (
            <div className={this.props.Selected ? "listItemSelected" : "listItem"} onClick={this.actionOnItemSelect}>
                <div className="row">
                    <div className="col-xs-6">
                        <span className="badge badge-dark" style={{ marginRight: 4 }}>{this.props.SrNo}</span>
                        {this.props.Item.OrgName}
                    </div>
                    <div className="col-xs-6">
                        {getAccountType(this.props.Item.Address)}
                    </div>
                </div>
            </div>
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    },
});