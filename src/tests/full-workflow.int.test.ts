import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from './fixtures';
import { CampaignId } from '../domain/campagns/entites/campaign';
import { ProjectId } from '../domain/projects/entities/project';
import { UserId } from '../domain/users/entities/user';

describe('Full workflow: project → campaign → funding → refund (integration)', () => {
  let fixture: AppTestFixture;

  beforeEach(() => {
    fixture = new AppTestFixture();
    fixture.init();
  });

  it('should support a complete crowdfunding lifecycle', async () => {
    // 1. Create a project
    const project = await fixture.createProject.execute({
      title: 'Refuge Animaux',
      description: 'Un refuge pour les animaux abandonnés',
      photoUrl: 'https://example.com/refuge.jpg',
      ownerId: UserId('owner-1'),
    });

    expect(project.id).toBeDefined();

    // 2. Create a campaign for this project
    const campaign = await fixture.createCampaign.execute({
      projectId: project.id,
      ownerId: UserId('owner-1'),
      title: 'Financer le refuge',
      description: 'Collecte pour les soins et la nourriture',
      goal: 5000,
      endDate: '2026-12-01',
    });

    expect(campaign.status).toBe('BROUILLON');

    // 3. Verify campaign is associated with project
    const projectCampaigns = await fixture.viewProjectCampaigns.execute(project.id);
    expect(projectCampaigns).toHaveLength(1);
    expect(projectCampaigns[0].id).toBe(campaign.id);

    // 4. Submit for review (update status to EN_ATTENTE)
    const submitted = await fixture.updateCampaign.execute({
      id: campaign.id,
      values: {
        title: campaign.title,
        description: campaign.description,
        goal: campaign.goal,
        endDate: campaign.endDate,
      },
      nextStatus: 'EN_ATTENTE',
    });

    expect(submitted.status).toBe('EN_ATTENTE');
  });

  it('should handle multiple contributors funding and refunding', async () => {
    fixture.init({
      campaigns: [
        {
          id: CampaignId('campaign-1'),
          projectId: ProjectId('project-1'),
          title: 'Campagne active',
          description: 'Description',
          goal: 5000,
          endDate: '2026-12-01',
          ownerId: UserId('owner-1'),
          createdAt: '2026-01-01T10:00:00.000Z',
          status: 'ACTIVE',
          startedAt: '2026-02-01T10:00:00.000Z',
          collectedAmount: 0,
        },
      ],
    });

    // Multiple contributors fund the campaign
    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-1'),
      contributorId: UserId('contributor-1'),
      amount: 1000,
    });

    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-1'),
      contributorId: UserId('contributor-2'),
      amount: 2000,
    });

    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-1'),
      contributorId: UserId('contributor-1'),
      amount: 500,
    });

    // Verify total collected
    const campaign = await fixture.viewCampaign.execute(CampaignId('campaign-1'));
    expect(campaign).not.toBeNull();
    if (campaign && campaign.status === 'ACTIVE') {
      expect(campaign.collectedAmount).toBe(3500);
    }

    // Verify contributor-1 has 2 contributions
    const contributions1 = await fixture.viewUserContributions.execute(UserId('contributor-1'));
    expect(contributions1).toHaveLength(2);

    // Contributor-1 refunds one contribution
    const updatedCampaign = await fixture.refundContribution.execute(contributions1[0].id);
    if (updatedCampaign.status === 'ACTIVE') {
      expect(updatedCampaign.collectedAmount).toBe(3500 - contributions1[0].amount);
    }

    // Verify contributor-1 now has 1 contribution
    const afterRefund = await fixture.viewUserContributions.execute(UserId('contributor-1'));
    expect(afterRefund).toHaveLength(1);
  });

  it('should allow project owner to manage multiple campaigns', async () => {
    const project = await fixture.createProject.execute({
      title: 'Mon grand projet',
      description: 'Un projet ambitieux',
      photoUrl: 'https://example.com/grand.jpg',
      ownerId: UserId('owner-1'),
    });

    // Create multiple campaigns for the same project
    await fixture.createCampaign.execute({
      projectId: project.id,
      ownerId: UserId('owner-1'),
      title: 'Phase 1',
      description: 'Première phase',
      goal: 3000,
      endDate: '2026-06-01',
    });

    await fixture.createCampaign.execute({
      projectId: project.id,
      ownerId: UserId('owner-1'),
      title: 'Phase 2',
      description: 'Deuxième phase',
      goal: 5000,
      endDate: '2026-09-01',
    });

    const campaigns = await fixture.viewProjectCampaigns.execute(project.id);
    expect(campaigns).toHaveLength(2);

    // Delete one campaign
    await fixture.deleteCampaign.execute(campaigns[0].id);

    const remaining = await fixture.viewProjectCampaigns.execute(project.id);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].title).toBe('Phase 2');
  });
});
