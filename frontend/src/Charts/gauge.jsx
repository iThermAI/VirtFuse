import { useEffect, useState, useContext } from 'react';
import ReactEcharts from 'echarts-for-react';
import InformationContext from '../context/information';

const GaugeChart = () => {
    const [option, setOption] = useState({});
    const {
        temp
    } = useContext(InformationContext);

    useEffect(() => {
        const chartOption = {
            series: [
                {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    itemStyle: {
                        color: '#FFAB91'
                    },
                    progress: {
                        show: true,
                        width: 10
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            width: 10
                        }
                    },
                    axisTick: {
                        distance: -20,
                        splitNumber: 5,
                        lineStyle: {
                            width: 1,
                            color: 'white'
                        }
                    },
                    splitLine: {
                        distance: -22,
                        length: 7,
                        lineStyle: {
                            width: 1,
                            color: 'white'
                        }
                    },
                    axisLabel: {
                        distance: -10,
                        color: 'white',
                        fontSize: 13
                    },
                    anchor: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        valueAnimation: true,
                        width: '0%',
                        lineHeight: 10,
                        borderRadius: 8,
                        offsetCenter: [0, '-15%'],
                        fontSize: 20,
                        fontWeight: 'bolder',
                        formatter: '{value} °C',
                        color: 'white'
                    },
                    data: [
                        {
                            value: 0
                        }
                    ]
                }
            ]
        };

        setOption(chartOption);

        return () => { };
    }, []);

    useEffect(() => {
        if (temp.length > 0) {
            setOption(prevOption => ({
                series:
                {
                    ...prevOption.series[0],
                    data: [temp[temp.length - 1]],
                },
            }));
        }
    }, [temp]);

    return <ReactEcharts option={option} style={{ width: "80%", height: "100%", margin: "0 auto", minHeight: "28vh"}} />;
};

export default GaugeChart;