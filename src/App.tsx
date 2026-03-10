import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './ui/components/layouts/MainLayout';
import HomePage from './ui/pages/HomePage';
import CreateProjectPage from './ui/pages/CreateProjectPage';
import ProjectDetails from './ui/pages/ProjectDetails';
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
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App