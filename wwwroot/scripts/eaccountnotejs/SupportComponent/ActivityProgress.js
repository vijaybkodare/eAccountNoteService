var ActivityProgress = React.createClass({
    displayName: "ActivityProgress",

    render: function () {
        return React.createElement(
            "div",
            { ref: function (node) {
                    this.Progress = node;
                }.bind(this),
                style: { position: "fixed", display: "none", top: 0, left: 0, zIndex: 100, width: "100%", backgroundColor: "transparent" } },
            React.createElement("img", { ref: function (node) {
                    this.ImgBusy = node;
                }.bind(this),
                src: "../Content/images/Blocks.gif", width: "100",
                style: { position: "absolute", zIndex: 101, left: "50%", transform: "translateX(-50px)" } }),
            React.createElement("div", { ref: function (node) {
                    this.DivBusy = node;
                }.bind(this),
                style: { opacity: 0.5, backgroundColor: "gray" } })
        );
    },
    componentDidMount: function () {
        this.IMDone();
    },
    IMBusy: function () {
        this.Progress.style.display = "block";
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.Progress.style.height = height + 'px';
        this.ImgBusy.style.top = height / 2 - 50 + 'px';
        this.DivBusy.style.height = height + 'px';
    },
    IMDone: function () {
        this.Progress.style.display = "none";
    }
});