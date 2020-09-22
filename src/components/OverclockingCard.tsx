import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import {
    Typography,
    Box,
    Tooltip,
    IconButton,
    Button,
    ButtonGroup,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog
} from '@material-ui/core';

import {
    enableOverclocking,
    setOverclockLevel,
} from '../actions';
import { Command, CommandMessage, OverclockLevel } from '../models';
import { RootState } from '../reducers';
import MainCard from './MainCard';
import OverclockingDialog from './OverclockingDialog';
import { daemon } from '../websocket';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SpeedIcon from '@material-ui/icons/Speed';
import WarningIcon from '@material-ui/icons/Warning';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import { levelToString, formatLevelValues } from '../util/overclock';

const useStyles = makeStyles(theme => ({
    buttonGroup: {
        backgroundColor: '#84329B',
        minWidth: '100%',
        width: '100%'
    },
    toggleButton: {
        fontSize: 15,
        fontWeight: 'bold',
        flexBasis: '25%',
        flexGrow: 1
    },
    enableButton: {
        width: '100%',
        fontSize: 15,
        height: 50,
        fontWeight: 'bold',
        backgroundColor: theme.palette.success.main,
        '&:hover': {
            backgroundColor: theme.palette.success.dark
        }
    },
    rebootButton: {
        width: '100%',
        fontSize: 15,
        height: 50,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        },
    },
    rebootButtonGroup: {
        width: '100%',
        fontSize: 15,
        height: 50,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        },
    },
    buttonLabels: {
        width: '100%',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'
    },
    iconHeader: {
        display: 'flex',
        alignItems: 'center'
    }
}));

interface EnableOverclockingDialogProps {
    onClose: (confirmed: boolean) => void,
    open: boolean
};

const EnableOverclockingDialog: React.FC<EnableOverclockingDialogProps> = ({ onClose, open }) => {
    const classes = useStyles();

    const handleCancel = () => { onClose(false) }
    const handleOk = () => { onClose(true) }

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={open}>
            <DialogTitle id="confirmation-dialog-title">
                <Typography variant="h5" className={classes.iconHeader}>
                    <WarningIcon />  Overclocking warning
	      </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography>
                    It is recommended that you save any important data before using this tool. Operating your Raspberry Pi outside of official Raspberry Pi specifications or outside factory settings, including the conducting of overclocking, may damage your system components and lead to system instabilities. <br /> <br /> Cooler Master does not provide support or service for issues or damages related to use of the system components outside of official specifications or factory settings. You may also not receive support from your board or system manufacturer.
		</Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary" variant="contained">
                    Cancel
	    </Button>
                <Button onClick={handleOk} color="primary" variant="contained">
                    Ok
	    </Button>
            </DialogActions>
        </Dialog>
    )
}


const OverclockingCard: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const overclockLevel = useSelector((state: RootState) => state.overclock.level);
    const { enabled } = useSelector((state: RootState) => state.overclock);

    const [rebootRequired, setRebootRequired] = React.useState(false);
    const [enableDialogOpen, setEnableDialogOpen] = React.useState(false);
    const [infoDialogOpen, setInfoDialogOpen] = React.useState(false);

    const handleLevelSelect = (_event: React.MouseEvent<HTMLElement>, level: OverclockLevel | null) => {
        if (level !== null) {
            dispatch(setOverclockLevel(level));

            if (level !== overclockLevel) {
                setTimeout(() => {
                    setRebootRequired(true);
                }, 1000);
            }
        }
    }

    const openInfoDialog = () => {
        setInfoDialogOpen(true);
    };

    const openEnableDialog = () => {
        setEnableDialogOpen(true);
    }

    const closeEnableDialog = (confirmed: boolean) => {
        if (confirmed) { dispatch(enableOverclocking()); }
        setEnableDialogOpen(false);
    }

    const closeInfoDialog = () => {
        setInfoDialogOpen(false);
    }

    const triggerReboot = () => {
        const msg: CommandMessage = {
            command: Command.Reboot
        };

        daemon.next(msg);
    }


    const cardActions = (
        <Tooltip title="About overclocking" placement="left">
            <IconButton aria-label="delete" color="default" onClick={openInfoDialog}>
                <HelpOutlineIcon />
            </IconButton>
        </Tooltip>
    );

    const rebootButton = (
        <ButtonGroup className={classes.rebootButtonGroup}>
            <Box flexShrink={1}>
                <Tooltip title="Go back" placement="bottom">
                    <Button
                        className={classes.rebootButton}
                        variant="contained"
                        onClick={(_e) => setRebootRequired(false)}
                        size="large">
                        <ArrowBackIcon />
                    </Button>
                </Tooltip>
            </Box>
            <Button
                className={classes.rebootButton}
                variant="contained"
                startIcon={<PowerSettingsNewIcon />}
                onClick={triggerReboot}
                size="large">
                Reboot Pi now
	</Button>
        </ButtonGroup>
    );

    const enableButton = (
        <Button
            className={classes.enableButton}
            variant="contained"
            color="primary"
            startIcon={<SpeedIcon />}
            onClick={openEnableDialog}
            size="large">
            Enable overclocking
	</Button>
    );

    const overclockLevels = [
        OverclockLevel.BaseClock,
        OverclockLevel.Level1,
        OverclockLevel.Level2,
        OverclockLevel.Level3
    ];

    const tooltipTitle = (level: OverclockLevel) => {
        return formatLevelValues(level).map((s, index) => {
            return <span key={index}>{s}<br /></span>;
        });
    };

    const overclockButtons = overclockLevels.map((level, index) => (
        <ToggleButton key={index} value={level} className={classes.toggleButton}>
            <Tooltip title={
                <Typography variant="caption">
                    {tooltipTitle(level)}
                </Typography>
            }
                placement="bottom" enterDelay={1000}>
                <Typography className={classes.buttonLabels}>
                    {levelToString(level)}
                </Typography>
            </Tooltip>
        </ToggleButton>
    ));

    const overclockButtonGroup = (
        <ToggleButtonGroup
            value={overclockLevel}
            exclusive={true}
            className={classes.buttonGroup}
            onChange={handleLevelSelect}>

            {overclockButtons}
        </ToggleButtonGroup>
    );


    return (
        <MainCard title="Overclocking" actions={cardActions}>
            <EnableOverclockingDialog
                open={enableDialogOpen}
                onClose={closeEnableDialog} />
            <OverclockingDialog
                open={infoDialogOpen}
                onClose={closeInfoDialog} />
            <Box display="flex" justifyContent="space-between">
                {!enabled ? enableButton : (rebootRequired ? rebootButton : overclockButtonGroup)}
            </Box>
        </MainCard >
    );
}

export default OverclockingCard;
