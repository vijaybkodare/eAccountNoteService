var AccountTransTokenItemRow = React.createClass({
    getInitialState: function () {
        return {
            
        };
    },
    render: function () {
        return (
            
                <div className="row fontSizeSr">
                    <div className="col col-xs-2">
                        
                    </div>
                    <div className="col col-xs-4">
                        {this.props.Entity.TokenName}
                    </div>
                    <div className="col col-xs-4">
                        {this.props.Entity.TokenValue}
                    </div>
                    <div className="col col-xs-2">
                        {this.props.Entity.TokenWeight}
                    </div>
                </div>
            
        );
    },
});