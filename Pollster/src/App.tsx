import Navbar from './components/navbar/Navbar'
import styles from './App.module.css';
import  { AuthProvider } from './context/useAuth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material';
import CreateNewPoll from './pages/createNewPoll/CreateNewPollPage';
import { theme} from './styles/theme.js';
import './reset.css'
import { ThemeProvider } from '@emotion/react';
import './index.css'
import LoginPage from './pages/login/LoginPage.js';
import SignupPage from './pages/signup/SignupPage.js';
import PollPage from './pages/poll/PollPage.js';
import DashboardPage from './pages/dashboard/DashboardPage.js';
import { AlertProvider, useAlert } from './context/useAlert.js';
import AlertDialog from './components/alert/AlertDialog.js';

function App() {

  function Router() {
    return (
      <Routes>
        <Route
          path="/"
          element={<CreateNewPoll />}
        />
        <Route
          path="/createNewPoll"
          element={<CreateNewPoll />}
        />
        <Route
          path="/poll/:id"
          element={<PollPage />}
        />
        <Route 
          path="/login"
          element={<LoginPage />}
        />
        <Route 
          path="/signup"
          element={<SignupPage />}
        />
        <Route 
          path="/account"
          element={<DashboardPage />}
        />
      </Routes>
    );
  }

  function AppContent() {
  const { alert, closeAlert } = useAlert();

  return (
    <>
    <Navbar />
    <Router />
    <AlertDialog open={alert.open} message={alert.message} 
      severity={alert.severity} onClose={closeAlert} showDuration={alert.showDuration}  />
    </>
  );
  }

  return (
    <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
    <BrowserRouter>
    <AlertProvider>
    <AuthProvider>
      <div className={styles.container}>
      <AppContent />
      </div>
    </AuthProvider>
    </AlertProvider>
    </BrowserRouter>
    </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default App
