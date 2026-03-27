import type { UserId } from "../../users/entities/user";
import type { ProjectId } from "../../projects/entities/project";
import type { Campaign, CampaignId, CampaignStatus } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

const TOKEN_KEY = 'wefund_token';

interface BackendCampaignDto {
  id: string;
  titre: string;
  description: string;
  objectif: number;
  montantCollecte?: number;
  dateFin: string;
  statut: CampaignStatus;
  porteurId: string;
  projetId: string;
  createdAt: string;
  updatedAt?: string;
}

function mapToCampaign(dto: BackendCampaignDto): Campaign {
  const baseData = {
    id: dto.id as CampaignId,
    projectId: dto.projetId as ProjectId,
    title: dto.titre,
    description: dto.description,
    goal: Number(dto.objectif),
    endDate: dto.dateFin,
    ownerId: dto.porteurId as UserId,
    createdAt: dto.createdAt,
  };

  const collectedAmount = Number(dto.montantCollecte || 0);

  switch (dto.statut) {
    case 'BROUILLON':
      return { ...baseData, status: 'BROUILLON' };
    case 'EN_ATTENTE':
      return { ...baseData, status: 'EN_ATTENTE' };
    case 'ACTIVE':
      return {
        ...baseData,
        status: 'ACTIVE',
        startedAt: dto.createdAt,
        collectedAmount,
      };
    case 'REUSSIE':
      return {
        ...baseData,
        status: 'REUSSIE',
        startedAt: dto.createdAt,
        completedAt: dto.updatedAt || new Date().toISOString(),
        collectedAmount,
      };
    case 'ECHOUEE':
      return {
        ...baseData,
        status: 'ECHOUEE',
        startedAt: dto.createdAt,
        completedAt: dto.updatedAt || new Date().toISOString(),
        collectedAmount,
      };
    case 'REFUSEE':
      return { ...baseData, status: 'REFUSEE' };
    default:
      return { ...baseData, status: 'BROUILLON' };
  }
}

export class HttpCampaignRepository implements ICampaignRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(auth = false): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async findAll(): Promise<Campaign[]> {
    try {
      const res = await fetch(`${this.baseUrl}/campagnes`);
      if (!res.ok) return [];
      const data = (await res.json()) as unknown as BackendCampaignDto[] | { data?: BackendCampaignDto[] };
      const items = Array.isArray(data) ? data : data.data || [];
      return items.map(mapToCampaign);
    } catch {
      return [];
    }
  }

  async findById(id: CampaignId): Promise<Campaign | null> {
    try {
      const res = await fetch(`${this.baseUrl}/campagnes/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) return null;
      const data = (await res.json()) as unknown as { data?: BackendCampaignDto };
      return mapToCampaign(data.data || (data as BackendCampaignDto));
    } catch {
      return null;
    }
  }

  async findByProjectId(projectId: ProjectId): Promise<Campaign[]> {
    try {
      const res = await fetch(`${this.baseUrl}/campagnes?projetId=${projectId}`);
      if (!res.ok) return [];
      const data = (await res.json()) as unknown as BackendCampaignDto[] | { data?: BackendCampaignDto[] };
      const items = Array.isArray(data) ? data : data.data || [];
      return items.map(mapToCampaign);
    } catch {
      return [];
    }
  }

  async findByOwnerId(ownerId: UserId): Promise<Campaign[]> {
    try {
      const allCampaigns = await this.findAll();
      return allCampaigns.filter((campaign) => campaign.ownerId === ownerId);
    } catch {
      return [];
    }
  }

  async create(campaign: Campaign): Promise<Campaign> {
    const body = {
      titre: campaign.title,
      description: campaign.description,
      objectif: campaign.goal,
      dateFin: campaign.endDate,
      projetId: campaign.projectId,
    };

    const res = await fetch(`${this.baseUrl}/campagnes`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(body),
    });
    if (res.status === 401) throw new Error('Non authentifié');
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Échec de la création de la campagne');
    }
    const data = (await res.json()) as unknown as { data?: BackendCampaignDto };
    return mapToCampaign(data.data || (data as BackendCampaignDto));
  }

  async update(campaign: Campaign): Promise<Campaign> {
    const body = {
      titre: campaign.title,
      description: campaign.description,
      objectif: campaign.goal,
      dateFin: campaign.endDate,
    };

    const res = await fetch(`${this.baseUrl}/campagnes/${campaign.id}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(body),
    });
    if (res.status === 401) throw new Error('Non authentifié');
    if (res.status === 403) throw new Error('Pas votre campagne');
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Échec de la mise à jour de la campagne');
    }
    const data = (await res.json()) as unknown as { data?: BackendCampaignDto };
    return mapToCampaign(data.data || (data as BackendCampaignDto));
  }

  async delete(id: CampaignId): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/campagnes/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

