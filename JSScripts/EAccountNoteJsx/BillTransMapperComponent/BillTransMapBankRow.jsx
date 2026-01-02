var BillTransMapBankRow = React.createClass({
    getInitialState: function () {
        return {
            
        };
    },
    render: function () {
        return (
            <div className={this.getCSSClass()} onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Trans Date
                    </div>
                    <div className="col col-xs-3 fontWeightB paddingL5">
                        {getFormattedDate(this.props.Item.TransDt)}
                    </div>
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Amount
                    </div>
                    <div className="col col-xs-3 fontWeightB paddingL5">
                        {this.props.Item.Amount}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 textAlignR paddingR5">
                        Remark
                    </div>
                    <div className="col col-xs-9 paddingL5">
                        {this.props.Item.Remark}
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