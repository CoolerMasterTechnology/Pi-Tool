import { webSocket } from "rxjs/webSocket";
import { Command, MonitoringMetric, EventType } from './models';

// TODO: Add reconnect logic
export const daemon = webSocket("ws://localhost:9002");

daemon.subscribe(
    _msg => { },
    err => console.log(err),
    () => console.log('complete')
);

/// Factory for metric observables
export const buildObservable$ = (metric: MonitoringMetric) => {
    return daemon.multiplex(
        () => ({ command: Command.SubscribeMetric, metric: metric }),
        () => ({ command: Command.UnsubscribeMetric, metric: metric }),
        (message: any) => {
            let isMeasurement = (message.event === EventType.Measurement);
            let isOfMetric = (message.measurement.metric === metric);

            return isMeasurement && isOfMetric;
        }
    );
};

// Builds all observables
const observedMetrics = [
    MonitoringMetric.CpuTemperature,
    MonitoringMetric.CpuFrequency,
    MonitoringMetric.RamUsage,
    MonitoringMetric.SystemLoad
];
export const metricObservables = Object.assign({}, ...observedMetrics.map((m) => (
    { [m]: buildObservable$(m) }
)));
