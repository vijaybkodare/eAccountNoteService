var AddEditFooter = React.createClass({
    displayName: "AddEditFooter",

    render: function () {
        let allowClear = typeof this.props.AllowClear == "undefined" ? true : this.props.AllowClear;
        let allowDelete = typeof this.props.AllowDelete == "undefined" ? false : this.props.AllowDelete;
        return React.createElement(
            "div",
            { className: "panel-footer text-center" },
            React.createElement(
                "div",
                { className: "btn-group", role: "group" },
                this.props.AllowDelete && React.createElement(
                    "button",
                    { type: "button", className: "btn btn-danger", onClick: this.props.Delete },
                    "Delete"
                ),
                this.props.AllowClear && React.createElement(
                    "button",
                    { type: "button", className: "btn btn-warning", onClick: this.props.Clear },
                    "Clear"
                ),
                React.createElement(
                    "button",
                    { type: "button", className: "btn btn-success", disabled: this.props.NotValidInput, onClick: this.props.Save },
                    "Save"
                )
            )
        );
    }
});