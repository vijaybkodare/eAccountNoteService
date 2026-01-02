var DateSelector = React.createClass({
    render: function() {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        let years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, currentYear - 5];
        return (
            <div className="form-group">
                <label className="mandatory1">{this.props.Label}</label>
                <div className="row">
                    <div className="col-xs-4" style={{ paddingRight: "0px" }}>
                        <select ref={function (node) { this.Day = node; }.bind(this)} defaultValue={today.getDate()} className="form-control" onChange={this.monthChange}
                        style={{borderTopRightRadius:"0px", borderBottomRightRadius:"0px"}}>
                            {
                                days.map((item, index) => <option key={index} value={item}>{item}</option>)
                            }
                        </select>
                    </div>
                    <div className="col-xs-4" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
                        <select ref={function (node) { this.Month = node; }.bind(this)} defaultValue={months[currentMonth]} className="form-control" onChange={this.monthChange}
                        style={{borderRadius:"0px", borderRightWidth:"0px", borderLeftWidth:"0px"}}>
                            {
                                months.map((item, index) => <option key={index} value={item}>{item}</option>)
                            }
                        </select>
                    </div>
                    <div className="col-xs-4" style={{ paddingLeft: "0px" }}>
                        <select ref={function (node) { this.Year = node; }.bind(this)} defaultValue={0} className="form-control" onChange={this.yearChange}
                            style={{borderTopLeftRadius:"0px", borderBottomLeftRadius:"0px"}}>
                            {
                                years.map((item, index) => <option key={index} value={item}>{item}</option>)
                            }
                        </select>
                    </div>

                </div>
            </div>
        );
    },
    monthChange: function(){
        //this.props.MonthChange(this.Month.value);
    },
    yearChange: function(){
        //this.props.YearChange(this.Year.value);
    },
    getValue: function(){
        return this.Day.value  + '-' + this.Month.value + '-' + this.Year.value;
    },
});