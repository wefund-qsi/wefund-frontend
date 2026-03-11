import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RealDateGenerator } from './core/adapters/real-date-generator';
import { RealIdGenerator } from './core/adapters/real-id-generator';
import { InMemoryProjectRepository } from './domain/projects/adapters/project-repository.in-memory';
import { CreateProject } from './domain/projects/uses-cases/create-project';
import MainLayout from './ui/components/layouts/MainLayout';
import HomePage from './ui/pages/HomePage';
import CreateProjectPage from './ui/pages/CreateProjectPage';
import theme from './theme';

const projectRepository = new InMemoryProjectRepository();
const createProject = new CreateProject(projectRepository, new RealIdGenerator(), new RealDateGenerator());

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/create" element={<CreateProjectPage createProject={createProject} />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App