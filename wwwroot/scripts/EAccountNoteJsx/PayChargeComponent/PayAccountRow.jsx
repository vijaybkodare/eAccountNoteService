var PayAccountRow = React.createClass({
    render: function() {
        return (
            <div className={this.getCSSClass()} onClick={this.actionOnItemSelect}>
                <div className="row">
                    <div className="col-xs-8">
                        <span>
                            <span className="badge badge-dark" style={{ marginRight: 4 }}>{this.props.SrNo}</span>
                        </span>
                        {this.props.Item.AccountName}
                    </div>
                    <div className="col-xs-4" style={{ textAlign: "right" }}>
                        {this.props.Item.PendingAmount}
                    </div>
                </div>
            </div>
        );
    },
    getCSSClass: function() {
        return this.props.Item.PendingAmount == 0? "listItem3" : "listItem2";
    },
    actionOnItemSelect: function() {
        this.props.ActionOnItemSelect(this.props.Item);
    },
});