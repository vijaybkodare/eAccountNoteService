var AddRevertAdvChargeTrans = React.createClass({
    getInitialState: function () {
        return{
            Entity: {},
        };
    },
    render: function() {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)} className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.actionOnBack} Title="Revert Adv Trans" />
                <div className="panel-body">
                    <AdvChargeRow Item={this.state.Entity} />
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
        var urlParams = "?id=" + this.state.Entity.AdvChargeId;
        _ProgressBar.IMBusy();
        ajaxGet('RevertTrans/revertAdvChargeTrans' + urlParams, function(data){
            _ProgressBar.IMDone();
            if(data.IsSuccess){
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    },
});