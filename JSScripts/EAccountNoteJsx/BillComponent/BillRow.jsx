var BillRow = React.createClass({
    render: function() {
        return (
            <div className="listItem6" onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Order No:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.BillNo}
                    </div> 
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-4 paddingL5">
                        {getFormattedDate(this.props.Item.BillDt)}
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
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Amount:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.Amount}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        Paid:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.PaidAmount}
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
                {
                    this.props.Item.FilePath &&
                    <div className="row fontSizeSr">
                        <div className="col col-xs-3  paddingR5 textAlignR">
                            Bill:
                        </div>
                            <div className="col col-xs-9 paddingL5">
                                <a href={this.props.Item.FilePath} className="a2" onClick={(e) => e.stopPropagation()} target="_blank">View Bill</a>
                        </div>
                    </div>
                }
            </div>
        );
    },
    actionOnItemSelect: function(){
        this.props.ActionOnItemSelect(this.props.Item);
    },
});