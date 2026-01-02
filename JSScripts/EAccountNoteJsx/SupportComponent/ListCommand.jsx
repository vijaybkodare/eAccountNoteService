var ListCommand = React.createClass({
    render: function() {
        return (
            <div style={{ textAlign: "center", marginBottom: 3 }}>
                {
                    this.props.ItemSelMode ?
                        this.props.MultiSelect ?
                            <div style={{ textAlign: "center"}}>
                                <button style={{ marginRight: 3}} className="btn btn-primary" type="button" onClick={this.props.ToggleAllSelect}>
                                    <span className="glyphicon glyphicon-retweet"/>&nbsp; Toggle All Select
                                </button>
                                <button className="btn btn-success" type="button" onClick={this.props.SelectionComplete}>
                                    <span className="glyphicon glyphicon-ok" />&nbsp; Selection Complete
                                </button>
                            </div>
                            :
                            null
                        :
                        <button className="btn btn-primary" type="button" onClick={this.actionOnAdd}>
                            <span className="glyphicon glyphicon-plus" />
                        </button>
                }
                
            </div>
        );
    },
    filterChange: function(){
       this.props.FilterChange(this.Filter.value);
    },
    actionOnAdd: function(){
        this.props.ShowAdd(null, 0);
    }
});