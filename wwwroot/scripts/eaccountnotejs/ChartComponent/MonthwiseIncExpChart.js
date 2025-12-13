var MonthwiseIncExpChart = React.createClass({
    displayName: "MonthwiseIncExpChart",

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement("canvas", { id: "incomeExpenseTrendChart", className: "chart1" })
        );
    },
    componentDidMount: function () {},
    updateEntity: function (entity, filter) {
        this.loadChart(entity, 'Charges: ' + filter.FromDate + ' - ' + filter.ToDate);
    },
    loadChart: function (data, title) {
        title = "Monthwise Income/Expense trend";
        new Chart("incomeExpenseTrendChart", {
            type: 'bar',
            data: {
                labels: data.map(row => row.Period),
                datasets: [{
                    label: 'Income',
                    data: data.map(row => row.TotalIncome),
                    backgroundColor: "#020236",
                    stack: 'Stack 0'
                }, {
                    label: 'Expense',
                    data: data.map(row => row.TotalExpense),
                    backgroundColor: 'red',
                    stack: 'Stack 1'
                }]
            },
            options: {
                title: {
                    display: true,
                    text: title
                }
            }
        });
    }

});