import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';

import {
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
    Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ReplayIcon from '@material-ui/icons/Replay';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

import { ButtonPress, ButtonAction, ButtonActionIdentifier } from '../models/index';
import ButtonPressIcon from './ButtonPressIcon';
import { addButtonMapping } from '../actions/index';
import { flushStore } from '../util/actions';

const useStyles = makeStyles({
    list: {
    },
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        textTransform: 'uppercase',
    },
    pos: {
        marginBottom: 12,
    },
    buttonGroup: {
        backgroundColor: '#84329B',
        minWidth: '100%',
        width: '100%'
    },
    arrowIcon: {
        marginLeft: 8,
        marginRight: 8
    },
    toggleButton: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        '.MuiToggleButton-label .MuiSvgItem-root': {
            marginLeft: 10
        }
    },
    assignmentBox: {
        paddingTop: 20,
        paddingBottom: 20
    },
    toggleButtonGroup: {
        width: '100%'
    },
    buttonPressIcon: {
    },
    buttonPressLabel: {
        marginLeft: 10,
        marginRight: 6
    },
    buttonActionGrid: {
        width: 400,
        height: 50
    },
    buttonActionDroppable: {
        minHeight: 50,
        width: '100%'
    },
    buttonAction: {
        height: 50,
        width: 50
    },
    textField: {
        width: '100%'
    }
});



interface ButtonPressItem {
    id: string,
    press: ButtonPress
}

interface ButtonPressItems extends Array<ButtonPressItem> { };

const BUTTON_PRESSES = [
    {
        id: uuidv4(),
        press: ButtonPress.Short
    },
    {
        id: uuidv4(),
        press: ButtonPress.Long
    }
];

const ButtonActionCreator: React.FC<{ buttonDuration: ButtonPress }> = ({ buttonDuration }) => {
    const draggableId = uuidv4();

    return (
        <Droppable droppableId="PALETTE" direction="horizontal" isDropDisabled={true}>
            {(provided, _snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Box width={1} style={{ display: 'inline-flex', verticalAlign: 'middle', alignItems: 'center' }}>
                        <Draggable key={draggableId} draggableId={draggableId} index={buttonDuration as number}>

                            {(provided, snapshot) => (
                                <Box style={{ width: 50, height: 50 }}>
                                    <div
                                        style={{ width: 50, height: 50 }}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>

                                        <ButtonPressIcon press={buttonDuration} isButton={true} />
                                    </div>
                                    {snapshot.isDragging &&
                                        <ButtonPressIcon press={buttonDuration} isButton={true} />
                                    }
                                </Box>
                            )}
                        </Draggable>


                        <Typography>
                            {buttonDuration === ButtonPress.Short ? "Short button press" : "Long button press"}
                        </Typography>
                    </Box>
                </div>
            )}
        </Droppable>
    );
}

const getStyle = (style: any, snapshot: any) => {
    if (!snapshot.isDropAnimating) {
        return style;
    }

    return {
        ...style,
        // cannot be 0, but make it super tiny
        transitionDuration: `0.001s`,
        width: 50,
        height: 50
    };
}
const ButtonActionGrid: React.FC<{ buttonPresses: ButtonPressItems }> = ({ buttonPresses }) => {
    const classes = useStyles();


    return (
        <Paper className={classes.buttonActionGrid} variant="outlined">
            <Droppable
                droppableId="GRID"
                direction="horizontal"
                isDropDisabled={buttonPresses.length >= 8}>
                {(provided, snapshot) => (
                    <div
                        className={classes.buttonActionDroppable}
                        ref={provided.innerRef}
                        style={{ display: 'inline-flex', verticalAlign: 'middle', alignItems: 'center' }}
                        {...provided.droppableProps}>
                        <Box display="flex" flexDirection="row">
                            {buttonPresses.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            style={getStyle(provided.draggableProps.style, snapshot)}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}>

                                            <ButtonPressIcon press={item.press} isButton={true} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}

                        </Box>
                        {provided.placeholder}
                        {/* && (buttonPresses.length == 0 && <Typography>  Drag your your sequence here.</Typography>)} */}
                    </div>
                )}
            </Droppable>
        </Paper>
    );
}

interface AddButtonMappingDialogProps {
    onClose: () => void,
    open: boolean
};

