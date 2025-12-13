var HelloWorld = React.createClass({
    displayName: "HelloWorld",

    render: function () {
        return React.createElement(
            "div",
            { className: "panel-success" },
            React.createElement(
                "div",
                { className: "panel-heading" },
                "My Panel"
            ),
            React.createElement("div", { className: "panel-body" }),
            React.createElement(
                "div",
                { className: "panel-footer" },
                React.createElement(
                    "button",
                    { className: "btn btn-primary" },
                    "Hello"
                )
            )
        );
    }
});

ReactDOM.render(React.createElement(HelloWorld, null), document.getElementById('content'));