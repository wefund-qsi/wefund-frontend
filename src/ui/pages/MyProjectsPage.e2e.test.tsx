import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from '../../tests/fixtures';
import { ProjectId } from '../../domain/projects/entities/project';
import { UserId } from '../../domain/users/entities/user';
import '../../infrastructure/i18n';
import MyProjectsPage from './MyProjectsPage';

describe('MyProjectsPage (e2e)', () => {
  let fixture: AppTestFixture;
  const OWNER_ID = UserId('owner-1');

  beforeEach(() => {
    fixture = new AppTestFixture();
  });

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <MyProjectsPage
          currentUserId={OWNER_ID}
          deleteProject={fixture.deleteProject}
          viewAllUserProjects={fixture.viewAllUserProjects}
        />
      </MemoryRouter>,
    );
  };

  it('should display user projects', async () => {
    fixture.init({
      projects: [
        {
          id: ProjectId('project-1'),
          title: 'Mon premier projet',
          description: 'Description du projet',
          photoUrl: 'https://example.com/photo.jpg',
          ownerId: OWNER_ID,
          createdAt: new Date('2026-01-10T10:00:00.000Z'),
        },
        {
          id: ProjectId('project-2'),
          title: 'Mon deuxième projet',
          description: 'Autre description',
          photoUrl: 'https://example.com/photo2.jpg',
          ownerId: OWNER_ID,
          createdAt: new Date('2026-01-12T10:00:00.000Z'),
        },
      ],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Mon premier projet')).toBeInTheDocument();
    });
    expect(screen.getByText('Mon deuxième projet')).toBeInTheDocument();
  });

  it('should delete a project through the confirmation dialog', async () => {
    fixture.init({
      projects: [
        {
          id: ProjectId('project-1'),
          title: 'Projet à supprimer',
          description: 'Ce projet va être supprimé',
          photoUrl: 'https://example.com/photo.jpg',
          ownerId: OWNER_ID,
          createdAt: new Date('2026-01-10T10:00:00.000Z'),
        },
      ],
    });

    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Projet à supprimer')).toBeInTheDocument();
    });

    // Click the delete button
    await user.click(screen.getByRole('button', { name: /supprimer/i }));

    // Confirm deletion in the dialog
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    // Verify the project was removed from the UI and the repository
    await waitFor(() => {
      expect(screen.queryByText('Projet à supprimer')).not.toBeInTheDocument();
    });

    const remaining = await fixture.viewAllProjects.execute();
    expect(remaining).toHaveLength(0);
  });

  it('should display empty state when user has no projects', async () => {
    fixture.init();

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/aucun projet/i)).toBeInTheDocument();
    });
  });
});
