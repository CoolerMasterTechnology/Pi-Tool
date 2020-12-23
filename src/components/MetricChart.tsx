import React, { useEffect } from 'react';
import 'chartjs-plugin-streaming';
import { Line } from 'react-chartjs-2';
import { Box } from '@material-ui/core';

import { metricObservables } from '../websocket';
import { MonitoringMetric } from '../models';
import { metricMinimum, labelFormatter } from '../util/monitoring';
import { metricLookup } from './MonitoringDialog';

const getInitialDataset: any = (metric: string) => ({
    datasets: [{
        label: metric,
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#84329B',
        borderColor: '#84329B',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#84329B',
        pointBackgroundColor: '#84329B',
        pointBorderWidth: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: []
    }]
});

interface MetricChartProps {
    metric: MonitoringMetric
}

const MetricChart: React.FC<MetricChartProps> = ({ metric }) => {
    const chartOptions = {
        title: {
            text: metricLookup[metric].label,
            display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: { enabled: false },
        hover: { mode: null },
        scales: {
            xAxes: [{
                type: 'realtime',
                ticks: { display: false },
                realtime: {
                    duration: 60000,
                    refresh: 10000,
                    delay: 2000
                }
                /* time: { unit: 'seconds' } */
            }],
            yAxes: [{
                scaleLabel: false,
                ticks: {
                    suggestedMin: metricMinimum[metric],
                    callback: labelFormatter[metric]
                }
            }]
        }
    };

    //const [chartData, setChartData] = React.useState(getInitialDataset(metric as string));
    const chartData = React.useRef(getInitialDataset(metric as string));
    const chartRef = React.useRef<any>();

    useEffect(() => {
        let metricSubscriber = metricObservables[metric].subscribe((event: any) => {
            const { measurement } = event;

            // Append the new data to the existing chart data
            if (chartRef) {
                if (chartRef !== undefined && chartRef.current) {
                    chartRef.current.chartInstance.data.datasets[0].data.push({
                        x: new Date(measurement.timestamp * 1000),
                        y: measurement.value
                    });

                    chartRef.current.chartInstance.update({
                        preservation: true
                    });
                }
            }
        });

        return () => {
            console.log(`unsubscribe ${metric}`);
            metricSubscriber.unsubscribe();
        };

    }, [metric]);



    return (
        <Box width="100%">
            <Line ref={chartRef} options={chartOptions as any} data={chartData.current} key={`line-${metric as string}`} />
        </Box>
    );
}

export default MetricChart;
