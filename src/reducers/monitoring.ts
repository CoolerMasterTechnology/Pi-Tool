import { MonitoringState, MonitoringMetric } from '../models';
import {
    SET_MONITORING_METRIC,
    SetMonitoringMetricAction
} from '../types/actions';

const initialState: MonitoringState = {
    activeMetrics: {
        [MonitoringMetric.CpuTemperature]: { active: true },
        [MonitoringMetric.CpuFrequency]: { active: true },
        [MonitoringMetric.RamUsage]: { active: true },
        [MonitoringMetric.SystemLoad]: { active: true },
    }
};

function overclock(
    state = initialState,
    action: (SetMonitoringMetricAction)
): MonitoringState {
    switch (action.type) {
        case SET_MONITORING_METRIC:
            return {
                ...state,
                activeMetrics: {
                    ...state.activeMetrics,
                    [action.metric]: { active: action.metricState }
                }
            };
        default:
            return state;
    }
}

export default overclock;
