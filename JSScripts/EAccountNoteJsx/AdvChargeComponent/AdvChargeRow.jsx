var AdvChargeRow = React.createClass({
    render: function() {
        return (
            <div className="listItem4" style={{backgroundColor: getBGColorByStatus(this.props.Item.Status)}} onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Order No:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.AdvChargeNo}
                    </div> 
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-4 paddingL5">
                        {getFormattedDate(this.props.Item.AdvChargeDt)}
                    </div>
                </div>

                <div className="row fontSizeSr">
                <div className="col col-xs-4  paddingR5 textAlignR fontWeightB">
                        DR Account:
                    </div>
                    <div className="col col-xs-8 paddingL5 fontWeightB">
                        {this.props.Item.DrAccount}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-4  paddingR5 textAlignR fontWeightB">
                        Item:
                    </div>
                    <div className="col col-xs-8 paddingL5 fontWeightB">
                        {this.props.Item.ItemName}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-4  paddingR5 textAlignR">
                        CR Account:
                    </div>
                    <div className="col col-xs-8 paddingL5">
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
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Pending:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.Amount - this.props.Item.SettleAmount}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-4  paddingR5 textAlignR">
                        Transaction ID:
                    </div>
                    <div className="col col-xs-8 paddingL5 fontWeightB">
                        {this.props.Item.TransactionId}
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