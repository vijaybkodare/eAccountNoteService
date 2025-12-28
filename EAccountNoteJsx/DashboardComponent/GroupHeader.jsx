var GroupHeader = React.createClass({
    render: function () {
        var show = true;
        if (this.props.OnlyForAdmin) {
            show = isAdmin() || isSuperAdmin();
        }
        if (this.props.OnlyForSuperAdmin) {
            show = isSuperAdmin();
        }
        return ( show &&
            <div>
                <br />
                <span className="group-title">{this.props.Title}</span>
                <hr />
            </div>
        );
    },
});