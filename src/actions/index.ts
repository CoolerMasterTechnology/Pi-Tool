import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { daemon } from '../websocket';
import { lookupOverclockLevel } from '../util/overclock';
import { Command, CommandMessage } from '../models/index';

import {
    // OverclockState,
    OverclockLevel,
    MonitoringMetric,
    ButtonMapping
} from '../models'

import {
    ENABLE_OVERCLOCKING,
    EnableOverclockingAction,
    SET_OVERCLOCK_LEVEL,
    // SetOverclockLevelAction,
    SET_REBOOT_FLAG,
    SetRebootFlagAction,
    SET_MONITORING_METRIC,
    SetMonitoringMetricAction,
    ADD_BUTTON_MAPPING,
    AddButtonMappingAction,
    REMOVE_BUTTON_MAPPING,
    RemoveButtonMappingAction,
    TOGGLE_BUTTON_MAPPING,
    ToggleButtonMappingAction
} from '../types/actions';

// Overclocking actions

export function enableOverclocking(): EnableOverclockingAction {
    return { type: ENABLE_OVERCLOCKING };
}

export function setOverclockLevel(level: OverclockLevel):
    ThunkAction<void, any, unknown, AnyAction> {
    return (dispatch) => {
        const msg: CommandMessage = {
            command: Command.Overclock,
            params: lookupOverclockLevel(level)
        };

        daemon.next(msg);
        dispatch({ type: SET_OVERCLOCK_LEVEL, level });
    }
}

export function setRebootFlag(): SetRebootFlagAction {
    return { type: SET_REBOOT_FLAG };
}

// Monitoring actions

export function setMonitoringMetric(metric: string, metricState: boolean): SetMonitoringMetricAction {
    return {
        type: SET_MONITORING_METRIC,
        metric: metric as MonitoringMetric,
        metricState
    };
}

// Button mapping actions
export function addButtonMapping(mapping: ButtonMapping): AddButtonMappingAction {
    return { type: ADD_BUTTON_MAPPING, mapping: mapping };
}

export function removeButtonMapping(id: string): RemoveButtonMappingAction {
    return { type: REMOVE_BUTTON_MAPPING, id: id };
}

export function toggleButtonMapping(id: string, active: boolean): ToggleButtonMappingAction {
    return { type: TOGGLE_BUTTON_MAPPING, id: id, active: active };
}
