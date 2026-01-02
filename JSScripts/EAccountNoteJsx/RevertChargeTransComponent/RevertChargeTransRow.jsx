var RevertChargeTransRow = React.createClass({
    render: function() {
        return (
            <div className="listItem6" onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Account
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.DrAccount}
                    </div>
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Order
                    </div>
                    <div className="col col-xs-5 paddingL5">
                        <span className="fontWeightB">{this.props.Item.ChargeOrderNo}</span>  &nbsp;
                        {getFormattedDate(this.props.Item.PaymentDt)}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Item
                    </div>
                    <div className="col col-xs-9 paddingL5 fontWeightB">
                        {this.props.Item.ItemName}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Account
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {this.props.Item.CrAccount}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Trans ID
                    </div>
                    <div className="col col-xs-9 paddingL5 fontWeightB">
                        {this.props.Item.TransactionId}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Amount
                    </div>
                    <div className="col col-xs-9 paddingL5 fontWeightB">
                        {this.props.Item.Amount}
                    </div>
                </div>
            </div>
        );
    },
    actionOnItemSelect: function(){
        this.props.ActionOnItemSelect(this.props.Item);
    },
});