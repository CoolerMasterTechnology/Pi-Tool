import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ReplayIcon from '@material-ui/icons/Replay';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import DeleteIcon from '@material-ui/icons/Delete';

import { useDispatch, useSelector } from 'react-redux';
import { Chip, Switch, Typography, Tooltip } from '@material-ui/core';
import MainCard from './MainCard';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import { RootState } from '../reducers';
import { daemon, buttonActionObservable$ } from '../websocket';
import { Command } from '../models';
import { launchScript, openBrowser, flushStore } from '../util/actions';

import {
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    IconButton,
    Box
} from '@material-ui/core';

import AddButtonMappingDialog from './AddButtonMappingDialog';
import ButtonPressIcon from './ButtonPressIcon';

import {
    removeButtonMapping,
    toggleButtonMapping
} from '../actions/index';
import { ButtonAction, ButtonActionIdentifier } from '../models';

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
    }
});

const mappingLookup: { [key: number]: { icon: any } } = {
    [ButtonActionIdentifier.SystemShutdown]: {
        icon: <PowerSettingsNewIcon />
    },
    [ButtonActionIdentifier.SystemReboot]: {
        icon: <ReplayIcon />
    },
    [ButtonActionIdentifier.Script]: {
        icon: <PlayCircleOutlineIcon />
    },
    [ButtonActionIdentifier.Browser]: {
        icon: <OpenInBrowserIcon />
    }
};

const formatButtonAction = (action: ButtonAction) => {
    switch (action.identifier) {
        case ButtonActionIdentifier.SystemShutdown:
            return "Shut down";
        case ButtonActionIdentifier.SystemReboot:
            return "Reboot";
        case ButtonActionIdentifier.Script:
            // eslint-disable-next-line
            const scriptFileName = action.scriptPath?.replace(/^.*[\\\/]/, '');
            return `Launch ${scriptFileName}`;
        case ButtonActionIdentifier.Browser:
            let hostname = '';

            if (action.url !== undefined) {
                const url = new URL(action.url);
                hostname = url.hostname;
            }

            return `Open ${hostname}`;
        default:
            return "unknown";
    }
}

const ButtonMappingCard: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const buttonMappings = useSelector((state: RootState) => state.buttonMaps.mappings);
    const [addMappingOpen, setAddMappingOpen] = React.useState(false);

    // Sync button mappings on every change
    useEffect(() => {
        daemon.next({
            command: Command.SyncMappings,
            mappings: buttonMappings
        });
        flushStore();
    }, [buttonMappings]);

    // Sets up button action subscriber
    useEffect(() => {
        let buttonActionSubscriber = buttonActionObservable$.subscribe((event: any) => {
            const { id } = event;

            if (buttonMappings[id]) {
                switch (buttonMappings[id].buttonAction.identifier) {
                    case ButtonActionIdentifier.Script:
                        const scriptPath = buttonMappings[id].buttonAction.scriptPath;
                        if (scriptPath) {
                            launchScript(scriptPath);
                        }
                        break;
                    case ButtonActionIdentifier.Browser:
                        const url = buttonMappings[id].buttonAction.url;
                        if (url !== undefined) {
                            openBrowser(url);
                        }
                        break;
                    default:
                        break;
                }
            }
        });

        return () => {
            buttonActionSubscriber.unsubscribe();
        };
    }, [buttonMappings]);

    const handleAddMappingClose = () => {
        setAddMappingOpen(false);
    };

    const handleMappingDelete = (id: string) => {
        dispatch(removeButtonMapping(id));
    };

    const handleMappingToggle = (id: string, event: any) => {
        dispatch(toggleButtonMapping(id, event.target.checked));
    }

    const cardActions = (
        <Tooltip title="Add mapping" placement="left">
            <IconButton aria-label="delete" color="default" onClick={() => setAddMappingOpen(true)}>
                <AddIcon />
            </IconButton>
        </Tooltip>
    );

    const noMappings = Object.keys(buttonMappings).length === 0 ?
        <Box display="flex" justifyContent="center">
            <Typography>No button mappings created.</Typography>
        </Box> : null;

    return (
        <MainCard title="Button mapping" actions={cardActions}>
            <AddButtonMappingDialog open={addMappingOpen} onClose={handleAddMappingClose} />
            <List className={classes.root}>
                {Object.keys(buttonMappings).map((mappingId, index) => (
                    <ListItem key={index} dense button>
                        <ListItemIcon>
                            <Switch
                                color="primary"
                                checked={buttonMappings[mappingId].active}
                                onChange={(event) => handleMappingToggle(mappingId, event)} />
                        </ListItemIcon>

                        <ListItemText id={mappingId} primary={
                            <Typography style={{ display: 'flex', alignItems: 'center' }}>
                                {buttonMappings[mappingId].buttonPresses.map((buttonPress, bindex) => (
                                    <ButtonPressIcon press={buttonPress} key={bindex} isButton={false} />
                                ))}
                                <ArrowRightAltIcon className={classes.arrowIcon} />
                                <Chip icon={mappingLookup[buttonMappings[mappingId].buttonAction.identifier].icon}
                                    label={formatButtonAction(buttonMappings[mappingId].buttonAction)} />
                            </Typography>

                        } />

                        <Tooltip title="Delete button mapping" placement="left">
                            <ListItemSecondaryAction>
                                <IconButton aria-label="delete" color="default" onClick={() => handleMappingDelete(mappingId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            {noMappings}
        </MainCard >
    );
}

export default ButtonMappingCard;