interface ButtonActionListProps {
    selectAction: (action: ButtonAction) => void,
    buttonAction: ButtonAction | undefined
}

const ButtonActionList: React.FC<ButtonActionListProps> = ({ selectAction, buttonAction }) => {
    const classes = useStyles();

    // Sets selection of button action
    const handleActionSelect = (identifier: ButtonActionIdentifier) => {
        selectAction(
            new ButtonAction(identifier)
        );
    }

    // Checks if button action is currently selected
    const isSelected = (action: ButtonAction | undefined, identifier: ButtonActionIdentifier) => {
        if (action !== undefined) {
            return action.identifier === identifier
        } else {
            return false
        }
    }

    const handleActionParamInput = (event: any) => {
        if (buttonAction !== undefined) {
            if (isSelected(buttonAction, ButtonActionIdentifier.Script)) {
                buttonAction.scriptPath = event.target.value;
            } else if (isSelected(buttonAction, ButtonActionIdentifier.Browser)) {
                buttonAction.url = event.target.value;
            }
        }
    };

    return (
        <List component="nav">
            <ListItem
                button
                selected={isSelected(buttonAction, ButtonActionIdentifier.SystemShutdown)}
                onClick={(_e) => handleActionSelect(ButtonActionIdentifier.SystemShutdown)}>
                <ListItemIcon>
                    <PowerSettingsNewIcon />
                </ListItemIcon>
                <ListItemText primary="Shut down system" />
            </ListItem>
            <ListItem
                button
                selected={isSelected(buttonAction, ButtonActionIdentifier.SystemReboot)}
                onClick={(_e) => handleActionSelect(ButtonActionIdentifier.SystemReboot)}>
                <ListItemIcon>
                    <ReplayIcon />
                </ListItemIcon>
                <ListItemText primary="Restart system" />
            </ListItem>
            <ListItem button
                selected={isSelected(buttonAction, ButtonActionIdentifier.Script)}
                onClick={(_e) => handleActionSelect(ButtonActionIdentifier.Script)}>
                <ListItemIcon>
                    <PlayCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Run custom script" />
            </ListItem>
            <Collapse in={isSelected(buttonAction, ButtonActionIdentifier.Script)} timeout="auto" unmountOnExit>
                <Box p={2} width={1}>
                    <TextField
                        value={(buttonAction !== undefined) ? buttonAction.scriptPath : null}
                        onChange={handleActionParamInput}
                        className={classes.textField} id="standard-basic" label="Script path" />
                </Box>
            </Collapse>
            <ListItem button
                selected={isSelected(buttonAction, ButtonActionIdentifier.Browser)}
                onClick={(_e) => handleActionSelect(ButtonActionIdentifier.Browser)}>
                <ListItemIcon>
                    <OpenInBrowserIcon />
                </ListItemIcon>
                <ListItemText primary="Open in browser" />
            </ListItem>
            <Collapse in={isSelected(buttonAction, ButtonActionIdentifier.Browser)} timeout="auto" unmountOnExit>
                <Box p={2} width={1}>
                    <TextField
                        value={(buttonAction !== undefined) ? buttonAction.url : null}
                        onChange={handleActionParamInput}
                        placeholder="https://google.com"
                        className={classes.textField} id="standard-basic" label="URL" />
                </Box>
            </Collapse>
        </List>
    );
};

const isValidUrl = (urlstr: string) => {
    try {
        new URL(urlstr);
    } catch (_) {
        return false;
    }

    return true;
}

