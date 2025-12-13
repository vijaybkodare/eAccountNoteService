var PieChart = React.createClass({
    getInitialState: function () {
        return{
        };
    },
    render: function () {
        return (
            <div>
                
                <canvas id="paidUnpaidChargeChart" className="chart1" ></canvas>
            </div>
            
        );
    },
    componentDidMount: function () {
    },
    updateEntity: function (entity, filter) {
        this.loadChart(entity, 'Charges: ' + filter.FromDate + ' - ' + filter.ToDate);
    },
    loadChart: function (data, title) {
        var xValues = ["Paid", "Unpaid"];
        var yValues = [data.TotalChargePaid, data.TotalChargeAmount - data.TotalChargePaid];
        var barColors = [
            "#020236",
            "red",
        ];

        new Chart("paidUnpaidChargeChart", {
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
    },
    
});