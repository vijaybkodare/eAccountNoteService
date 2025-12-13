var ListCommand = React.createClass({
    displayName: "ListCommand",

    render: function () {
        return React.createElement(
            "div",
            { style: { textAlign: "center", marginBottom: 3 } },
            this.props.ItemSelMode ? this.props.MultiSelect ? React.createElement(
                "div",
                { style: { textAlign: "center" } },
                React.createElement(
                    "button",
                    { style: { marginRight: 3 }, className: "btn btn-primary", type: "button", onClick: this.props.ToggleAllSelect },
                    React.createElement("span", { className: "glyphicon glyphicon-retweet" }),
                    "\xA0 Toggle All Select"
                ),
                React.createElement(
                    "button",
                    { className: "btn btn-success", type: "button", onClick: this.props.SelectionComplete },
                    React.createElement("span", { className: "glyphicon glyphicon-ok" }),
                    "\xA0 Selection Complete"
                )
            ) : null : React.createElement(
                "button",
                { className: "btn btn-primary", type: "button", onClick: this.actionOnAdd },
                React.createElement("span", { className: "glyphicon glyphicon-plus" })
            )
        );
    },
    filterChange: function () {
        this.props.FilterChange(this.Filter.value);
    },
    actionOnAdd: function () {
        this.props.ShowAdd(null, 0);
    }
});