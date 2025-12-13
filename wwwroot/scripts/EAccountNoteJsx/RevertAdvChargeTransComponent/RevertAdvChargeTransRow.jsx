var RevertAdvChargeTransRow = React.createClass({
    render: function() {
        return (
            <div className="listItem4" onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-4 paddingR5 textAlignR">
                        Order No:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.AdvChargeNo}
                    </div> 
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {getFormattedDate2(this.props.Item.AdvChargeDt)}
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
                    <div className="col col-xs-4  paddingR5 textAlignR">
                        Amount:
                    </div>
                    <div className="col col-xs-8 paddingL5 fontWeightB">
                        {this.props.Item.Amount}
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
            </div>
        );
    },
    actionOnItemSelect: function(){
        this.props.ActionOnItemSelect(this.props.Item);
    },
});