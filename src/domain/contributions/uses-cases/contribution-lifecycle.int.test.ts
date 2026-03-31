import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from '../../../tests/fixtures';
import { CampaignId } from '../../campagns/entites/campaign';
import { ContributionId } from '../entities/contribution';
import { ProjectId } from '../../projects/entities/project';
import { UserId } from '../../users/entities/user';
import { CampaignNotActiveException } from '../exceptions/campaign-not-active';
import { ContributionActionForbiddenException } from '../exceptions/contribution-action-forbidden';

/**
 * Tests d'intégration pour le cycle de vie complet des contributions
 *
 * Vérifie le financement des campagnes, les remboursements, les listes de contributions
 * et la gestion des erreurs lors de contributions sur des campagnes inactives.
 */
describe('Contribution lifecycle (integration)', () => {
  let fixture: AppTestFixture;

  beforeEach(() => {
    fixture = new AppTestFixture();
    fixture.init({
      campaigns: [
        {
          id: CampaignId('campaign-active'),
          projectId: ProjectId('project-1'),
          title: 'Campagne active',
          description: 'Description',
          goal: 10000,
          endDate: '2026-12-01',
          ownerId: UserId('owner-1'),
          createdAt: '2026-01-01T10:00:00.000Z',
          status: 'ACTIVE',
          startedAt: '2026-02-01T10:00:00.000Z',
          collectedAmount: 2000,
        },
        {
          id: CampaignId('campaign-draft'),
          projectId: ProjectId('project-1'),
          title: 'Campagne brouillon',
          description: 'Description',
          goal: 5000,
          endDate: '2026-11-01',
          ownerId: UserId('owner-1'),
          createdAt: '2026-01-05T10:00:00.000Z',
          status: 'BROUILLON',
        },
      ],
    });
  });

  it('should fund an active campaign and create a contribution', async () => {
    const result = await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-active'),
      contributorId: UserId('contributor-1'),
      amount: 500,
    });

    expect(result.status).toBe('ACTIVE');
    if (result.status === 'ACTIVE') {
      expect(result.collectedAmount).toBe(2500);
    }

    const contributions = await fixture.viewUserContributions.execute(UserId('contributor-1'));
    expect(contributions).toHaveLength(1);
    expect(contributions[0].amount).toBe(500);
  });

  it('should fund multiple times and accumulate collected amount', async () => {
    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-active'),
      contributorId: UserId('contributor-1'),
      amount: 300,
    });

    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-active'),
      contributorId: UserId('contributor-2'),
      amount: 700,
    });

    const campaign = await fixture.viewCampaign.execute(CampaignId('campaign-active'));
    expect(campaign).not.toBeNull();
    if (campaign && campaign.status === 'ACTIVE') {
      expect(campaign.collectedAmount).toBe(3000);
    }
  });

  it('should refuse funding a non-active campaign', async () => {
    await expect(
      fixture.fundCampaign.execute({
        campaignId: CampaignId('campaign-draft'),
        contributorId: UserId('contributor-1'),
        amount: 100,
      }),
    ).rejects.toThrow(CampaignNotActiveException);
  });

  it('should fund then refund a contribution', async () => {
    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-active'),
      contributorId: UserId('contributor-1'),
      amount: 1000,
    });

    const contributions = await fixture.viewUserContributions.execute(UserId('contributor-1'));
    expect(contributions).toHaveLength(1);

    const campaign = await fixture.refundContribution.execute(contributions[0].id);

    expect(campaign.status).toBe('ACTIVE');
    if (campaign.status === 'ACTIVE') {
      expect(campaign.collectedAmount).toBe(2000);
    }

    const afterRefund = await fixture.viewUserContributions.execute(UserId('contributor-1'));
    expect(afterRefund).toHaveLength(0);
  });

  it('should list contributions by contributor', async () => {
    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-active'),
      contributorId: UserId('contributor-1'),
      amount: 200,
    });

    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-active'),
      contributorId: UserId('contributor-1'),
      amount: 300,
    });

    await fixture.fundCampaign.execute({
      campaignId: CampaignId('campaign-active'),
      contributorId: UserId('contributor-2'),
      amount: 150,
    });

    const contributor1 = await fixture.viewUserContributions.execute(UserId('contributor-1'));
    expect(contributor1).toHaveLength(2);

    const contributor2 = await fixture.viewUserContributions.execute(UserId('contributor-2'));
    expect(contributor2).toHaveLength(1);
  });

  it('should refuse refund on failed campaign', async () => {
    fixture.init({
      campaigns: [
        {
          id: CampaignId('campaign-failed'),
          projectId: ProjectId('project-1'),
          title: 'Campagne échouée',
          description: 'Description',
          goal: 5000,
          endDate: '2026-06-01',
          ownerId: UserId('owner-1'),
          createdAt: '2026-01-01T10:00:00.000Z',
          status: 'ECHOUEE',
          startedAt: '2026-02-01T10:00:00.000Z',
          completedAt: '2026-06-01T10:00:00.000Z',
          collectedAmount: 1000,
        },
      ],
      contributions: [
        {
          id: ContributionId('contribution-1'),
          campaignId: CampaignId('campaign-failed'),
          contributorId: UserId('contributor-1'),
          amount: 200,
          createdAt: '2026-03-01T10:00:00.000Z',
        },
      ],
    });

    await expect(
      fixture.refundContribution.execute(ContributionId('contribution-1')),
    ).rejects.toThrow(ContributionActionForbiddenException);
  });
});
