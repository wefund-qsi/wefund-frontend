import type { CampaignId } from "../../campagns/entites/campaign";
import type { UserId } from "../../users/entities/user";
import type { Contribution, ContributionId } from "../entities/contribution";
import type { IContributionRepository } from "../ports/contribution-repository.interface";

const TOKEN_KEY = 'wefund_token';

interface BackendContributionDto {
  id: string;
  montant: number;
  campagneId: string;
  contributeurId?: string;
  createdAt: string;
}

function mapToContribution(dto: BackendContributionDto): Contribution {
  return {
    id: dto.id as ContributionId,
    campaignId: dto.campagneId as CampaignId,
    contributorId: (dto.contributeurId || dto.id) as UserId,
    amount: Number(dto.montant),
    createdAt: dto.createdAt,
  };
}

export class HttpContributionRepository implements IContributionRepository {
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

  async create(contribution: Contribution): Promise<Contribution> {
    const res = await fetch(`${this.baseUrl}/contribution`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({
        campagneId: contribution.campaignId,
        montant: contribution.amount,
      }),
    });
    if (res.status === 401) throw new Error('Non authentifié');
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Échec de la création de la contribution');
    }
    const data = (await res.json()) as unknown as { data?: BackendContributionDto };
    return mapToContribution(data.data || (data as BackendContributionDto));
  }

  async update(contribution: Contribution): Promise<Contribution> {
    const res = await fetch(`${this.baseUrl}/contribution/${contribution.id}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify({
        montant: contribution.amount,
      }),
    });
    if (res.status === 401) throw new Error('Non authentifié');
    if (res.status === 403) throw new Error('Pas votre contribution');
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Échec de la mise à jour de la contribution');
    }
    const data = (await res.json()) as unknown as { data?: BackendContributionDto };
    return mapToContribution(data.data || (data as BackendContributionDto));
  }

  async delete(id: ContributionId): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/contribution/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.ok;
  }

  async findById(id: ContributionId): Promise<Contribution | null> {
    try {
      const res = await fetch(`${this.baseUrl}/contribution/${id}`, {
        headers: this.getHeaders(true),
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Impossible de récupérer la contribution');
      const data = (await res.json()) as unknown as { data?: BackendContributionDto };
      return mapToContribution(data.data || (data as BackendContributionDto));
    } catch {
      return null;
    }
  }

  async findByCampaignId(campaignId: CampaignId): Promise<Contribution[]> {
    try {
      const res = await fetch(`${this.baseUrl}/contribution?campaignId=${campaignId}`, {
        headers: this.getHeaders(true),
      });
      if (!res.ok) return [];
      const data = (await res.json()) as unknown as BackendContributionDto[] | { data?: BackendContributionDto[] };
      const items = Array.isArray(data) ? data : data.data || [];
      return items.map(mapToContribution);
    } catch {
      return [];
    }
  }

  async findByContributorId(contributorId: UserId): Promise<Contribution[]> {
    try {
      const res = await fetch(`${this.baseUrl}/contribution`, {
        headers: this.getHeaders(true),
      });
      if (!res.ok) return [];
      const data = (await res.json()) as unknown as BackendContributionDto[] | { data?: BackendContributionDto[] };
      const items = Array.isArray(data) ? data : data.data || [];
      return items.map(mapToContribution);
    } catch {
      return [];
    }
  }
}

