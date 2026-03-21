import { type Project, type BackendProjectDto, ProjectId } from '../entities/project';
import type { UserId } from '../../users/entities/user';
import type { IProjectRepository } from '../ports/project-repository.interface';

const TOKEN_KEY = 'wefund_token';

function mapToProject(bp: BackendProjectDto): Project {
  return {
    id: ProjectId(bp.id),
    title: bp.titre,
    description: bp.description,
    photoUrl: bp.photo,
    ownerId: bp.porteurId as UserId,
    createdAt: new Date(bp.createdAt),
  };
}

export class HttpProjectRepository implements IProjectRepository {
  constructor(private readonly baseUrl: string) {}

  private getHeaders(auth = false): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async findAll(): Promise<Project[]> {
    const res = await fetch(`${this.baseUrl}/projets`);
    if (!res.ok) throw new Error('Impossible de récupérer les projets');
    const data = (await res.json()) as unknown as BackendProjectDto[];
    return data.map(mapToProject);
  }

  async findById(id: ProjectId): Promise<Project | null> {
    const res = await fetch(`${this.baseUrl}/projets/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Impossible de récupérer le projet');
    const data = (await res.json()) as unknown as BackendProjectDto;
    return mapToProject(data);
  }

  async create(project: Project): Promise<Project> {
    const res = await fetch(`${this.baseUrl}/projets`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({
        titre: project.title,
        description: project.description,
        photo: project.photoUrl,
      }),
    });
    if (res.status === 401) throw new Error('Non authentifié');
    if (!res.ok) throw new Error('Échec de la création du projet');
    const data = (await res.json()) as unknown as BackendProjectDto;
    return mapToProject(data);
  }

  update(): Promise<Project> {
    return Promise.reject(new Error('Modification de projet non encore implémentée'));
  }

  async delete(id: ProjectId): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/projets/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.ok;
  }

  async findAllByUserId(userId: UserId): Promise<Project[]> {
    const all = await this.findAll();
    return all.filter((p) => p.ownerId === userId);
  }
}
