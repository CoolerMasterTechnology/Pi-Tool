import { Action } from 'redux';
// import { ThunkAction } from 'redux-thunk';

import {
    OverclockLevel,
    MonitoringMetric,
    ButtonMapping
} from '../models';

// Overclocking actions

export const ENABLE_OVERCLOCKING = 'ENABLE_OVERCLOCKING';
export const SET_OVERCLOCK_LEVEL = 'SET_OVERCLOCK_LEVEL';
export const SET_REBOOT_FLAG = 'SET_REBOOT_FLAG';

export interface EnableOverclockingAction extends Action {
    type: typeof ENABLE_OVERCLOCKING
}

export interface SetOverclockLevelAction extends Action {
    type: typeof SET_OVERCLOCK_LEVEL
    level: OverclockLevel
}

export interface SetRebootFlagAction extends Action {
    type: typeof SET_REBOOT_FLAG
}

// Monitoring actions

export const SET_MONITORING_METRIC = 'SET_MONITORING_METRIC';

export interface SetMonitoringMetricAction extends Action {
    type: typeof SET_MONITORING_METRIC,
    metric: MonitoringMetric,
    metricState: boolean
}

// Button mapping actions

export const ADD_BUTTON_MAPPING = 'ADD_BUTTON_MAPPING';
export const REMOVE_BUTTON_MAPPING = 'REMOVE_BUTTON_MAPPING';
export const TOGGLE_BUTTON_MAPPING = 'TOGGLE_BUTTON_MAPPING';

export interface AddButtonMappingAction extends Action {
    type: typeof ADD_BUTTON_MAPPING,
    mapping: ButtonMapping
}

export interface RemoveButtonMappingAction extends Action {
    type: typeof REMOVE_BUTTON_MAPPING,
    id: string
}

export interface ToggleButtonMappingAction extends Action {
    type: typeof TOGGLE_BUTTON_MAPPING,
    id: string,
    active: boolean
}
