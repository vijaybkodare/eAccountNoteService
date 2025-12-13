var OkMustReadInfo = React.createClass({
    displayName: "OkMustReadInfo",

    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Confirm = node;
                }.bind(this),
                className: "panel panel-EAccNoteThrd",
                style: { display: "none", position: "fixed", top: "50%", left: "50%", marginTop: -75, marginLeft: -150, width: 300, zIndex: 100 } },
            React.createElement(
                "div",
                { className: "panel-heading" },
                "Info"
            ),
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement("span", { ref: function (node) {
                        this.Message = node;
                    }.bind(this) })
            ),
            React.createElement(
                "div",
                { className: "panel-footer", style: { textAlign: "right" } },
                React.createElement(
                    "button",
                    { className: "btn btn-primary", onClick: this.hide },
                    "Ok"
                )
            )
        );
    },
    show: function (msg, actionOnOk) {
        this.Confirm.style.display = "block";
        this.Message.innerText = msg;
        this.actionOnOk = actionOnOk;
    },
    hide: function () {
        this.Confirm.style.display = "none";
        if (this.actionOnOk != null) this.actionOnOk();
    }
});