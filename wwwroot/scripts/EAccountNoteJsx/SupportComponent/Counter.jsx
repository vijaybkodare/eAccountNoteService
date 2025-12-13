var Counter = React.createClass({
    getInitialState: function () {
        return { };
    },
    render: function() {
        return (
            <span>
                {this.state.seconds}
            </span>
      );
    },
    componentDidMount: function () {
        this.start();
    },
    start: function(){
        this.setState({seconds: this.props.endCount});
        var thisCounter = window.setInterval(function () {
            if(this.state.seconds == 0){
                this.props.actionOnEndCount();
                clearInterval(thisCounter);
            }
            else
                this.setState({ seconds: this.state.seconds - 1});
            
        }.bind(this), this.props.interval);
    }
});