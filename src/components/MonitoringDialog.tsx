import React from 'react';
import {
    Dialog,
    DialogTitle,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Switch
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers';

import HotTubIcon from '@material-ui/icons/HotTub';
import SpeedIcon from '@material-ui/icons/Speed';
import MemoryIcon from '@material-ui/icons/Memory';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import { MonitoringMetric } from '../models';
import { setMonitoringMetric } from '../actions';

interface MonitoringDialogProps {
    onClose: () => void,
    open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            minWidth: '500px',
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

export const metricLookup: { [key: string]: { icon: any, label: string } } = {
    'CpuFreq': {
        icon: <SpeedIcon />,
        label: "Core frequency (in MHz)"
    },
    'CpuTemp': {
        icon: <HotTubIcon />,
        label: "Core temperature (in °C)"
    },
    'RamUsage': {
        icon: <MemoryIcon />,
        label: "Memory usage (in MB)"
    },
    'SysLoad': {
        icon: <HourglassEmptyIcon />,
        label: "System load average (last minute)"
    }
};

const MonitoringDialog: React.FC<MonitoringDialogProps> = ({ onClose, open }) => {
    const dispatch = useDispatch();
    const activeMetrics = useSelector((state: RootState) => state.monitoring.activeMetrics);
    const classes = useStyles();

    const metricList = Object.keys(activeMetrics).map((key, index) => {
        return (
            <ListItem key={index}>
                <ListItemIcon>
                    {metricLookup[key].icon}
                </ListItemIcon>
                <ListItemText id="switch-list-label-wifi" primary={metricLookup[key].label} />
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={(_event, checked) => dispatch(setMonitoringMetric(key, checked))}
                        checked={activeMetrics[key as MonitoringMetric].active}
                        inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    });

    return (
        <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={onClose}>
            <DialogTitle id="simple-dialog-title">
                <Typography variant="h5">
                    Select monitoring metrics
	      </Typography>
            </DialogTitle>
            <List className={classes.root}>
                {metricList}
            </List>
        </Dialog>
    );

}

export default MonitoringDialog;
