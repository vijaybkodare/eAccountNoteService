var ChargeRow = React.createClass({
    render: function() {
        return (
            <div className="listItem1" onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Order No:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.ChargeOrderNo}
                    </div> 
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-4 paddingL5">
                        {getFormattedDate(this.props.Item.ChargeDt)}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR fontWeightB">
                        Item:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.ItemName}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Account:
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {this.props.Item.AccountName}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Charges:
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {this.props.Item.Charges} * {this.props.Item.Amount / this.props.Item.Charges}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Paid / Total:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                         {this.props.Item.PaidAmount} / {this.props.Item.Amount}
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