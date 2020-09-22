import { OverclockState, OverclockLevel } from '../models';
import {
    ENABLE_OVERCLOCKING,
    EnableOverclockingAction,
    SET_OVERCLOCK_LEVEL,
    SetOverclockLevelAction,
    SET_REBOOT_FLAG,
    SetRebootFlagAction
} from '../types/actions';

const initialState: OverclockState = {
    level: OverclockLevel.BaseClock,
    enabled: false,
    rebootRequired: false
};


function overclock(
    state = initialState,
    action: (EnableOverclockingAction | SetOverclockLevelAction | SetRebootFlagAction)
): OverclockState {
    switch (action.type) {
        case ENABLE_OVERCLOCKING:
            return {
                ...state,
                enabled: true
            };
        case SET_OVERCLOCK_LEVEL:
            return {
                ...state,
                level: action.level
            };
	case SET_REBOOT_FLAG:
	    return {
		...state,
		rebootRequired: true
	    };
        default:
            return state;
    }
}

export default overclock;
