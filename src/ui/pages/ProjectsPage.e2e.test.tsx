import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from '../../tests/fixtures';
import { ProjectId } from '../../domain/projects/entities/project';
import { UserId } from '../../domain/users/entities/user';
import '../../infrastructure/i18n';
import ProjectsPage from './ProjectsPage';

describe('ProjectsPage (e2e)', () => {
  let fixture: AppTestFixture;

  beforeEach(() => {
    fixture = new AppTestFixture();
  });

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <ProjectsPage viewAllProjects={fixture.viewAllProjects} />
      </MemoryRouter>,
    );
  };

  it('should display a list of projects', async () => {
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
        {
          id: ProjectId('project-2'),
          title: 'Court Métrage Éclats',
          description: 'Un court métrage indépendant',
          photoUrl: 'https://example.com/photo2.jpg',
          ownerId: UserId('owner-1'),
          createdAt: new Date('2026-01-12T10:00:00.000Z'),
        },
      ],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Refuge Seconde Chance')).toBeInTheDocument();
    });
    expect(screen.getByText('Court Métrage Éclats')).toBeInTheDocument();
  });

  it('should display empty state when no projects', async () => {
    fixture.init();

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/aucun projet/i)).toBeInTheDocument();
    });
  });
});
