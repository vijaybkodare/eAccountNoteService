var AddRevertBillTrans = React.createClass({
    getInitialState: function () {
        return{
            Entity: {},
        };
    },
    render: function() {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.actionOnBack} Title="Revert Bill Pay Trans" />
                <div className="panel-body">
                <div className="row fontSizeSr">
                    <div className="col col-xs-4 paddingR5 textAlignR">
                        Bill No.
                    </div>
                    <div className="col col-xs-8 paddingL5 fontWeightB">
                        {this.state.Entity.BillNo}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-4 paddingR5 textAlignR">
                        Date
                    </div>
                    <div className="col col-xs-8 paddingL5">
                        {getFormattedDate(this.state.Entity.BillDt)}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-4 paddingR5 textAlignR">
                        Item
                    </div>
                    <div className="col col-xs-8 paddingL5 fontWeightB">
                        {this.state.Entity.ItemName}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-4 paddingR5 textAlignR">
                        Amount
                    </div>
                    <div className="col col-xs-8 paddingL5 colorBlue fontWeightB">
                        {this.state.Entity.Amount}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-4 paddingR5 textAlignR">
                        Transaction ID:
                    </div>
                    <div className="col col-xs-8 paddingL5 fontWeightB">
                        {this.state.Entity.TransactionId}
                    </div>
                </div>
                <div className="row fontSizeSr">
                    <div className="col col-xs-4 paddingR5 textAlignR">
                        Remark:
                    </div>
                    <div className="col col-xs-8 paddingL5 fontWeightB">
                        {this.state.Entity.Remark}
                    </div>
                </div>
                </div>
                <RevertTransFooter Revert={this.revert}/>
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function(item){
        this.props.HideAll();
        this.updateEntity(item);
        this.show();
    },
    updateEntity: function (entity) {
        this.setState({
            Entity: entity,
        });
    },
    actionOnBack: function(){
        this.props.ShowList();
    },
    revert: function () {
        var urlParams = "?id=" + this.state.Entity.BillPayTransId;
        _ProgressBar.IMBusy();
        ajaxGet('RevertTrans/revertBillTrans' + urlParams, function(data){
            _ProgressBar.IMDone();
            if(data.IsSuccess){
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
});