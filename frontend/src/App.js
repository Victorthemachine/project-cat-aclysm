import React from 'react';
import { ThemeProvider } from '@mui/styles';
import config from './config';

// FIX: Theme must be defined with index!!!
function App() {
  return (
    <ThemeProvider theme={config.theme}>
      {/* Map all properties */}
    </ThemeProvider>
  );
}

export default App;
