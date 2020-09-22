import React from 'react';
import { Typography, Box, Tooltip, IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';

import MainCard from './MainCard';
import MetricChart from './MetricChart';
import MonitoringDialog from './MonitoringDialog';
import { RootState } from '../reducers';
import { MonitoringMetric } from '../models';

const MonitoringCard: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const metrics = useSelector((state: RootState) => state.monitoring.activeMetrics);

    const handleOpen = () => { setOpen(true); }
    const handleClose = () => { setOpen(false); }

    const cardActions = (
        <Box>
            <Tooltip title="Select metrics" placement="left">
                <IconButton aria-label="delete" color="default" onClick={handleOpen}>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const activeMetrics = Object.keys(metrics)
        .filter(m => metrics[m as MonitoringMetric].active);

    const computeChartWidth = (len: number, idx: number) => {
        if (len > 1) {
            return (((idx % 2) === 0) && (idx === len - 1) ? '100%' : '50%');
        } else {
            return '100%';
        }
    }

    const charts = activeMetrics.map((metric, index) => (
        <Box width={computeChartWidth(activeMetrics.length, index)}>
            <MetricChart metric={metric as MonitoringMetric} key={`chart-${metric as string}`} />
        </Box>
    ));

    const noSelected = (charts.length === 0) && (
        <Box display="flex" justifyContent="center">
            <Typography>No metric selected.</Typography>
        </Box>
    );

    return (
        <MainCard title="Monitoring" actions={cardActions}>
            <MonitoringDialog open={open} onClose={handleClose} />
            <Box display="flex" flexWrap="wrap" width="100%" p={1}>
                {charts}
            </Box>

            {noSelected}
        </MainCard>
    );
}

export default MonitoringCard;
