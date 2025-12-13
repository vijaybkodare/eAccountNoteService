var AddDonation = React.createClass({
    displayName: "AddDonation",

    getInitialState: function () {
        return {
            Entity: { DonationHeaderId: -1, ItemId: -1, AccountId: -1, TotalAmount: 0 }
        };
    },
    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Component = node;
                }.bind(this), className: "panel panel-EAccNotePrim" },
            React.createElement(AddEditHeader, { ShowList: this.props.ShowList, Title: "Add/Edit Donation" }),
            React.createElement(
                "div",
                { className: "panel-body" },
                this.state.Entity.DonationHeaderId == -1 ? React.createElement(DonationHeaderEntry, { ref: function (node) {
                        this.DonationHeaderEntry = node;
                    }.bind(this),
                    Entity: this.state.Entity,
                    ShowAddDonation: this.props.ShowAddDonation,
                    ShowItemList: this.props.ShowItemList,
                    ShowList: this.props.ShowList }) : React.createElement(DonationDetailList, {
                    Entity: this.state.Entity,
                    ShowAddDonationDetail: this.props.ShowAddDonationDetail
                })
            )
        );
    },
    componentDidMount: function () {
        setComponent(this);
    },
    showMe: function (item, itemType) {
        _Main.EAccountHome.hideAll();
        this.show();
        if (itemType == 0 || itemType == 1) {
            this.updateEntity(item);
        }
        if (itemType == 22) {
            this.DonationHeaderEntry.updateItem(item);
        }
    },
    updateEntity: function (entity) {
        if (entity == null || typeof entity == "undefined" || typeof entity.DonationHeaderId == "undefined") {
            entity = { DonationHeaderId: -1 };
        }
        this.getRecord(entity);
    },
    getRecord: function (entity) {
        var urlParams = "?id=" + entity.DonationHeaderId + '&orgId=' + _LoginAccount.OrgId;
        _ProgressBar.IMBusy();
        ajaxGet('api/Donation/entity' + urlParams, function (data) {
            _ProgressBar.IMDone();
            if (entity.DonationHeaderId == -1) {
                this.setState({
                    AllowEdit: true,
                    Entity: data,
                    NotValidInput: true
                });
            } else {
                this.setState({
                    AllowEdit: false,
                    Entity: data,
                    NotValidInput: true,
                    Item: data
                });
            }
        }.bind(this));
    }
});