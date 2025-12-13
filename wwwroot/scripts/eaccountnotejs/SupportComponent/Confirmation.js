var Confirmation = React.createClass({
    displayName: "Confirmation",

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
                "Confirmation"
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
                    { className: "btn btn-primary", onClick: this.yesConfirm },
                    "Yes"
                ),
                "\xA0",
                React.createElement(
                    "button",
                    { className: "btn btn-danger", onClick: this.notConfirm },
                    "No"
                )
            )
        );
    },
    show: function (msg, actionOnConfirm, actionOnNo) {
        this.Confirm.style.display = "block";
        this.Message.innerText = msg;
        this.actionOnConfirm = actionOnConfirm;
        this.actionOnNo = actionOnNo;
    },
    notConfirm: function () {
        if (this.actionOnNo != null) this.actionOnNo();
        this.hide();
    },
    yesConfirm: function () {
        if (this.actionOnConfirm != null) this.actionOnConfirm();
        this.hide();
    },
    hide: function () {
        this.Confirm.style.display = "none";
    }
});