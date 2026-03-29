import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RealDateGenerator } from './core/adapters/real-date-generator';
import { RealIdGenerator } from './core/adapters/real-id-generator';
import { InMemoryCampaignRepository } from './domain/campagns/adapters/campaign-repository.in-memory';
import { CreateCampaign } from './domain/campagns/uses-cases/create-campaign';
import { DeleteCampaign } from './domain/campagns/uses-cases/delete-campaign';
import { UpdateCampaign } from './domain/campagns/uses-cases/update-campaign';
import { ViewAllCampaigns } from './domain/campagns/uses-cases/view-all-campaigns';
import { ViewCampaign } from './domain/campagns/uses-cases/view-campaign';
import { ViewProjectCampaigns } from './domain/campagns/uses-cases/view-project-campaigns';
import { InMemoryAuthRepository } from './domain/auth/adapters/auth-repository.in-memory';
import { AuthContextProvider } from './ui/contexts/AuthContext';
import { Login } from './domain/auth/uses-cases/login';
import { Signup } from './domain/auth/uses-cases/signup';
import { InMemoryContributionRepository } from './domain/contributions/adapters/contribution-repository.in-memory';
import { FundCampaign } from './domain/contributions/uses-cases/fund-campaign';
import { RefundContribution } from './domain/contributions/uses-cases/refund-contribution';
import { ViewUserContributions } from './domain/contributions/uses-cases/view-user-contributions';
import { InMemoryProjectRepository } from './domain/projects/adapters/project-repository.in-memory';
import { CreateProject } from './domain/projects/uses-cases/create-project';
import { DeleteProject } from './domain/projects/uses-cases/delete-project';
import { UpdateProject } from './domain/projects/uses-cases/update-project';
import { ViewAllProjects } from './domain/projects/uses-cases/view-all-projects';
import { ViawAllUserProject } from './domain/projects/uses-cases/view-all-user-projects';
import { ViewProject } from './domain/projects/uses-cases/view-project';
import { UserId } from './domain/users/entities/user';
import { useAuth } from './ui/contexts/use-auth';
import MainLayout from './ui/components/layouts/MainLayout';
import AuthGuard from './ui/components/routes/AuthGuard';
import CampaignDetailsPage from './ui/pages/CampaignDetailsPage';
import CampaignPaymentPage from './ui/pages/CampaignPaymentPage';
import CampaignsPage from './ui/pages/CampaignsPage';
import CreateCampaignPage from './ui/pages/CreateCampaignPage';
import HomePage from './ui/pages/HomePage';
import CreateProjectPage from './ui/pages/CreateProjectPage';
import ProjectsPage from './ui/pages/ProjectsPage';
import EditCampaignPage from './ui/pages/EditCampaignPage';
import EditProjectPage from './ui/pages/EditProjectPage';
import MyContributionsPage from './ui/pages/MyContributionsPage';
import MyProjectsPage from './ui/pages/MyProjectsPage';
import SignupPage from './ui/pages/SignupPage';
import LoginPage from './ui/pages/LoginPage';
import ProjectDetails from './ui/pages/ProjectDetails';
import AdminPage from './ui/pages/AdminPage';
import AboutPage from './ui/pages/AboutPage';
import LegalNoticePage from './ui/pages/LegalNoticePage';
import NotFoundPage from './ui/pages/NotFoundPage';
import theme from './theme';

const projectRepository = new InMemoryProjectRepository();
const createProject = new CreateProject(projectRepository, new RealIdGenerator(), new RealDateGenerator());
const updateProject = new UpdateProject(projectRepository);
const deleteProject = new DeleteProject(projectRepository);
const viewAllProjects = new ViewAllProjects(projectRepository);
const viewAllUserProjects = new ViawAllUserProject(projectRepository);
const viewProject = new ViewProject(projectRepository);

const authRepository = new InMemoryAuthRepository(new RealIdGenerator(), new RealDateGenerator());
const signup = new Signup(authRepository);
const login = new Login(authRepository);

const campaignRepository = new InMemoryCampaignRepository();
const contributionRepository = new InMemoryContributionRepository();
const createCampaign = new CreateCampaign(campaignRepository, new RealIdGenerator(), new RealDateGenerator());
const updateCampaign = new UpdateCampaign(campaignRepository);
const deleteCampaign = new DeleteCampaign(campaignRepository);
const fundCampaign = new FundCampaign(campaignRepository, contributionRepository, new RealIdGenerator(), new RealDateGenerator());
const refundContribution = new RefundContribution(contributionRepository, campaignRepository);
const viewUserContributions = new ViewUserContributions(contributionRepository);
const viewAllCampaigns = new ViewAllCampaigns(campaignRepository);
const viewCampaign = new ViewCampaign(campaignRepository);
const viewProjectCampaigns = new ViewProjectCampaigns(campaignRepository);

function AppRoutes() {
  const { currentUser } = useAuth();
  const currentUserId = UserId(currentUser?.sub ?? '');

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage viewAllProjects={viewAllProjects} viewAllCampaigns={viewAllCampaigns} />} />
        <Route path="/projects" element={<ProjectsPage viewAllProjects={viewAllProjects} />} />
        <Route path="/campaigns" element={<CampaignsPage viewAllCampaigns={viewAllCampaigns} currentUserId={currentUserId} />} />
        <Route
          path="/campaigns/:id"
          element={
            <CampaignDetailsPage
              currentUserId={currentUserId}
              viewCampaign={viewCampaign}
              viewProject={viewProject}
              deleteCampaign={deleteCampaign}
            />
          }
        />
        <Route
          path="/campaigns/:id/fund"
          element={
            <CampaignPaymentPage
              contributorId={currentUserId}
              viewCampaign={viewCampaign}
              fundCampaign={fundCampaign}
            />
          }
        />
        <Route path="/signup" element={<SignupPage signup={signup} />} />
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/admin" element={<AdminPage viewAllCampaigns={viewAllCampaigns} />} />
        <Route path="/who-we-are" element={<AboutPage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />
        <Route path="/projects/:id" element={<ProjectDetails currentUserId={currentUserId} viewProject={viewProject} viewProjectCampaigns={viewProjectCampaigns} />} />
        <Route element={<AuthGuard />}>
          <Route path="/campaigns/:id/edit" element={<EditCampaignPage viewCampaign={viewCampaign} updateCampaign={updateCampaign} />} />
          <Route path="/projects/create" element={<CreateProjectPage createProject={createProject} currentUserId={currentUserId} />} />
          <Route path="/projects/:id/edit" element={<EditProjectPage viewProject={viewProject} updateProject={updateProject} />} />
          <Route path="/projects/:projectId/campaigns/create" element={<CreateCampaignPage currentUserId={currentUserId} createCampaign={createCampaign} viewProject={viewProject} viewProjectCampaigns={viewProjectCampaigns} />} />
          <Route path="/my-projects" element={<MyProjectsPage currentUserId={currentUserId} deleteProject={deleteProject} viewAllUserProjects={viewAllUserProjects} />} />
          <Route
            path="/my-contributions"
            element={
              <MyContributionsPage
                contributorId={currentUserId}
                viewCampaign={viewCampaign}
                viewUserContributions={viewUserContributions}
                refundContribution={refundContribution}
              />
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthContextProvider>
  )
}

export default App
