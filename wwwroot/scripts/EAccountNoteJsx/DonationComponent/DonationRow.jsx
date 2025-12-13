var DonationRow = React.createClass({
    render: function () {
        let rowClassName = this.props.RowClassName ? this.props.RowClassName : "listItem6";
        return (
            <div className={rowClassName} onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Donation No:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.DonationNo}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-4 paddingL5">
                        {getFormattedDate3(this.props.Item.DonationDt)}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-2  paddingR5 textAlignR fontWeightB">
                        Item:
                    </div>
                    <div className="col col-xs-4 paddingL5 fontWeightB">
                        {this.props.Item.ItemName}
                    </div>
                    <div className="col col-xs-2  paddingR5 textAlignR">
                        Account:
                    </div>
                    <div className="col col-xs-4 paddingL5">
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
                        Total Amount:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {this.props.Item.TotalAmount}
                    </div>
                </div>
            </div>
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    },
});