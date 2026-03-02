var ChargeTransMapChargeRow = React.createClass({
    render: function () {
        return (
            <div className={this.getCSSClass()} onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Source:
                    </div>
                    <div className="col col-xs-2 paddingL5">
                        {this.props.Item.Source}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-4 paddingL5 fontWeightB" >
                        {getFormattedDate(this.props.Item.AddedDt)}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Account:
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {this.props.Item.AccountName}
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
                    <div className="col col-xs-2 paddingR5 textAlignR">
                        Trans Id:
                    </div>
                    <div className="col col-xs-4 paddingL5 fontWeightB">
                        {this.props.Item.TransactionId}
                    </div>
                </div>
            </div>
        );
    },
    getCSSClass: function () {
        return this.props.Item.Selected ? "listItem6Sel" : "listItem6";
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    },
});
