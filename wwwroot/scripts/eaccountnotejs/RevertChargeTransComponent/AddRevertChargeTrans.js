var AddRevertChargeTrans = React.createClass({
    displayName: "AddRevertChargeTrans",

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
            React.createElement(AddEditHeader, { ShowList: this.actionOnBack, Title: "Revert Charge Pay Trans" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Account"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-2 paddingL5 fontWeightB" },
                        this.state.Entity.DrAccount
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-2 paddingR5 textAlignR" },
                        "Order"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-5 paddingL5" },
                        React.createElement(
                            "span",
                            { className: "fontWeightB" },
                            this.state.Entity.ChargeOrderNo
                        ),
                        "  \xA0",
                        getFormattedDate2(this.state.Entity.PaymentDt)
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Item"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9 paddingL5 fontWeightB" },
                        this.state.Entity.ItemName
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Account"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9 paddingL5" },
                        this.state.Entity.CrAccount
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Trans ID"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9 paddingL5 fontWeightB" },
                        this.state.Entity.TransactionId
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Amount"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9 paddingL5 fontWeightB" },
                        this.state.Entity.Amount
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-3 paddingR5 textAlignR" },
                        "Remark"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-9" },
                        this.state.Entity.Remark
                    )
                )
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
        var urlParams = "?id=" + this.state.Entity.ChargePayTransId;
        _ProgressBar.IMBusy();
        ajaxGet('RevertTrans/revertChargeTrans' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    }
});