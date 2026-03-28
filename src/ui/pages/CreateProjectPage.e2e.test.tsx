import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from '../../tests/fixtures';
import { UserId } from '../../domain/users/entities/user';
import '../../infrastructure/i18n';
import CreateProjectPage from './CreateProjectPage';

describe('CreateProjectPage (e2e)', () => {
  let fixture: AppTestFixture;

  beforeEach(() => {
    fixture = new AppTestFixture();
    fixture.init();
  });

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <CreateProjectPage
          createProject={fixture.createProject}
          currentUserId={UserId('owner-1')}
        />
      </MemoryRouter>,
    );
  };

  it('should create a project via the form and persist it', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/titre/i), 'Mon nouveau projet');
    await user.type(screen.getByLabelText(/description/i), 'Une description complète');
    await user.type(screen.getByLabelText(/url de la photo/i), 'https://example.com/photo.jpg');
    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText(/projet créé avec succès/i)).toBeInTheDocument();
    });

    // Verify the project was actually persisted in the repository
    const projects = await fixture.viewAllProjects.execute();
    expect(projects).toHaveLength(1);
    expect(projects[0].title).toBe('Mon nouveau projet');
    expect(projects[0].ownerId).toBe('owner-1');
  });

  it('should show validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText(/le titre est obligatoire/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/la description est obligatoire/i)).toBeInTheDocument();

    // Verify nothing was persisted
    const projects = await fixture.viewAllProjects.execute();
    expect(projects).toHaveLength(0);
  });
});
