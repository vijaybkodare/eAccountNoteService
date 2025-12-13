var DashboardItem = React.createClass({
    getInitialState: function () {
        return {

        };
    },
    render: function () {
        var glyph = "glyphicon glyphicon-" + (this.props.Icon ? this.props.Icon : "cog")
        var show = true;
        if (this.props.OnlyForAdmin) {
            show = isAdmin()
        }
        if (this.props.OnlyForSuperAdmin) {
            show = isSuperAdmin();
        }
        return( 
            show &&
            <div className='dashboardItem' onClick={this.props.Show}>
                <div className="header">
                    <span className={glyph} />
                </div>
                <div className="footer">{this.props.Title}</div>
            </div>
        );
    },
});