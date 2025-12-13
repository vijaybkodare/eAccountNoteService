var PaymentScreenshot = React.createClass({
    displayName: "PaymentScreenshot",

    render: function () {
        return React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                null,
                "Payment Screenshot"
            ),
            React.createElement("input", { ref: function (node) {
                    this.FileInput = node;
                }.bind(this),
                type: "file", className: "btn btn-primary form-control", onChange: this.fillFormDetailFromImage })
        );
    },
    inputChange: function () {
        this.props.ItemChange(this.SelItem.value);
    },
    fillFormDetailFromImage: function (e) {
        const fileInput = e.target; // document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (!file) {
            return;
        }

        var formData = new FormData();
        formData.append('file', file);

        _ProgressBar.IMBusy();
        ajaxPost('LoadFile/LoadImage', formData, function (data) {
            _ProgressBar.IMDone();
            if (data.IsSuccess) {
                //this.Amount.value = data.Data.Amount;
                let imgData = {
                    TransactionId: data.Data.TransactionId,
                    Remark: data.Data.Remark
                };
                this.props.FillFormDetailFromImage(imgData);
            }
        }.bind(this));
    }
});