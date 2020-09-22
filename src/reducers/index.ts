import { combineReducers } from 'redux';
import overclock from './overclock';
import monitoring from './monitoring';
import buttonMaps from './buttonMaps';

const rootReducer = combineReducers({
    overclock,
    monitoring,
    buttonMaps
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
