import React from 'react';
import { Box, IconButton } from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { ButtonPress } from '../models/index';

interface ButtonPressIconProps {
    press: ButtonPress,
    isButton: boolean
}

const ButtonPressIcon: React.FC<ButtonPressIconProps> = ({ press, isButton }) => {
    const icon = (() => {
        switch (press) {
            case ButtonPress.Long:
                return <RadioButtonCheckedIcon />;
            case ButtonPress.Short:
                return <RadioButtonUncheckedIcon />;
            default:
                return null;
        }
    })();

    if (isButton) {
        return (
            <Box style={{ width: 50, height: 50 }}>
                <IconButton disableRipple={true}>
                    {icon}
                </IconButton>
            </Box>
        );
    } else {
        return (
            <Box>
                {icon}
            </Box>
        );
    }
}

export default ButtonPressIcon;
