import { MonitoringMetric } from '../models/index';

// export const getLabelFormatter = (metric: MonitoringMetric) => {
//     switch (metric) {
//         case MonitoringMetric.CpuTemperature:
//             return (value: number, _idx: any, _labels: any) => {
//                 return (value / 10.0).toFixed(1).toString();
//             }
//         case MonitoringMetric.CpuFrequency:
//             return (value: any, _idx: any, _labels: any) => {
//                 return Math.trunc(value * 1e-6).toString();
//             }
//         case MonitoringMetric.RamUsage:
//             return (value: any, _idx: any, _labels: any) => {
//                 return Math.trunc(value / 1000).toString();
//             }
//         case MonitoringMetric.SystemLoad:
//             return (value: any, _idx: any, _labels: any) => {
//                 return (value / 10.0).toFixed(2).toString();
//             }
//         default:
//             return (value: any, _idx: any, _labels: any) => {
//                 return value;
//             }
//     }
// };

export const labelFormatter = {
    'CpuTemp': (value: number, _idx: any, _labels: any) => {
        return (value / 10.0).toFixed(1).toString();
    },
    'CpuFreq': (value: any, _idx: any, _labels: any) => {
        return Math.trunc(value * 1e-6).toString();
    },
    'RamUsage': (value: any, _idx: any, _labels: any) => {
        return Math.trunc(value / 1000).toString();
    },
    'SysLoad': (value: any, _idx: any, _labels: any) => {
        return (value / 10.0).toFixed(2).toString();
    }
};

export const metricMinimum = {
    'CpuTemp': 300,
    'CpuFreq': 5e+8,
    'RamUsage': 500000,
    'SysLoad': 5.0
};
