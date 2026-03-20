import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RealDateGenerator } from './core/adapters/real-date-generator';
import { RealIdGenerator } from './core/adapters/real-id-generator';
import { InMemoryCampaignRepository } from './domain/campagns/adapters/campaign-repository.in-memory';
import { CampaignId } from './domain/campagns/entites/campaign';
import { CreateCampaign } from './domain/campagns/uses-cases/create-campaign';
import { DeleteCampaign } from './domain/campagns/uses-cases/delete-campaign';
import { UpdateCampaign } from './domain/campagns/uses-cases/update-campaign';
import { ViewAllCampaigns } from './domain/campagns/uses-cases/view-all-campaigns';
import { ViewCampaign } from './domain/campagns/uses-cases/view-campaign';
import { ViewProjectCampaigns } from './domain/campagns/uses-cases/view-project-campaigns';
import { HttpAuthRepository } from './domain/auth/adapters/auth-repository.http';
import { AuthContextProvider } from './ui/contexts/AuthContext';
import { Login } from './domain/auth/uses-cases/login';
import { Signup } from './domain/auth/uses-cases/signup';
import { InMemoryContributionRepository } from './domain/contributions/adapters/contribution-repository.in-memory';
import { ContributionId } from './domain/contributions/entities/contribution';
import { FundCampaign } from './domain/contributions/uses-cases/fund-campaign';
import { RefundContribution } from './domain/contributions/uses-cases/refund-contribution';
import { ViewUserContributions } from './domain/contributions/uses-cases/view-user-contributions';
import { InMemoryProjectRepository } from './domain/projects/adapters/project-repository.in-memory';
import { ProjectId } from './domain/projects/entities/project';
import { CreateProject } from './domain/projects/uses-cases/create-project';
import { DeleteProject } from './domain/projects/uses-cases/delete-project';
import { UpdateProject } from './domain/projects/uses-cases/update-project';
import { ViewAllProjects } from './domain/projects/uses-cases/view-all-projects';
import { ViawAllUserProject } from './domain/projects/uses-cases/view-all-user-projects';
import { ViewProject } from './domain/projects/uses-cases/view-project';
import { UserId } from './domain/users/entities/user';
import MainLayout from './ui/components/layouts/MainLayout';
import CampaignDetailsPage from './ui/pages/CampaignDetailsPage';
import CampaignPaymentPage from './ui/pages/CampaignPaymentPage';
import CampaignsPage from './ui/pages/CampaignsPage';
import CreateCampaignPage from './ui/pages/CreateCampaignPage';
import HomePage from './ui/pages/HomePage';
import CreateProjectPage from './ui/pages/CreateProjectPage';
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
import theme from './theme';

const seededProjects = [
  {
    id: ProjectId('project-animal'),
    title: 'Refuge Seconde Chance',
    description: 'Un refuge pour accueillir, soigner et rehabiliter des animaux victimes de maltraitance et d abandon.',
    photoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
    ownerId: UserId('seed-owner-1'),
    createdAt: new Date('2026-01-10T10:00:00.000Z'),
  },
  {
    id: ProjectId('project-art'),
    title: 'Sortie du court metrage Eclats de Nuit',
    description: 'Un projet de diffusion pour finaliser et sortir un court metrage independant en festival, en salle associative et en ligne.',
    photoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    ownerId: UserId('seed-owner-1'),
    createdAt: new Date('2026-01-12T10:00:00.000Z'),
  },
  {
    id: ProjectId('project-humanitarian'),
    title: 'Passerelle Humanitaire',
    description: 'Une initiative de soutien d urgence pour fournir des kits essentiels, des repas et un accompagnement aux familles deplacees.',
    photoUrl: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=1200&q=80',
    ownerId: UserId('seed-owner-1'),
    createdAt: new Date('2026-01-15T10:00:00.000Z'),
  },
];

