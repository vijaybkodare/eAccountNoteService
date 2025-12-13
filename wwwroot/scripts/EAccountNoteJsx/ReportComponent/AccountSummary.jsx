var AccountSummary = React.createClass({
    getInitialState: function () {
        return {
            Entity: {
                TotalChargeUnpaid: 0,
                TotalBillUnpaid: 0,
                TotalBalance: 0
            },
        };
    },
    render: function() {
        return (
            <div className="listItem5">
                <div className="row">
                    <div className="col-xs-6 textAlignR fontWeightB fontSizeS">
                        Pending Charges:
                    </div>
                    <div className="col-xs-4 textAlignR fontWeightB fontSizeL colorRed">
                        {numberWithCommas(this.state.Entity.TotalChargeUnpaid)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 textAlignR fontWeightB fontSizeS">
                        Pending Bills:
                    </div>
                    <div className="col-xs-4 textAlignR fontWeightB fontSizeL colorOrange">
                        {numberWithCommas(this.state.Entity.TotalBillUnpaid)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 textAlignR fontWeightB fontSizeS">
                        Balance:
                    </div>
                    <div className="col-xs-4 textAlignR fontWeightB fontSizeL colorGreen">
                        {numberWithCommas(this.state.Entity.TotalBalance)}
                    </div>
                </div>
            </div>
        );
    },
    updateEntity: function (entity) {
        this.setState({
            Entity: entity
        });
    }
});