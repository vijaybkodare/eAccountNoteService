var AddRevertAdvChargeTrans = React.createClass({
    displayName: "AddRevertAdvChargeTrans",

    getInitialState: function () {
        return {
            Entity: {}
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.actionOnBack, Title: "Revert Adv Trans" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(AdvChargeRow, { Item: this.state.Entity })
            ),
            React.createElement(RevertTransFooter, { Revert: this.revert })
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item) {
        this.props.HideAll();
        this.updateEntity(item);
        this.show();
    },
    updateEntity: function (entity) {
        this.setState({
            Entity: entity
        });
    },
    actionOnBack: function () {
        this.props.ShowList();
    },
    revert: function () {
        var urlParams = "?id=" + this.state.Entity.AdvChargeId;
        _ProgressBar.IMBusy();
        ajaxGet('RevertTrans/revertAdvChargeTrans' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    }
});