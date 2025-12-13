var AccountTransTokenRow = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    render: function () {
        return (
            <div className="listItem" onClick={this.actionOnItemSelect}>
                <div className="row">
                    <div className="col-xs-7">
                        <span className="badge badge-dark" style={{ marginRight: 4 }}>{this.props.SrNo}</span>
                        {this.props.AccountDto.accountMaster.AccountName}
                    </div>
                </div>
                <div className="row">
                    {
                        this.props.AccountDto.accountTransTokens.map(function (token) {
                            return (
                                <AccountTransTokenItemRow
                                    Entity={token}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    },
    actionOnItemSelect: function () {
        this.props.ActionOnItemSelect(this.props.AccountDto.accountMaster);
    },
});