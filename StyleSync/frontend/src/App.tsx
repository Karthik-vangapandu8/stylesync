import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              StyleSync
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Dashboard />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
