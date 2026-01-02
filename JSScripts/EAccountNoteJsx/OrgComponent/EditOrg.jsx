var EditOrg = React.createClass({
    getInitialState: function () {
        return {
            AllowDelete: false,
            NotValidInput: true,
            Entity: { OrgId: -1, OrgName: '', Address: '' },
        };
    },
    render: function () {
        return (
            <div ref={function (node) { this.Component = node; }.bind(this)}
                className="panel panel-EAccNotePrim">
                <AddEditHeader ShowList={this.props.ShowList} Title="Edit Organization" />
                <div className="panel-body">
                    <form>
                        <div className="form-group">
                            <label className="mandatory">Organization</label>
                            <input ref={function (node) { this.OrgName = node; }.bind(this)}
                                type="text" className="form-control" placeholder="Organization Name" onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label className="mandatory">Address</label>
                            <input ref={function (node) { this.Address = node; }.bind(this)}
                                type="text" className="form-control" placeholder="Address" onChange={this.inputChange} />
                        </div>
                    </form>
                </div>
                <AddEditFooter AllowDelete={this.state.AllowDelete} Delete={this.delete} Clear={this.clear} Save={this.save} NotValidInput={this.state.NotValidInput} />
            </div>
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item) {
        _Main.EAccountHome.hideAll();
        this.show();
        this.updateEntity(item);
    },
    showMe2: function () {
        _Main.EAccountHome.hideAll();
        this.show();
        this.updateEntity({ OrgId: _LoginAccount.OrgId, OrgName: _LoginAccount.OrgName, Address: _LoginAccount.Address });
    },
    inputChange: function () {
        this.setState({
            NotValidInput: this.OrgName.value.length == 0 ||
                this.Address.value.length == 0
        });
    },
    updateEntity: function (item) {
        this.OrgName.value = item.OrgName;
        this.Address.value = item.Address;
        this.setState({
            Entity: item,
            NotValidInput: false
        });
    },
    save: function () {
        var entity = {
            OrgId: this.state.Entity.OrgId,
            OrgName: this.OrgName.value,
            Address: this.Address.value,
        }
        _ProgressBar.IMBusy();
        axiosPost('api/Org/update', entity, function (data) {
            _ProgressBar.IMDone();
            if (data) {
                this.props.ShowList();
            }
            else {
                _Alert.showWarning(data.Error, 5000);
            }
        }.bind(this));
    },

});