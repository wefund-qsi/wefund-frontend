/**
 * @fileoverview
 * Point d'entrée principal de l'application WeFund.
 *
 * Ce fichier configure et initialise l'application React avec :
 * - Le routage via React Router
 * - Le thème Material-UI
 * - Les repositories et use cases du domaine (architecture en couches)
 * - Les gardes d'authentification pour les routes protégées
 *
 * Architecture : Cette application suit une architecture en oignons (Hexagonal)
 * avec séparation des responsabilités entre domain, infrastructure et UI.
 */

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RealDateGenerator } from './core/adapters/real-date-generator';
import { RealIdGenerator } from './core/adapters/real-id-generator';

/**
 * ============================================================================
 * IMPORTS - REPOSITORIES & USE CASES
 * ============================================================================
 *
 * Les repositories et use cases sont instanciés au niveau de l'App
 * pour être injectés dans les composants via les props.
 * Cette approche permet une meilleure testabilité et flexibilité.
 */

// Campaign Domain
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

/**
 * ============================================================================
 * IMPORTS - COMPOSANTS UI
 * ============================================================================
 *
 * Tous les composants de pages et de layout sont importés ici.
 * Les routes sont configurées dans le composant AppRoutes().
 */

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

/**
 * ============================================================================
 * INSTANCIATION DES REPOSITORIES ET USE CASES
 * ============================================================================
 *
 * Tous les repositories et use cases sont instanciés ici au niveau global.
 * Les dépendances sont injectées via le constructeur (Dependency Injection).
 *
 * NOTE: En environnement de production, ces instances pourraient être
 * gérées par un conteneur IoC (Inversion of Control) pour une meilleure
 * scalabilité et testabilité.
 *
 * REPOSITORIES:
 * - InMemoryProjectRepository: Gère les projets en mémoire
 * - InMemoryAuthRepository: Gère l'authentification des utilisateurs
 * - InMemoryCampaignRepository: Gère les campagnes de financement
 * - InMemoryContributionRepository: Gère les contributions aux campagnes
 */

/**
 * PROJECT DOMAIN
 * Use cases pour gérer le cycle de vie des projets
 */
const projectRepository = new InMemoryProjectRepository();
const createProject = new CreateProject(projectRepository, new RealIdGenerator(), new RealDateGenerator());
const updateProject = new UpdateProject(projectRepository);
const deleteProject = new DeleteProject(projectRepository);
const viewAllProjects = new ViewAllProjects(projectRepository);
const viewAllUserProjects = new ViawAllUserProject(projectRepository);
const viewProject = new ViewProject(projectRepository);

/**
 * AUTH DOMAIN
 * Use cases pour l'authentification et l'enregistrement des utilisateurs
 */
const authRepository = new InMemoryAuthRepository(new RealIdGenerator(), new RealDateGenerator());
const signup = new Signup(authRepository);
const login = new Login(authRepository);

/**
 * CAMPAIGN DOMAIN
 * Use cases pour gérer les campagnes de financement et les contributions
 */
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

/**
 * ============================================================================
 * COMPOSANT APPROUTES
 * ============================================================================
 *
 * Composant interne qui définit toutes les routes de l'application.
 * Les routes sont organisées par domaine (projects, campaigns, auth, etc.)
 *
 * HIÉRARCHIE DES ROUTES:
 * - Routes publiques: HomePage, ProjectsPage, CampaignsPage, etc.
 * - Routes protégées (AuthGuard): MyProjectsPage, MyContributionsPage, CreateProject, etc.
 * - Route de fallback: NotFoundPage (404)
 *
 * @returns {JSX.Element} Le composant layout avec les routes
 */
function AppRoutes() {
  const { currentUser } = useAuth();
  const currentUserId = UserId(currentUser?.sub ?? '');

  return (
    <MainLayout>
      <Routes>
        {/* ===== ROUTES PUBLIQUES ===== */}
        {/* Page d'accueil affichant les projets et campagnes en vedette */}
        <Route path="/" element={<HomePage viewAllProjects={viewAllProjects} viewAllCampaigns={viewAllCampaigns} />} />

        {/* Catalogue de tous les projets disponibles */}
        <Route path="/projects" element={<ProjectsPage viewAllProjects={viewAllProjects} />} />

        {/* Catalogue de toutes les campagnes de financement */}
        <Route path="/campaigns" element={<CampaignsPage viewAllCampaigns={viewAllCampaigns} currentUserId={currentUserId} />} />

        {/* Détails d'une campagne spécifique et option de suppression (si propriétaire) */}
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

        {/* Page de paiement pour contribuer à une campagne */}
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

        {/* Inscription d'un nouvel utilisateur */}
        <Route path="/signup" element={<SignupPage signup={signup} />} />

        {/* Connexion d'un utilisateur existant */}
        <Route path="/login" element={<LoginPage login={login} />} />

        {/* Panneau d'administration pour les administrateurs */}
        <Route path="/admin" element={<AdminPage viewAllCampaigns={viewAllCampaigns} />} />

        {/* Pages informations */}
        <Route path="/who-we-are" element={<AboutPage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />

        {/* Détails d'un projet et ses campagnes associées */}
        <Route path="/projects/:id" element={<ProjectDetails currentUserId={currentUserId} viewProject={viewProject} viewProjectCampaigns={viewProjectCampaigns} />} />

        {/* ===== ROUTES PROTÉGÉES (Nécessitent une authentification) ===== */}
        <Route element={<AuthGuard />}>
          {/* Modification d'une campagne existante (propriétaire uniquement) */}
          <Route path="/campaigns/:id/edit" element={<EditCampaignPage viewCampaign={viewCampaign} updateCampaign={updateCampaign} />} />

          {/* Création d'un nouveau projet */}
          <Route path="/projects/create" element={<CreateProjectPage createProject={createProject} currentUserId={currentUserId} />} />

          {/* Modification d'un projet existant (propriétaire uniquement) */}
          <Route path="/projects/:id/edit" element={<EditProjectPage viewProject={viewProject} updateProject={updateProject} />} />

          {/* Création d'une nouvelle campagne pour un projet */}
          <Route path="/projects/:projectId/campaigns/create" element={<CreateCampaignPage currentUserId={currentUserId} createCampaign={createCampaign} viewProject={viewProject} viewProjectCampaigns={viewProjectCampaigns} />} />

          {/* Liste des projets créés par l'utilisateur connecté */}
          <Route path="/my-projects" element={<MyProjectsPage currentUserId={currentUserId} deleteProject={deleteProject} viewAllUserProjects={viewAllUserProjects} />} />

          {/* Liste des campagnes auxquelles l'utilisateur a contribué */}
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

        {/* ===== FALLBACK ROUTE ===== */}
        {/* Page 404 pour les routes non trouvées */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

/**
 * ============================================================================
 * COMPOSANT APP - POINT D'ENTRÉE PRINCIPAL
 * ============================================================================
 *
 * Configure l'arborescence de fournisseurs (Providers) de l'application:
 * 1. AuthContextProvider: Fournit le contexte d'authentification
 * 2. ThemeProvider: Applique le thème Material-UI
 * 3. CssBaseline: Réinitialise les styles par défaut du navigateur
 * 4. BrowserRouter: Active le routage côté client
 * 5. AppRoutes: Render les routes de l'application
 *
 * ORDRE IMPORTANT: Les providers sont imbriqués pour que AuthContext soit accessible
 * à tous les composants de l'application.
 *
 * @returns {JSX.Element} L'arborescence complète de l'application
 */
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
