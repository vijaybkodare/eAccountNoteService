var Counter = React.createClass({
    displayName: "Counter",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "span",
            null,
            this.state.seconds
        );
    },
    componentDidMount: function () {
        this.start();
    },
    start: function () {
        this.setState({ seconds: this.props.endCount });
        var thisCounter = window.setInterval(function () {
            if (this.state.seconds == 0) {
                this.props.actionOnEndCount();
                clearInterval(thisCounter);
            } else this.setState({ seconds: this.state.seconds - 1 });
        }.bind(this), this.props.interval);
    }
});