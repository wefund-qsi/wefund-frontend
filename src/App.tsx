import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RealDateGenerator } from './core/adapters/real-date-generator';
import { RealIdGenerator } from './core/adapters/real-id-generator';
import { InMemoryAuthRepository } from './domain/auth/adapters/auth-repository.in-memory';
import { Login } from './domain/auth/uses-cases/login';
import { Signup } from './domain/auth/uses-cases/signup';
import { InMemoryProjectRepository } from './domain/projects/adapters/project-repository.in-memory';
import { CreateProject } from './domain/projects/uses-cases/create-project';
import { ViewAllProjects } from './domain/projects/uses-cases/view-all-projects';
import MainLayout from './ui/components/layouts/MainLayout';
import HomePage from './ui/pages/HomePage';
import CreateProjectPage from './ui/pages/CreateProjectPage';
import SignupPage from './ui/pages/SignupPage';
import LoginPage from './ui/pages/LoginPage';
import theme from './theme';

const projectRepository = new InMemoryProjectRepository();
const createProject = new CreateProject(projectRepository, new RealIdGenerator(), new RealDateGenerator());
const viewAllProjects = new ViewAllProjects(projectRepository);

const authRepository = new InMemoryAuthRepository();
const signup = new Signup(authRepository);
const login = new Login(authRepository);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage viewAllProjects={viewAllProjects} />} />
            <Route path="/projects/create" element={<CreateProjectPage createProject={createProject} />} />
            <Route path="/signup" element={<SignupPage signup={signup} />} />
            <Route path="/login" element={<LoginPage login={login} />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App