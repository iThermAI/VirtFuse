import { useEffect, useState, useContext } from 'react';
import ReactEcharts from 'echarts-for-react';
import InformationContext from '../context/information';

const AreaChart = (props) => {
    const [option, setOption] = useState({});
    const { temp, time, cureSensorTemp } = useContext(InformationContext);

    useEffect(() => {
        const chartOption = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        color: '#fff' // set the color of the y-axis labels to white
                    },
                    data: [0]
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        color: '#fff' // set the color of the y-axis labels to white
                    }
                }
            ],
            series: [
                {
                    name: 'Temprature',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {
                        color: '#ffab91'
                    },
                    lineStyle: {
                        color: '#ec3800'
                    },
                    itemStyle: {
                        color: 'red'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [0]
                }
            ]
        };


        setOption(chartOption);

        return () => { };
    }, []);

    useEffect(() => {
        if (time.length > 0) {
            setOption((prevOption) => ({
                ...prevOption,
                xAxis: [
                    {
                        ...prevOption.xAxis[0],
                        data: time,
                    }
                ],
                series: [
                    {
                        ...prevOption.series[0],
                        data: props.index === "resin" ? temp : cureSensorTemp,
                    }
                ],
            }));
        } else {
            console.log("ERROR");
        }
    }, [time, temp, cureSensorTemp, props.index]);

    return (
        <>
        {time.length > 0 && <ReactEcharts option={option} />}
        </>
    );
};

export default AreaChart;