var PayBillRow = React.createClass({
    render: function() {
        return (
            <div className={this.getCSSClass()} onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Bill No.
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.BillNo}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {getFormattedDate(this.props.Item.BillDt)}
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
                        Remark
                    </div>
                    <div className="col col-xs-9 paddingL5 fontWeightB">
                        {this.props.Item.Remark}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Amount
                    </div>
                    <div className="col col-xs-3 paddingL5 colorBlue fontWeightB">
                        {this.props.Item.Amount}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Paid
                    </div>
                    <div className="col col-xs-3 paddingL5 colorGreen fontWeightB">
                        {this.props.Item.PaidAmount}
                    </div>
                </div>
                {
                    !this.isPaymentComplete() &&
                    <div className="row">
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Pending
                        </div>
                        <div className="col col-xs-4 paddingL5 fontWeight900 colorRed fontSizeLr">
                            {this.props.Item.Amount - this.props.Item.PaidAmount}
                        </div>
                    </div>

                }
            </div>
        );
    },
    getCSSClass: function() {
        return this.isPaymentComplete()? "listItem3" : "listItem2";
    },
    isPaymentComplete: function() {
        return this.props.Item.Amount == this.props.Item.PaidAmount;
    },
    actionOnItemSelect: function() {
        if (this.props.Item.Amount > this.props.Item.PaidAmount) {
            this.props.ActionOnItemSelect(this.props.Item);
        }
    },
});