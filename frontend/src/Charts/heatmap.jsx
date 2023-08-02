import { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

const HeatMap = () => {
    const [option, setOption] = useState({});

    useEffect(() => {
        const xLen = 808;
        const yLen = 453;

        const xcomp = 10;
        const ycomp = 5;

        const xData = Array.from({ length: xcomp }, (_, index) => index);
        const yData = Array.from({ length: ycomp }, (_, index) => index);

        const generateData = () => {
            const data = [];

            for (let i = 0; i <= xcomp; i++) {
                if (i < 3) {
                    for (let j = 0; j <= 4; j++) {
                        data.push([i, j, Math.random()]);
                    }
                } else if (i < 5) {
                    for (let j = 2; j <= 5; j++) {
                        data.push([i, j, Math.random()]);
                    }
                } else if (i > 7 && i < 10) {
                    for (let j = 4; j <= 5; j++) {
                        data.push([i, j, Math.random()]);
                    }
                }
            }
            return data;
        }

        const data = generateData();

        const chartOption = {
            tooltip: {
                formatter: (params) => {
                    return `Temprature: ${params.value[2].toFixed(2)}`;
                },
            },
            xAxis: {
                type: 'category',
                data: xData,
                axisLabel: {
                    show: false,
                },
            },
            yAxis: {
                type: 'category',
                data: yData,
                axisLabel: {
                    show: false,
                },
            },
            visualMap: {
                min: 0,
                max: 1,
                calculable: true,
                realtime: false,
                inRange: {
                    color: [
                        '#313695',
                        '#4575b4',
                        '#74add1',
                        '#abd9e9',
                        '#e0f3f8',
                        '#ffffbf',
                        '#fee090',
                        '#fdae61',
                        '#f46d43',
                        '#d73027',
                        '#a50026',
                    ],
                },
                textStyle: {
                    color: 'white',
                },
                bottom: 60,
                left: 30
            },
            series: [
                {
                    name: 'Temprature',
                    type: 'heatmap',
                    data: data,
                    emphasis: {
                        itemStyle: {
                            borderColor: '#333',
                            borderWidth: 1,
                        },
                    },
                    progressive: 1000,
                    animation: false,
                    itemStyle: {
                        opacity: 0.5
                    },
                },
            ],
        };

        setOption(chartOption);

        const intervalId = setInterval(() => {
            let retdata = generateData();
            setOption(prevOption => ({
                ...prevOption,
                series: [
                    {
                        ...prevOption.series[0],
                        data: retdata,
                    },
                ],
            }));
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return <ReactEcharts option={option} style={{ height: '582px', width: '1010px' }} />;
};

export default HeatMap;