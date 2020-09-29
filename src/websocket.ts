import { webSocket } from "rxjs/webSocket";
import { filter } from 'rxjs/operators';
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
            if (message.event === EventType.Measurement) {
                return (message['measurement']['metric'] === metric);
            } else {
                return false;
            }
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

export const buttonActionObservable$ = daemon.asObservable().pipe(filter((message: any) => (message.event === EventType.ButtonAction)));

