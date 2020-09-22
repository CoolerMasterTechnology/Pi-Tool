import React from 'react';
import './App.css';
import { Container, Box } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import OverclockingCard from '../OverclockingCard';
import MonitoringCard from '../MonitoringCard';
import ButtonMappingCard from '../ButtonMappingCard';
import cmLogo from '../../images/cm_logo.png';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        background: {
            default: '#212721'
        },
        primary: {
            main: '#84329B'
        }
    },
    typography: {
        fontFamily: 'noto_sansregular',
        h5: {
            fontFamily: 'oswaldregular',
            textTransform: 'uppercase',
        }
    }
});

const CMLogo: React.FC = () => {
    return (
        <Box display="flex" justifyContent="center">
            <Box width="30%">
                <img width="100%" src={cmLogo} alt="Logo" />
            </Box>
        </Box>
    );
}

function App() {
    return (
        <div className="App" style={{ width: '100%', height: '100%' }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="md">
                    <OverclockingCard />
                    <MonitoringCard />
                    <ButtonMappingCard />
                    <CMLogo />
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default App;
