var AddRevertBillTrans = React.createClass({
    displayName: "AddRevertBillTrans",

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
            React.createElement(AddEditHeader, { ShowList: this.actionOnBack, Title: "Revert Bill Pay Trans" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 paddingR5 textAlignR" },
                        "Bill No."
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-8 paddingL5 fontWeightB" },
                        this.state.Entity.BillNo
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 paddingR5 textAlignR" },
                        "Date"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-8 paddingL5" },
                        getFormattedDate(this.state.Entity.BillDt)
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 paddingR5 textAlignR" },
                        "Item"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-8 paddingL5 fontWeightB" },
                        this.state.Entity.ItemName
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 paddingR5 textAlignR" },
                        "Amount"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-8 paddingL5 colorBlue fontWeightB" },
                        this.state.Entity.Amount
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 paddingR5 textAlignR" },
                        "Transaction ID:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-8 paddingL5 fontWeightB" },
                        this.state.Entity.TransactionId
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row fontSizeSr" },
                    React.createElement(
                        "div",
                        { className: "col col-xs-4 paddingR5 textAlignR" },
                        "Remark:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col col-xs-8 paddingL5 fontWeightB" },
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
        var urlParams = "?id=" + this.state.Entity.BillPayTransId;
        _ProgressBar.IMBusy();
        ajaxGet('RevertTrans/revertBillTrans' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                this.props.ShowList();
            } else {
                _Alert.showWarning(data.Error, 2000);
            }
        }.bind(this));
    }
});