const seededCampaigns = [
  {
    id: CampaignId('campaign-animal-1'),
    projectId: ProjectId('project-animal'),
    title: 'Amenager le refuge et financer les soins veterinaire',
    description: 'Financer les box de quarantaine, les soins d urgence, la nourriture et la remise en etat du refuge.',
    goal: 12000,
    endDate: '2026-10-15',
    ownerId: UserId('seed-owner-1'),
    createdAt: '2026-02-01T10:00:00.000Z',
    status: 'ACTIVE' as const,
    startedAt: '2026-02-15T10:00:00.000Z',
    collectedAmount: 5400,
  },
  {
    id: CampaignId('campaign-animal-2'),
    projectId: ProjectId('project-animal'),
    title: 'Lancer une cellule de sauvetage pour animaux maltraites',
    description: 'Cette campagne finance les transports d urgence, le materiel de premiers soins et l accueil temporaire des animaux retires de situations de violence.',
    goal: 8500,
    endDate: '2026-12-10',
    ownerId: UserId('seed-owner-1'),
    createdAt: '2026-03-05T10:00:00.000Z',
    status: 'BROUILLON' as const,
  },
  {
    id: CampaignId('campaign-animal-3'),
    projectId: ProjectId('project-animal'),
    title: 'Renover l espace de convalescence',
    description: 'Campagne terminee ayant permis de financer des cages adaptees, un espace de repos chauffe et du materiel de suivi post-operatoire.',
    goal: 6000,
    endDate: '2026-05-30',
    ownerId: UserId('seed-owner-1'),
    createdAt: '2026-01-05T10:00:00.000Z',
    status: 'REUSSIE' as const,
    startedAt: '2026-01-20T10:00:00.000Z',
    completedAt: '2026-05-28T18:00:00.000Z',
    collectedAmount: 6400,
  },
  {
    id: CampaignId('campaign-art-1'),
    projectId: ProjectId('project-art'),
    title: 'Finaliser la post-production et organiser la sortie',
    description: 'Cette campagne finance l etalonnage, le mixage son, les sous-titres, l affiche et les inscriptions en festival du court metrage.',
    goal: 7000,
    endDate: '2026-09-01',
    ownerId: UserId('seed-owner-1'),
    createdAt: '2026-02-10T10:00:00.000Z',
    status: 'BROUILLON' as const,
  },
  {
    id: CampaignId('campaign-humanitarian-1'),
    projectId: ProjectId('project-humanitarian'),
    title: 'Distribuer 500 kits de premiere necessite',
    description: 'Objectif de financement pour acheter et distribuer des kits d hygiene, couvertures et repas a des familles vulnerables.',
    goal: 20000,
    endDate: '2026-11-20',
    ownerId: UserId('seed-owner-1'),
    createdAt: '2026-02-18T10:00:00.000Z',
    status: 'ACTIVE' as const,
    startedAt: '2026-03-01T10:00:00.000Z',
    collectedAmount: 7200,
  },
];

const CURRENT_USER_ID = UserId('seed-owner-1');
const CURRENT_CONTRIBUTOR_ID = UserId('seed-contributor-1');

const seededContributions = [
  {
    id: ContributionId('contribution-1'),
    campaignId: CampaignId('campaign-animal-1'),
    contributorId: CURRENT_CONTRIBUTOR_ID,
    amount: 120,
    createdAt: '2026-03-03T10:00:00.000Z',
  },
  {
    id: ContributionId('contribution-2'),
    campaignId: CampaignId('campaign-humanitarian-1'),
    contributorId: CURRENT_CONTRIBUTOR_ID,
    amount: 75,
    createdAt: '2026-03-08T10:00:00.000Z',
  },
  {
    id: ContributionId('contribution-3'),
    campaignId: CampaignId('campaign-animal-3'),
    contributorId: CURRENT_CONTRIBUTOR_ID,
    amount: 50,
    createdAt: '2026-02-15T10:00:00.000Z',
  },
];

