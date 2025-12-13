var JVRow = React.createClass({
    render: function() {
        return (
            <div className="listItem1" onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        JV No:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.JVOrderNo}
                    </div> 
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-4 paddingL5">
                        {getFormattedDate(this.props.Item.AddedDt)}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR fontWeightB">
                        DR Account:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.DrAccount}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        CR Account:
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {this.props.Item.CrAccount}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Amount:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.Amount}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Remark:
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {this.props.Item.Remark}
                    </div>
                </div>
            </div>
        );
    },
    actionOnItemSelect: function(){
        this.props.ActionOnItemSelect(this.props.Item);
    },
});