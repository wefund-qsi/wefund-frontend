import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from '../../tests/fixtures';
import { CampaignId } from '../../domain/campagns/entites/campaign';
import { ProjectId } from '../../domain/projects/entities/project';
import { UserId } from '../../domain/users/entities/user';
import '../../infrastructure/i18n';
import CampaignsPage from './CampaignsPage';

describe('CampaignsPage (e2e)', () => {
  let fixture: AppTestFixture;

  beforeEach(() => {
    fixture = new AppTestFixture();
  });

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <CampaignsPage
          viewAllCampaigns={fixture.viewAllCampaigns}
          currentUserId={UserId('owner-1')}
        />
      </MemoryRouter>,
    );
  };

  it('should display active campaigns', async () => {
    fixture.init({
      campaigns: [
        {
          id: CampaignId('campaign-1'),
          projectId: ProjectId('project-1'),
          title: 'Financer les soins vétérinaires',
          description: 'Campagne pour le refuge',
          goal: 12000,
          endDate: '2026-10-15',
          ownerId: UserId('owner-1'),
          createdAt: '2026-02-01T10:00:00.000Z',
          status: 'ACTIVE',
          startedAt: '2026-02-15T10:00:00.000Z',
          collectedAmount: 5400,
        },
        {
          id: CampaignId('campaign-2'),
          projectId: ProjectId('project-1'),
          title: 'Campagne brouillon cachée',
          description: 'Ne doit pas apparaître',
          goal: 5000,
          endDate: '2026-11-01',
          ownerId: UserId('owner-2'),
          createdAt: '2026-03-01T10:00:00.000Z',
          status: 'BROUILLON',
        },
      ],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Financer les soins vétérinaires')).toBeInTheDocument();
    });

    // Draft campaigns from other owners should not be visible in the public section
    expect(screen.queryByText('Campagne brouillon cachée')).not.toBeInTheDocument();
  });

  it('should display owner draft campaigns in drafts section', async () => {
    fixture.init({
      campaigns: [
        {
          id: CampaignId('campaign-draft'),
          projectId: ProjectId('project-1'),
          title: 'Mon brouillon de campagne',
          description: 'Brouillon en cours',
          goal: 3000,
          endDate: '2026-09-01',
          ownerId: UserId('owner-1'),
          createdAt: '2026-02-01T10:00:00.000Z',
          status: 'BROUILLON',
        },
      ],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Mon brouillon de campagne')).toBeInTheDocument();
    });
  });
});
