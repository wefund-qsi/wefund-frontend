import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './ui/components/layouts/MainLayout';
import HomePage from './ui/pages/HomePage';
import CreateProjectPage from './ui/pages/CreateProjectPage';
import LoginPage from './ui/pages/LoginPage';
import RegisterPage from './ui/pages/RegisterPage';
import { AuthProvider } from './shared/modules/users/adapters/primary/useAuthProvider';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/create" element={<CreateProjectPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App