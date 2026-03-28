import { describe, it, expect, beforeEach } from 'vitest';
import { AppTestFixture } from '../../../tests/fixtures';
import { UserId } from '../../users/entities/user';

describe('Project lifecycle (integration)', () => {
  let fixture: AppTestFixture;

  beforeEach(() => {
    fixture = new AppTestFixture();
    fixture.init();
  });

  it('should create a project and retrieve it', async () => {
    const project = await fixture.createProject.execute({
      title: 'Mon projet',
      description: 'Description du projet',
      photoUrl: 'https://example.com/photo.jpg',
      ownerId: UserId('user-1'),
    });

    const retrieved = await fixture.viewProject.execute(project.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved!.title).toBe('Mon projet');
    expect(retrieved!.ownerId).toBe('user-1');
  });

  it('should create a project, update it, and view updated data', async () => {
    const project = await fixture.createProject.execute({
      title: 'Projet initial',
      description: 'Description initiale',
      photoUrl: 'https://example.com/photo.jpg',
      ownerId: UserId('user-1'),
    });

    await fixture.updateProject.execute({
      id: project.id,
      values: {
        title: 'Projet modifié',
        description: 'Description modifiée',
        photoUrl: project.photoUrl,
      },
    });

    const updated = await fixture.viewProject.execute(project.id);

    expect(updated!.title).toBe('Projet modifié');
    expect(updated!.description).toBe('Description modifiée');
  });

  it('should create multiple projects and list all of them', async () => {
    await fixture.createProject.execute({
      title: 'Projet 1',
      description: 'Description 1',
      photoUrl: 'https://example.com/p1.jpg',
      ownerId: UserId('user-1'),
    });

    await fixture.createProject.execute({
      title: 'Projet 2',
      description: 'Description 2',
      photoUrl: 'https://example.com/p2.jpg',
      ownerId: UserId('user-2'),
    });

    const all = await fixture.viewAllProjects.execute();

    expect(all).toHaveLength(2);
  });

  it('should list projects by owner', async () => {
    await fixture.createProject.execute({
      title: 'Projet user-1',
      description: 'Description',
      photoUrl: 'https://example.com/p1.jpg',
      ownerId: UserId('user-1'),
    });

    await fixture.createProject.execute({
      title: 'Projet user-2',
      description: 'Description',
      photoUrl: 'https://example.com/p2.jpg',
      ownerId: UserId('user-2'),
    });

    const userProjects = await fixture.viewAllUserProjects.execute(UserId('user-1'));

    expect(userProjects).toHaveLength(1);
    expect(userProjects[0].title).toBe('Projet user-1');
  });

  it('should create a project and delete it', async () => {
    const project = await fixture.createProject.execute({
      title: 'Projet à supprimer',
      description: 'Description',
      photoUrl: 'https://example.com/photo.jpg',
      ownerId: UserId('user-1'),
    });

    await fixture.deleteProject.execute(project.id);

    const deleted = await fixture.viewProject.execute(project.id);
    expect(deleted).toBeNull();

    const all = await fixture.viewAllProjects.execute();
    expect(all).toHaveLength(0);
  });
});
