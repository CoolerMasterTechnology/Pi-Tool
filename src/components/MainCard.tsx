import React from 'react';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    title: {
        textTransform: 'uppercase',
        padding: '10px 15px 0 15px',
        fontSize: 24
    },
    card: {
        marginBottom: 12,
        '&:first-of-type': {
            marginTop: 12
        }

    },
    cardHeader: {
        marginBottom: 10
    }
});

interface MainCardProps {
    title: string,
    actions?: React.ReactNode
}

const MainCard: React.FC<MainCardProps> = ({ title, actions, children }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <Typography className={classes.title} variant="h5" style={{ display: 'flex', alignItems: 'center' }}>
                <Box flexGrow={1}>
                    {title}
                </Box>

                {actions}
            </Typography>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}

export default MainCard;
