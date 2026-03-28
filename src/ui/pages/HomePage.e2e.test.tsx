import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from '../../tests/fixtures';
import { CampaignId } from '../../domain/campagns/entites/campaign';
import { ProjectId } from '../../domain/projects/entities/project';
import { UserId } from '../../domain/users/entities/user';
import '../../infrastructure/i18n';
import HomePage from './HomePage';

describe('HomePage (e2e)', () => {
  let fixture: AppTestFixture;

  beforeEach(() => {
    fixture = new AppTestFixture();
  });

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <HomePage
          viewAllProjects={fixture.viewAllProjects}
          viewAllCampaigns={fixture.viewAllCampaigns}
        />
      </MemoryRouter>,
    );
  };

  it('should display featured projects and active campaigns', async () => {
    fixture.init({
      projects: [
        {
          id: ProjectId('project-1'),
          title: 'Refuge Seconde Chance',
          description: 'Un refuge pour les animaux',
          photoUrl: 'https://example.com/photo.jpg',
          ownerId: UserId('owner-1'),
          createdAt: new Date('2026-01-10T10:00:00.000Z'),
        },
      ],
      campaigns: [
        {
          id: CampaignId('campaign-1'),
          projectId: ProjectId('project-1'),
          title: 'Financer le refuge',
          description: 'Campagne active',
          goal: 10000,
          endDate: '2026-10-15',
          ownerId: UserId('owner-1'),
          createdAt: '2026-02-01T10:00:00.000Z',
          status: 'ACTIVE',
          startedAt: '2026-02-15T10:00:00.000Z',
          collectedAmount: 3000,
        },
      ],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Refuge Seconde Chance')).toBeInTheDocument();
    });
    expect(screen.getByText('Financer le refuge')).toBeInTheDocument();
  });

  it('should render without projects or campaigns', async () => {
    fixture.init();

    renderPage();

    // The page should render without errors even with empty data
    await waitFor(() => {
      expect(document.body).toBeTruthy();
    });
  });
});
