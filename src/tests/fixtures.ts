import type { IDateGenerator } from '../core/ports/date-generator.interface';
import type { IIdGenerator } from '../core/ports/id-generator.interface';
import { InMemoryCampaignRepository } from '../domain/campagns/adapters/campaign-repository.in-memory';
import type { Campaign } from '../domain/campagns/entites/campaign';
import { CreateCampaign } from '../domain/campagns/uses-cases/create-campaign';
import { DeleteCampaign } from '../domain/campagns/uses-cases/delete-campaign';
import { UpdateCampaign } from '../domain/campagns/uses-cases/update-campaign';
import { ViewAllCampaigns } from '../domain/campagns/uses-cases/view-all-campaigns';
import { ViewCampaign } from '../domain/campagns/uses-cases/view-campaign';
import { ViewProjectCampaigns } from '../domain/campagns/uses-cases/view-project-campaigns';
import { InMemoryContributionRepository } from '../domain/contributions/adapters/contribution-repository.in-memory';
import type { Contribution } from '../domain/contributions/entities/contribution';
import { FundCampaign } from '../domain/contributions/uses-cases/fund-campaign';
import { RefundContribution } from '../domain/contributions/uses-cases/refund-contribution';
import { ViewUserContributions } from '../domain/contributions/uses-cases/view-user-contributions';
import { InMemoryProjectRepository } from '../domain/projects/adapters/project-repository.in-memory';
import type { Project } from '../domain/projects/entities/project';
import { CreateProject } from '../domain/projects/uses-cases/create-project';
import { DeleteProject } from '../domain/projects/uses-cases/delete-project';
import { UpdateProject } from '../domain/projects/uses-cases/update-project';
import { ViewAllProjects } from '../domain/projects/uses-cases/view-all-projects';
import { ViawAllUserProject } from '../domain/projects/uses-cases/view-all-user-projects';
import { ViewProject } from '../domain/projects/uses-cases/view-project';

export class AppTestFixture {
  private idCounter = 0;
  private fixedDate = new Date('2026-03-15T10:00:00.000Z');

  private projectRepository!: InMemoryProjectRepository;
  private campaignRepository!: InMemoryCampaignRepository;
  private contributionRepository!: InMemoryContributionRepository;

  private idGenerator: IIdGenerator = {
    generate: () => `generated-id-${++this.idCounter}`,
  };

  private dateGenerator: IDateGenerator = {
    now: () => this.fixedDate,
  };

  // Use cases
  createProject!: CreateProject;
  updateProject!: UpdateProject;
  deleteProject!: DeleteProject;
  viewAllProjects!: ViewAllProjects;
  viewAllUserProjects!: ViawAllUserProject;
  viewProject!: ViewProject;

  createCampaign!: CreateCampaign;
  updateCampaign!: UpdateCampaign;
  deleteCampaign!: DeleteCampaign;
  viewAllCampaigns!: ViewAllCampaigns;
  viewCampaign!: ViewCampaign;
  viewProjectCampaigns!: ViewProjectCampaigns;

  fundCampaign!: FundCampaign;
  refundContribution!: RefundContribution;
  viewUserContributions!: ViewUserContributions;

  init(options?: {
    projects?: Project[];
    campaigns?: Campaign[];
    contributions?: Contribution[];
  }) {
    this.idCounter = 0;

    this.projectRepository = new InMemoryProjectRepository(options?.projects ?? []);
    this.campaignRepository = new InMemoryCampaignRepository(options?.campaigns ?? []);
    this.contributionRepository = new InMemoryContributionRepository(options?.contributions ?? []);

    // Project use cases
    this.createProject = new CreateProject(this.projectRepository, this.idGenerator, this.dateGenerator);
    this.updateProject = new UpdateProject(this.projectRepository);
    this.deleteProject = new DeleteProject(this.projectRepository);
    this.viewAllProjects = new ViewAllProjects(this.projectRepository);
    this.viewAllUserProjects = new ViawAllUserProject(this.projectRepository);
    this.viewProject = new ViewProject(this.projectRepository);

    // Campaign use cases
    this.createCampaign = new CreateCampaign(this.campaignRepository, this.idGenerator, this.dateGenerator);
    this.updateCampaign = new UpdateCampaign(this.campaignRepository);
    this.deleteCampaign = new DeleteCampaign(this.campaignRepository);
    this.viewAllCampaigns = new ViewAllCampaigns(this.campaignRepository);
    this.viewCampaign = new ViewCampaign(this.campaignRepository);
    this.viewProjectCampaigns = new ViewProjectCampaigns(this.campaignRepository);

    // Contribution use cases
    this.fundCampaign = new FundCampaign(this.campaignRepository, this.contributionRepository, this.idGenerator, this.dateGenerator);
    this.refundContribution = new RefundContribution(this.contributionRepository, this.campaignRepository);
    this.viewUserContributions = new ViewUserContributions(this.contributionRepository);
  }

  getProjectRepository() {
    return this.projectRepository;
  }

  getCampaignRepository() {
    return this.campaignRepository;
  }

  getContributionRepository() {
    return this.contributionRepository;
  }
}
