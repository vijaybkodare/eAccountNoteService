var BillTransMapBillRow = React.createClass({
    render: function() {
        return (
            <div className={this.getCSSClass()} onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Order No:
                    </div>
                    <div className="col col-xs-2 paddingL5">
                        {this.props.Item.BillNo}
                    </div> 
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-4 paddingL5 fontWeightB" >
                        {getFormattedDate(this.props.Item.BillDt)}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Account:
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {this.props.Item.CrAccount}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Item:
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {this.props.Item.ItemName}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Remark:
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {this.props.Item.BillRemark}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Bill Amount:
                    </div>
                    <div className="col col-xs-3 paddingL5">
                        {this.props.Item.BillAmount}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Paid:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.Amount}
                    </div>
                </div>
            </div>
        );
    },
    getCSSClass: function () {
        return this.props.Item.Selected ? "listItem6Sel" : "listItem6";
    },
    actionOnItemSelect: function(){
        this.props.ActionOnItemSelect(this.props.Item);
    },
});