const AddButtonMappingDialog: React.FC<AddButtonMappingDialogProps> = ({ onClose, open }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const handleClose = () => { onClose() }

    const buttonMappings = useSelector((state: RootState) => state.buttonMaps.mappings);
    const [buttonPresses, setButtonPresses] = React.useState<ButtonPressItems>([]);
    const [buttonAction, setButtonAction] = React.useState<ButtonAction | undefined>(undefined);
    const [showPressesError, setShowPressesError] = React.useState(false);
    const [showActionError, setShowActionError] = React.useState(false);
    const [showExistingError, setShowExistingError] = React.useState(false);
    const [showUrlError, setShowUrlError] = React.useState(false);

    // Reorders button presses in list
    const reorder = (list: ButtonPressItems, startIndex: number, endIndex: number): ButtonPressItems => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    // Moves a button press to the grid droppable
    const copy = (source: ButtonPressItems, destination: ButtonPressItems, droppableSource: number, droppableDestination: number) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const item = sourceClone[droppableSource];

        if (destClone.length < 8) {
            destClone.splice(droppableDestination, 0, { ...item, id: uuidv4() });
        }

        return destClone;
    };

    // Removes button press from grid
    const remove = (source: ButtonPressItems, itemIndex: number) => {
        const sourceClone = Array.from(source);
        sourceClone.splice(itemIndex, 1);
        return sourceClone;
    };

    // Checks for already existing button mappings
    const existingMappings = (presses: ButtonPress[]) => {
        let existing = false;

        for (let mapping of Object.values(buttonMappings)) {
            if (presses.every((p, i) => p === mapping.buttonPresses[i]) && presses.length === mapping.buttonPresses.length) {
                existing = true;
            }
        }

        return existing;
    };

    // Handles creation of new button mapping
    const handleAddMapping = () => {
        // Checks if there are button presses
        if (buttonPresses.length === 0) {
            setShowPressesError(true);
            return;
        }

        // Checks if action is selected
        if (buttonAction === undefined) {
            setShowActionError(true);
            return;
        }

        // Gets button presses and builds mapping
        const presses = buttonPresses.map((b) => b.press);

        // Checks for idential button mappings
        if (existingMappings(presses)) {
            setShowExistingError(true);
            return;
        }

        // Checks for valid URL
        if (buttonAction !== undefined) {
            if (buttonAction.url !== undefined) {
                if (!isValidUrl(buttonAction.url)) {
                    setShowUrlError(true);
                    return;
                }
            }
        }


        // Builds mapping
        const mapping = {
            buttonPresses: presses,
            buttonAction: buttonAction,
            active: true
        };

        // Adds button mapping
        dispatch(addButtonMapping(mapping));
        flushStore();

        // Clears presses and actions
        setButtonPresses([]);
        setButtonAction(undefined);
        setShowPressesError(false);
        setShowActionError(false);
        setShowExistingError(false);
        setShowUrlError(false);

        // Closes dialog
        handleClose();
    };

    // Handles drag end event
    const handleDragEnd = (result: any) => {
        if (!result.destination) {
            setButtonPresses(
                remove(
                    buttonPresses,
                    result.source.index
                )
            );

            return;
        }

        switch (result.source.droppableId) {
            case 'GRID':
                setButtonPresses(
                    reorder(
                        buttonPresses,
                        result.source.index,
                        result.destination.index
                    )
                );
                break;
            case 'PALETTE':
                setButtonPresses(
                    copy(
                        BUTTON_PRESSES,
                        buttonPresses,
                        result.source.index,
                        result.destination.index
                    )
                )
                break;
            default:
                break;
        }
    }


    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Dialog
                aria-labelledby="confirmation-dialog-title"
                open={open}>

                <DialogTitle id="confirmation-dialog-title">
                    <Typography variant="h5">Add new button mapping</Typography>
                </DialogTitle>

                <DialogContent>
                    {showPressesError && <Alert severity="error" variant="outlined">Please add at least one button press!</Alert>}
                    {showActionError && <Alert severity="error" variant="outlined">Please select an action!</Alert>}
                    {showExistingError && <Alert severity="error" variant="outlined">Button mapping already exists!</Alert>}
                    {showUrlError && <Alert severity="error" variant="outlined">Please specify a valid URL!</Alert>}
                    {(showPressesError || showActionError || showExistingError) && <br />}

                    <ButtonActionGrid buttonPresses={buttonPresses} />
                    <ButtonActionCreator buttonDuration={ButtonPress.Short} />
                    <ButtonActionCreator buttonDuration={ButtonPress.Long} />

                    <Box
                        display="flex"
                        justifyContent="center"
                        className={classes.assignmentBox}>
                        <ArrowDownwardIcon fontSize="large" />
                    </Box>

                    <Paper variant="outlined">
                        <ButtonActionList
                            buttonAction={buttonAction}
                            selectAction={setButtonAction} />
                    </Paper>
                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary" variant="contained">
                        Cancel
		  </Button>
                    <Button onClick={handleAddMapping} color="primary" variant="contained">
                        Ok
		  </Button>
                </DialogActions>
            </Dialog >
        </DragDropContext>
    )
}

export default AddButtonMappingDialog;
