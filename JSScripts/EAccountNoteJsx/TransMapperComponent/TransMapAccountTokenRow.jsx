var TransMapAccountTokenRow = React.createClass({
    getInitialState: function () {
        return {

        };
    },
    render: function () {
        return (
            <div className={this.getCSSClass()}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Name:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.TokenName}
                    </div>
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Value:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.TokenValue}
                    </div>
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Weight:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.TokenWeight}
                    </div>
                </div>
            </div>
        );
    },
    getCSSClass: function () {
        return this.props.Item.IsMatch ? "listItem6Sel" : "listItem6";
    },
});