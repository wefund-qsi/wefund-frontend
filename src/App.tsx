import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import CreateProjectPage from './pages/CreateProjectPage';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/create" element={<CreateProjectPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App