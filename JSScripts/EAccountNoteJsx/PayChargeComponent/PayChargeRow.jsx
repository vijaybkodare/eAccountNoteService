var PayChargeRow = React.createClass({
    getInitialState: function () {
        return {
            Selected: true,
        };
    },
    render: function() {
        return (
            <div className={this.getCSSClass()} onClick={this.actionOnSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Account
                    </div>
                    <div className="col col-xs-2 fontWeightB paddingL5">
                        {this.props.Item.AccountName}
                    </div>
                    <div className="col col-xs-2 textAlignR paddingR5">
                        Order
                    </div>
                    <div className="col col-xs-5 paddingL5">
                        <span className="fontWeightB">{this.props.Item.ChargeOrderNo}</span>  &nbsp; {getFormattedDate(this.props.Item.ChargeDt)}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Item
                    </div>
                    <div className="col col-xs-9 fontWeightB paddingL5">
                        {this.props.Item.ItemName}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Remark
                    </div>
                    <div className="col col-xs-9 fontWeightB paddingL5">
                        {this.props.Item.Remark}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Amount
                    </div>
                    <div className="col col-xs-3 fontWeightB textAlignL paddingL5 colorBlue">
                        {this.props.Item.Amount}
                    </div>
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Paid
                    </div>
                    <div className="col col-xs-3 fontWeightB paddingL5 colorGreen">
                        {this.props.Item.PaidAmount}
                    </div>
                </div>
                {
                    !this.isPaymentComplete() &&
                    <div className="row">
                        <div>
                            <div className="col col-xs-3 textAlignR paddingR5">
                                Pending
                            </div>
                            <div className="col col-xs-6 paddingL5 colorRed fontSizeLr fontWeight900">
                                {this.props.Item.Amount - this.props.Item.PaidAmount}
                                </div>
                                {this.props.Item.Selected && <div className="col col-xs-3 textAlignR selIcon">
                                    <span className="glyphicon glyphicon-ok-circle" />
                                </div>}
                                {!this.props.Item.Selected && <div className="col col-xs-3 textAlignR nonSelIcon">
                                    <span className="glyphicon glyphicon-ok-circle" />
                                </div>}
                        </div>
                    </div>
                }
            </div>
        );
    },
    getCSSClass: function () {
        return this.props.Item.Selected ? "listItem6Sel" : "listItem6";
    },
    isPaymentComplete: function() {
        return this.props.Item.Amount == this.props.Item.PaidAmount;
    },
    actionOnSelect: function() {
        this.props.ActionOnItemSelect(this.props.Item);
    },
});