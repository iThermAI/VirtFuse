import { Component } from "react";
import ReactApexChart from 'react-apexcharts';

class ApexChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [{
                name: 'Series 1',
                data: [80, 50, 30, 40, 100, 20, 30, 40],
            }],
            options: {
                chart: {
                    type: 'radar',
                    background: 'rgba(0, 0, 0, 0.5)',
                },
                title: {
                    text: 'Basic Radar Chart'
                },
                xaxis: {
                    categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
                }
            },
        };
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="radar" height={400}/>
            </div>)
    }
}

export default ApexChart;