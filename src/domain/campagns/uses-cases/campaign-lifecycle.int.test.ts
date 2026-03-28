import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from '../../../tests/fixtures';
import { CampaignId } from '../entites/campaign';
import { ProjectId } from '../../projects/entities/project';
import { UserId } from '../../users/entities/user';
import { CampaignNotFoundException } from '../exceptions/campaign-not-found';

describe('Campaign lifecycle (integration)', () => {
  let fixture: AppTestFixture;

  beforeEach(() => {
    fixture = new AppTestFixture();
    fixture.init({
      projects: [
        {
          id: ProjectId('project-1'),
          title: 'Projet test',
          description: 'Description',
          photoUrl: 'https://example.com/photo.jpg',
          ownerId: UserId('owner-1'),
          createdAt: new Date('2026-01-01T10:00:00.000Z'),
        },
        {
          id: ProjectId('project-2'),
          title: 'Projet test 2',
          description: 'Description 2',
          photoUrl: 'https://example.com/photo2.jpg',
          ownerId: UserId('owner-1'),
          createdAt: new Date('2026-01-05T10:00:00.000Z'),
        },
      ],
    });
  });

  it('should create a campaign and retrieve it by id', async () => {
    const campaign = await fixture.createCampaign.execute({
      projectId: ProjectId('project-1'),
      ownerId: UserId('owner-1'),
      title: 'Ma campagne',
      description: 'Description campagne',
      goal: 5000,
      endDate: '2026-09-01',
    });

    const retrieved = await fixture.viewCampaign.execute(campaign.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved!.title).toBe('Ma campagne');
    expect(retrieved!.status).toBe('BROUILLON');
    expect(retrieved!.projectId).toBe('project-1');
  });

  it('should create a campaign, update it and view updated data', async () => {
    const campaign = await fixture.createCampaign.execute({
      projectId: ProjectId('project-1'),
      ownerId: UserId('owner-1'),
      title: 'Campagne initiale',
      description: 'Description',
      goal: 3000,
      endDate: '2026-08-01',
    });

    const updated = await fixture.updateCampaign.execute({
      id: campaign.id,
      values: {
        title: 'Campagne modifiée',
        description: 'Nouvelle description',
        goal: 5000,
        endDate: '2026-10-01',
      },
    });

    expect(updated.title).toBe('Campagne modifiée');
    expect(updated.goal).toBe(5000);

    const retrieved = await fixture.viewCampaign.execute(campaign.id);
    expect(retrieved!.title).toBe('Campagne modifiée');
  });

  it('should update campaign status from BROUILLON to EN_ATTENTE', async () => {
    const campaign = await fixture.createCampaign.execute({
      projectId: ProjectId('project-1'),
      ownerId: UserId('owner-1'),
      title: 'Campagne brouillon',
      description: 'Description',
      goal: 2000,
      endDate: '2026-07-01',
    });

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

  it('should create a campaign and delete it', async () => {
    const campaign = await fixture.createCampaign.execute({
      projectId: ProjectId('project-1'),
      ownerId: UserId('owner-1'),
      title: 'Campagne à supprimer',
      description: 'Description',
      goal: 1000,
      endDate: '2026-06-01',
    });

    await fixture.deleteCampaign.execute(campaign.id);

    const deleted = await fixture.viewCampaign.execute(campaign.id);
    expect(deleted).toBeNull();
  });

  it('should throw CampaignNotFoundException when deleting non-existent campaign', async () => {
    await expect(
      fixture.deleteCampaign.execute(CampaignId('non-existent')),
    ).rejects.toThrow(CampaignNotFoundException);
  });

  it('should throw CampaignNotFoundException when updating non-existent campaign', async () => {
    await expect(
      fixture.updateCampaign.execute({
        id: CampaignId('non-existent'),
        values: { title: 'X', description: 'X', goal: 100, endDate: '2026-12-01' },
      }),
    ).rejects.toThrow(CampaignNotFoundException);
  });

  it('should list all campaigns', async () => {
    await fixture.createCampaign.execute({
      projectId: ProjectId('project-1'),
      ownerId: UserId('owner-1'),
      title: 'Campagne 1',
      description: 'Description',
      goal: 1000,
      endDate: '2026-06-01',
    });

    await fixture.createCampaign.execute({
      projectId: ProjectId('project-2'),
      ownerId: UserId('owner-1'),
      title: 'Campagne 2',
      description: 'Description',
      goal: 2000,
      endDate: '2026-07-01',
    });

    const all = await fixture.viewAllCampaigns.execute();

    expect(all).toHaveLength(2);
  });

  it('should list campaigns by project', async () => {
    await fixture.createCampaign.execute({
      projectId: ProjectId('project-1'),
      ownerId: UserId('owner-1'),
      title: 'Campagne projet 1',
      description: 'Description',
      goal: 1000,
      endDate: '2026-06-01',
    });

    await fixture.createCampaign.execute({
      projectId: ProjectId('project-2'),
      ownerId: UserId('owner-1'),
      title: 'Campagne projet 2',
      description: 'Description',
      goal: 2000,
      endDate: '2026-07-01',
    });

    const campaignsProject1 = await fixture.viewProjectCampaigns.execute(ProjectId('project-1'));

    expect(campaignsProject1).toHaveLength(1);
    expect(campaignsProject1[0].title).toBe('Campagne projet 1');

    const campaignsProject2 = await fixture.viewProjectCampaigns.execute(ProjectId('project-2'));

    expect(campaignsProject2).toHaveLength(1);
    expect(campaignsProject2[0].title).toBe('Campagne projet 2');
  });
});
