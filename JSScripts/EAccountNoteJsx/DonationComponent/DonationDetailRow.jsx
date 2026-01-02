var DonationDetailRow = React.createClass({
    render: function () {
        return (
            <div className="listItem6">
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {getFormattedDate3(this.props.Item.PaymentDt)}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Transaction #:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
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
                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Amount:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.Amount}
                    </div>
                </div>
            </div>
        );
    },
});