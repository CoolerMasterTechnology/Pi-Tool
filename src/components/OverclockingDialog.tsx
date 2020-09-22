import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
} from '@material-ui/core';

interface OverclockingDialogProps {
    onClose: () => void,
    open: boolean
}

const OverclockingDialog: React.FC<OverclockingDialogProps> = ({ onClose, open }) => {
    return (
        <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={onClose}>
            <DialogTitle id="simple-dialog-title">
                <Typography variant="h5">
                    Overclocking information
	      </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography>
                    The overclocking functions included in Pi Tool modify the following values in /boot/config.txt: over_voltage, arm_freq, gpu_freq.
                    Users can further modify these settings by entering the following code in the terminal window: sudo nano /boot/config.txt.
                    For this operation, a 3A 5V power supply is highly recommended.
                    Overclocking may cause system's instabilities, most show up immediately with a failure to boot. If this occurs, hold down the shift key during the next boot. This will temporarily disable all overclocking, allowing you to boot successfully and then edit your settings.
		  More information about overclocking of the Raspberry Pi can be found here: https://www.raspberrypi.org/documentation/configuration/config-txt/overclocking.md
	      </Typography>
            </DialogContent>
        </Dialog>
    );

}

export default OverclockingDialog;
