var ItemRow = React.createClass({
    render: function() {
        return (
            <div className="listItem" onClick={this.actionOnItemSelect}>
                <div className="row">
                    <div className="col col-xs-6">
                        <span className="badge badge-dark" style={{ marginRight: 4 }}>{this.props.SrNo}</span>
                        {this.props.Item.ItemName}
                    </div>
                    <div className="col col-xs-6">
                        {this.props.Item.AccountName}
                    </div>
                </div>
            </div>
        );
    },
    actionOnItemSelect: function(){
        this.props.ActionOnItemSelect(this.props.Item);
    },
});