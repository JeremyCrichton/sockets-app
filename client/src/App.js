import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Chatroom from './components/Chatroom';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className='App'>
        <Chatroom />
      </div>
    </ThemeProvider>
  );
}

export default App;
