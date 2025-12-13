var ChargeAccountRow = React.createClass({
    getInitialState: function () {
        return { 
            TriggerDelete: false
        };
    },
    render: function() {
        return(
            <div className="listItem0">
                <div className="row">
                    <div className="col-xs-6">
                        <span>
                            <span className="badge badge-dark" style={{ marginRight: 4 }}>{this.props.SrNo}</span>
                        </span>
                        {this.props.Account.AccountName}
                    </div>
                    <div className="col-xs-2" style={{ textAlign: "right" }}>
                        {this.props.Account.Amount}
                    </div>
                    <div className="col-xs-2" style={{ textAlign: "right" }}>
                        {this.props.Account.PaidAmount}
                    </div>
                    <div className="col-xs-2">
                        {!this.state.TriggerDelete && this.props.Account.Amount != this.props.Account.PaidAmount &&
                            <span className="glyphicon glyphicon-trash" style={{ color: "red" }} onClick={this.actionOnDelete} aria-hidden="true" />
                        }
                        {this.state.TriggerDelete &&
                            <span className="glyphicon glyphicon-ok paddingR5" style={{ color: "green" }} onClick={this.actionOnDeleteConfirm} aria-hidden="true" />
                        }
                        {this.state.TriggerDelete &&
                            <span className="glyphicon glyphicon-remove" style={{ color: "orange" }} onClick={this.actionOnDeleteCancel} aria-hidden="true" />
                        }
                    </div>
                </div>
            </div>
        );
    },
    actionOnDelete: function () {
        this.setState({ TriggerDelete: true });
    },
    actionOnDeleteConfirm: function () {
        this.props.Remove(this.props.Account)
        this.setState({ TriggerDelete: false });
    },
    actionOnDeleteCancel: function () {
        this.setState({ TriggerDelete: false });
    }
});