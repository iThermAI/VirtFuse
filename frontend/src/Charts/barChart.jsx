import { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

const BarChart = ({ lastInfo }) => {
    const [option, setOption] = useState({});

    useEffect(() => {
        const chartOption = {
            tooltip: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        color: '#fff' // set the color of the y-axis labels to white
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        color: '#fff' // set the color of the y-axis labels to white
                    }
                },

            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }
            ]
        };

        setOption(chartOption);

        return () => { };
    }, []);

    useEffect(() => {
        console.log(lastInfo);
        if (lastInfo) {
            setOption(prevOption => ({
                xAxis: [
                    {
                        data: [...prevOption.xAxis[0].data, lastInfo.Time],
                    }
                ],
                series: [
                    {
                        data: [...prevOption.series[0].data, lastInfo.Temperature],
                    }
                ],
            }));
        }
    }, [lastInfo]);

    return <ReactEcharts option={option} />;
};

export default BarChart;