const projectRepository = new InMemoryProjectRepository(seededProjects);
const createProject = new CreateProject(projectRepository, new RealIdGenerator(), new RealDateGenerator());
const updateProject = new UpdateProject(projectRepository);
const deleteProject = new DeleteProject(projectRepository);
const viewAllProjects = new ViewAllProjects(projectRepository);
const viewAllUserProjects = new ViawAllUserProject(projectRepository);
const viewProject = new ViewProject(projectRepository);

const authRepository = new HttpAuthRepository('http://localhost:3000');
const signup = new Signup(authRepository);
const login = new Login(authRepository);

const campaignRepository = new InMemoryCampaignRepository(seededCampaigns);
const contributionRepository = new InMemoryContributionRepository(seededContributions);
const createCampaign = new CreateCampaign(campaignRepository, new RealIdGenerator(), new RealDateGenerator());
const updateCampaign = new UpdateCampaign(campaignRepository);
const deleteCampaign = new DeleteCampaign(campaignRepository);
const fundCampaign = new FundCampaign(campaignRepository, contributionRepository, new RealIdGenerator(), new RealDateGenerator());
const refundContribution = new RefundContribution(contributionRepository, campaignRepository);
const viewUserContributions = new ViewUserContributions(contributionRepository);
const viewAllCampaigns = new ViewAllCampaigns(campaignRepository);
const viewCampaign = new ViewCampaign(campaignRepository);
const viewProjectCampaigns = new ViewProjectCampaigns(campaignRepository);

function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage viewAllProjects={viewAllProjects} />} />
            <Route path="/campaigns" element={<CampaignsPage viewAllCampaigns={viewAllCampaigns} />} />
            <Route
              path="/campaigns/:id"
              element={
                <CampaignDetailsPage
                  currentUserId={CURRENT_USER_ID}
                  viewCampaign={viewCampaign}
                  deleteCampaign={deleteCampaign}
                />
              }
            />
            <Route
              path="/campaigns/:id/fund"
              element={
                <CampaignPaymentPage
                  contributorId={CURRENT_CONTRIBUTOR_ID}
                  viewCampaign={viewCampaign}
                  fundCampaign={fundCampaign}
                />
              }
            />
            <Route path="/campaigns/:id/edit" element={<EditCampaignPage viewCampaign={viewCampaign} updateCampaign={updateCampaign} />} />
            <Route path="/projects/create" element={<CreateProjectPage createProject={createProject} currentUserId={CURRENT_USER_ID} />} />
            <Route path="/projects/:id/edit" element={<EditProjectPage viewProject={viewProject} updateProject={updateProject} />} />
            <Route path="/projects/:projectId/campaigns/create" element={<CreateCampaignPage currentUserId={CURRENT_USER_ID} createCampaign={createCampaign} />} />
            <Route path="/my-projects" element={<MyProjectsPage currentUserId={CURRENT_USER_ID} deleteProject={deleteProject} viewAllUserProjects={viewAllUserProjects} />} />
            <Route
              path="/my-contributions"
              element={
                <MyContributionsPage
                  contributorId={CURRENT_CONTRIBUTOR_ID}
                  viewCampaign={viewCampaign}
                  viewUserContributions={viewUserContributions}
                  refundContribution={refundContribution}
                />
              }
            />
            <Route path="/signup" element={<SignupPage signup={signup} />} />
            <Route path="/login" element={<LoginPage login={login} />} />
            <Route path="/admin" element={<AdminPage viewAllCampaigns={viewAllCampaigns} />} />
            <Route path="/who-we-are" element={<AboutPage />} />
            <Route path="/legal-notice" element={<LegalNoticePage />} />
            <Route path="/projects/:id" element={<ProjectDetails currentUserId={CURRENT_USER_ID} viewProject={viewProject} viewProjectCampaigns={viewProjectCampaigns} />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
    </AuthContextProvider>
  )
}

export default App
