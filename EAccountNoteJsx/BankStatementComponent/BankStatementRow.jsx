var BankStatementRow = React.createClass({
    render: function () {
        return (
            <div className="listItem6" onClick={this.actionOnItemSelect}>
                <div className="row fontSizeSr">
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Order No:
                    </div>
                    <div className="col col-xs-2 paddingL5 fontWeightB">
                        {this.props.Item.BankStatementNo}
                    </div>
                    <div className="col col-xs-3 paddingR5 textAlignR">
                        Date:
                    </div>
                    <div className="col col-xs-4 paddingL5">
                        {getFormattedDate(this.props.Item.AddedDt)}
                    </div>
                </div>

                <div className="row fontSizeSr">
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        From Date:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {getFormattedDate(this.props.Item.FromDt)}
                    </div>
                    <div className="col col-xs-3  paddingR5 textAlignR">
                        To Date:
                    </div>
                    <div className="col col-xs-3 paddingL5 fontWeightB">
                        {getFormattedDate(this.props.Item.ToDt)}
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
            </div>
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.Item);
    },
});