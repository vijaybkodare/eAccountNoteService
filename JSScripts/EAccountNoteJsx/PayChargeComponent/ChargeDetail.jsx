var ChargeDetail = React.createClass({
    render: function () {
        return (
            <div className="listItem6Sel fontSizeS">
                <div className="row">
                    <div className="col col-xs-6 paddingR5 textAlignR">
                        Account:
                    </div>
                    <div className="col col-xs-6 paddingL5 fontWeightB">
                        {this.props.Entity.AccountName}
                    </div>
                </div>
                {
                    this.props.Entity.ChargePayeeDetailIds.length == 1 &&
                    <div>
                        <div className="row fontSizeSr">
                            <div className="col col-xs-2 textAlignR paddingR5">
                                Order:
                            </div>
                            <div className="col col-xs-4 paddingL5">
                                <span className="fontWeightB">{this.props.Entity.ChargeItem.ChargeOrderNo}</span>  &nbsp; {getFormattedDate(this.props.Entity.ChargeItem.ChargeDt)}
                            </div>
                            <div className="col col-xs-2 textAlignR paddingR5">
                                Item:
                            </div>
                            <div className="col col-xs-4 fontWeightB paddingL5">
                                {this.props.Entity.ChargeItem.ItemName}
                            </div>
                        </div>
                        <div className="row fontSizeSr">
                            <div className="col col-xs-5 textAlignR paddingR5">
                                Remark:
                            </div>
                            <div className="col col-xs-7 fontWeightB paddingL5">
                                {this.props.Entity.ChargeItem.Remark}
                            </div>
                        </div>
                    </div>
                }
                
                <div className="row">
                    <div className="col col-xs-6 paddingR5 textAlignR">
                        Pending Amount:
                    </div>
                    <div className="col col-xs-6 paddingL5 fontWeightB fontSizeLr colorRed">
                        {this.props.Entity.Amount}
                    </div>
                </div>
            </div>
        );
    },
});