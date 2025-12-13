var RevertBillTransRow = React.createClass({
    render: function() {
        return (
            <div className="listItem4" onClick={this.actionOnItemSelect}>
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
                        Amount
                    </div>
                    <div className="col col-xs-9 paddingL5 fontWeightB">
                        {this.props.Item.Amount}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Remark
                    </div>
                    <div className="col col-xs-9 paddingL5 fontWeightB">
                        {this.props.Item.BillRemark}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-4 paddingR5 textAlignR">
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