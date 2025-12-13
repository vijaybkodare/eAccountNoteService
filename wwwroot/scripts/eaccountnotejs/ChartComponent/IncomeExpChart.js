var IncomeExpChart = React.createClass({
    displayName: "IncomeExpChart",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement("canvas", { id: "incomeExpChart", className: "chart1" })
        );
    },
    componentDidMount: function () {},
    updateEntity: function (entity, filter) {
        this.loadChart(entity, 'Income/Exp: ' + filter.FromDate + ' - ' + filter.ToDate);
    },
    loadChart: function (data, title) {
        var xValues = ["Income", "Expense"];
        var yValues = [data.TotalIncome, -data.TotalExpense];
        var barColors = ["#020236", "red"];

        new Chart("incomeExpChart", {
            type: "pie",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: getChartOptions(title) /*{
                                            title: {
                                            display: true,
                                            text: title
                                            }
                                            }*/
        });
    }
});