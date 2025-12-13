var AppFeatures = React.createClass({
    displayName: "AppFeatures",

    render: function () {
        return React.createElement(
            "div",
            { className: "alert alert-info",
                ref: function (node) {
                    this.Features = node;
                }.bind(this) },
            "eAccountNote",
            React.createElement("hr", null),
            React.createElement(
                "ul",
                { style: { listStyleType: "square" }, className: "primColor" },
                React.createElement(
                    "li",
                    null,
                    "This is your online Account Note, It is Free of Cost for managing your Persenol Accounts."
                ),
                React.createElement(
                    "li",
                    null,
                    "It is very easy & flexible solution for managing your Financial Transactions."
                ),
                React.createElement(
                    "li",
                    null,
                    "You can create as many Account-Groups as you want."
                ),
                React.createElement(
                    "li",
                    null,
                    "You can manage as many Accounts as you want within an Account-Group."
                ),
                React.createElement(
                    "li",
                    null,
                    "A real time Notification SMS is send to the Account owner under transaction entry."
                ),
                React.createElement(
                    "li",
                    null,
                    "A Notification SMS can be send on a Outstanding Balance to the Account user."
                ),
                React.createElement(
                    "li",
                    null,
                    "An Account level profile setting is given to Start or Stop the Notification SMS."
                ),
                React.createElement(
                    "li",
                    null,
                    "This is a conveniant solution to manage Financial Transaction among Group Users."
                )
            )
        );
    },
    show: function () {
        this.Features.style.display = "block";
    },
    hide: function () {
        this.Features.style.display = "none";
    }
});