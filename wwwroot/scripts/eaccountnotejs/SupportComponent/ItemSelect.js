var ItemSelect = React.createClass({
    displayName: "ItemSelect",

    render: function () {
        return React.createElement(
            "div",
            { className: "input-group", style: { marginBottom: 3 } },
            React.createElement("input", { ref: function (node) {
                    this.SelItem = node;
                }.bind(this), type: "text", className: "form-control", disabled: true, value: this.props.ItemText, onChange: this.inputChange }),
            React.createElement(
                "span",
                { className: "input-group-btn" },
                React.createElement(
                    "button",
                    { type: "button", className: "btn btn-danger", onClick: this.props.ClearItemSelect },
                    React.createElement("span", { className: "glyphicon glyphicon-remove" })
                ),
                React.createElement(
                    "button",
                    { type: "button", className: "btn btn-primary", onClick: this.props.GoForItemSelect },
                    React.createElement("span", { className: "glyphicon glyphicon-list-alt", style: { marginRight: 7 } }),
                    "Select"
                )
            )
        );
    },
    inputChange: function () {
        this.props.ItemChange(this.SelItem.value);
    }
});