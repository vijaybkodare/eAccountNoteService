var AddRevertCummChargeTrans = React.createClass({
    getInitialState: function () {
        return{
            Entity: {},
        };
    },
    render: function() {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.actionOnBack} Title="Revert Charge Pay Trans" />
                <div className="panel-body">
                <div className="row fontSizeSr">
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Account
                        </div>
                        <div className="col col-xs-2 paddingL5 fontWeightB">
                            {this.state.Entity.DrAccount}
                        </div>
                        <div className="col col-xs-2 paddingR5 textAlignR">
                            Date
                        </div>
                        <div className="col col-xs-5 paddingL5">
                            {getFormattedDate2(this.state.Entity.AddedDt)}
                        </div>
                    </div>
                    <div className="row fontSizeSr">
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            CR Account
                        </div>
                        <div className="col col-xs-9 paddingL5">
                            {this.state.Entity.CrAccount}
                        </div>
                    </div>
                    <div className="row fontSizeSr">
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Trans ID
                        </div>
                        <div className="col col-xs-9 paddingL5 fontWeightB">
                            {this.state.Entity.TransactionId}
                        </div>
                    </div>
                    <div className="row fontSizeSr">
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Amount
                        </div>
                        <div className="col col-xs-9 paddingL5 fontWeightB">
                            {this.state.Entity.Amount}
                        </div>
                    </div>
                    <div className="row fontSizeSr">
                        <div className="col col-xs-3 paddingR5 textAlignR">
                            Remark
                        </div>
                        <div className="col col-xs-9">
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
        var urlParams = "?id=" + this.state.Entity.CummulativeChargePayTransId;
        _ProgressBar.IMBusy();
        ajaxGet('RevertTrans/revertCummulativeChargeTrans' + urlParams, function(data){
            _ProgressBar.IMDone();
            if(data.IsSuccess){
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
});