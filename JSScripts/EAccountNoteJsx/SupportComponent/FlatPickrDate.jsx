var FlatPickrDate = React.createClass({
    getInitialState: function () {
        return {
            Value: this.props.Value || ""
        };
    },
    render: function () {
        return (
            <input ref={function (node) { this.FlatPickrIp = node; }.bind(this)}
                  type="text" className="form-control" placeholder="From Date" defaultValue={this.props.Value} />
        );
    },
    componentDidMount: function () {
        this.FlatPickr = flatpickr(this.FlatPickrIp, {
            dateFormat: "d-M-Y",
            onChange: (selectedDates, dateStr, instance) => {
                const formattedDate = instance.formatDate(
                    selectedDates[0],
                    "d-M-Y"
                );
                this.setState({ Value: formattedDate });
            }
        });
        this.FlatPickr.setDate(new Date(), true);
    },
    getValue: function () {
        return this.state.Value;
    },
    setValue: function (value) {
        this.FlatPickr.setDate(value, true);
    },
});