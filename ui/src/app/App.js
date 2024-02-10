import { useRoutes } from 'react-router-dom';
import routes from './routes/routes';
import { CssBaseline } from '@mui/material';
import AppTheme from './components/AppTheme/AppTheme';
import Snackbar from './components/SnackBar/Snackbar';
import { SettingsProvider } from './context/SettingsContext';
import TerminalIcon from '@mui/icons-material/Terminal';
import Fab from '@mui/material/Fab';

function App() {
  const content = useRoutes(routes);
  return (
    <SettingsProvider>
      <AppTheme>
        <CssBaseline />
        {content}
        <Fab sx={{ position: 'absolute', top: 80, right: 40 }} size='medium' className='bg-blue'>
          <TerminalIcon />
        </Fab>
        <Snackbar />
      </AppTheme>
    </SettingsProvider>
  );
}

export default App;
