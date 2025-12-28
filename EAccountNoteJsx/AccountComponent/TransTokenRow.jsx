var TransTokenRow = React.createClass({
    getInitialState: function () {
        return {
            TriggerDelete: false
        };
    },
    render: function () {
        return (
            <div className="listItem6">
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Name:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Entity.TokenName}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Value:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Entity.TokenValue}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Weight:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Entity.TokenWeight}
                    </div>
                    <div className="col col-xs-6 paddingL5 textAlignR">
                        {!this.state.TriggerDelete &&
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
        this.props.ActionOnItemDelete(this.props.Entity);
    },
    actionOnDeleteCancel: function () {
        this.setState({ TriggerDelete: false }); 
    },
});