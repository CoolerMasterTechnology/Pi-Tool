import {
    ButtonPress,
    ButtonAction,
    ButtonActionIdentifier,
    ButtonMappingState
} from '../models';
import { v4 as uuidv4 } from 'uuid';
import {
    ADD_BUTTON_MAPPING,
    AddButtonMappingAction,
    REMOVE_BUTTON_MAPPING,
    RemoveButtonMappingAction,
    TOGGLE_BUTTON_MAPPING,
    ToggleButtonMappingAction
} from '../types/actions';

const initialState: ButtonMappingState = {
    mappings: {
        [uuidv4()]: {
            buttonPresses: [ButtonPress.Long],
            buttonAction: new ButtonAction(ButtonActionIdentifier.SystemShutdown),
            active: false
        }
    }
};

function buttonMaps(
    state = initialState,
    action: (AddButtonMappingAction | RemoveButtonMappingAction | ToggleButtonMappingAction)
): ButtonMappingState {
    switch (action.type) {
        case ADD_BUTTON_MAPPING:
            return {
                mappings: {
                    ...state.mappings,
                    [uuidv4()]: action.mapping
                }
            };
        case REMOVE_BUTTON_MAPPING:
            const { [action.id]: _, ...newMappings } = state.mappings;
            return { mappings: newMappings };
        case TOGGLE_BUTTON_MAPPING:
            return {
                mappings: {
                    ...state.mappings,
                    [action.id]: {
                        ...state.mappings[action.id],
                        active: !state.mappings[action.id].active
                    }
                }
            };
        default:
            return state;
    }
}

export default buttonMaps;
