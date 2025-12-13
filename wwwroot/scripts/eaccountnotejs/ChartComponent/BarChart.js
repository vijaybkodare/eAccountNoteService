var BarChart = React.createClass({
    displayName: "BarChart",

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
        title = "Recent month Income/Expense trend";
        data = [{ month: 'Jul12', income: 60, expense: 50 }, { month: 'Aug', income: 50, expense: 30 }, { month: 'Sep', income: 40, expense: 80 }, { month: 'Oct', income: 70, expense: 60 }, { month: 'Nov', income: 80, expense: 70 }, { month: 'Dec', income: 90, expense: 30 }, { month: 'Jan', income: 100, expense: 40 }, { month: 'Sep', income: 40, expense: 80 }, { month: 'Oct', income: 70, expense: 60 }, { month: 'Nov', income: 80, expense: 70 }, { month: 'Dec', income: 90, expense: 30 }, { month: 'Jan', income: 100, expense: 40 }];
        new Chart("incomeExpenseTrendChart", {
            type: 'bar',
            data: {
                labels: data.map(row => row.month),
                datasets: [{
                    label: 'Income',
                    data: data.map(row => row.income),
                    backgroundColor: "#020236",
                    stack: 'Stack 0'
                }, {
                    label: 'Expense',
                    data: data.map(row => row.expense),
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