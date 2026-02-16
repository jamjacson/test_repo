import type { ODataConfig, Client, ClientGroup, ClientRelationship, BusinessStructure } from '../types';

/**
 * ODataLink client for querying Xero Practice Manager data.
 *
 * ODataLink URL format: https://servername/account-code/model-code/data-file-code/endpoint
 * See: https://help.odatalink.com/index.php?title=OData_Feed_URLs
 */
export class ODataClient {
  private config: ODataConfig;

  constructor(config: ODataConfig) {
    this.config = config;
  }

  private get baseUrl(): string {
    const { serverUrl, accountCode, modelCode, dataFileCode } = this.config;
    const base = serverUrl.replace(/\/+$/, '');
    return `${base}/${accountCode}/${modelCode}/${dataFileCode}`;
  }

  private get headers(): HeadersInit {
    const headers: HeadersInit = {
      Accept: 'application/json',
    };
    if (this.config.username && this.config.password) {
      const credentials = btoa(`${this.config.username}:${this.config.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }
    return headers;
  }

  private async fetchOData<T>(endpoint: string, params?: Record<string, string>): Promise<T[]> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString(), { headers: this.headers });
    if (!response.ok) {
      throw new Error(`OData request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.value ?? data.d?.results ?? data ?? [];
  }

  async getClientGroups(): Promise<ClientGroup[]> {
    const raw = await this.fetchOData<Record<string, unknown>>('ClientsGroups');
    return raw.map((item) => ({
      id: String(item.ID ?? item.Id ?? item.id ?? ''),
      name: String(item.Name ?? item.name ?? ''),
      taxable: Boolean(item.Taxable ?? item.taxable ?? false),
    }));
  }

  async getClients(): Promise<Client[]> {
    const raw = await this.fetchOData<Record<string, unknown>>('Clients', {
      $filter: 'IsDeleted eq false',
    });
    return raw.map((item) => this.mapClient(item));
  }

  async getClientsByGroup(groupId: string): Promise<Client[]> {
    // Fetch all clients and filter by group membership
    const allClients = await this.getClients();
    return allClients.filter((c) =>
      c.groups.some((g) => g.id === groupId)
    );
  }

  async searchClientGroups(query: string): Promise<ClientGroup[]> {
    const groups = await this.getClientGroups();
    const q = query.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }

  private mapClient(raw: Record<string, unknown>): Client {
    const groups = this.extractGroups(raw);
    const relationships = this.extractRelationships(raw);

    return {
      id: String(raw.ID ?? raw.Id ?? raw.id ?? ''),
      name: String(raw.Name ?? raw.name ?? ''),
      firstName: raw.FirstName ? String(raw.FirstName) : undefined,
      lastName: raw.LastName ? String(raw.LastName) : undefined,
      email: raw.Email ? String(raw.Email) : undefined,
      businessStructure: this.parseBusinessStructure(raw.BusinessStructure ?? raw.businessStructure),
      groups,
      relationships,
      isArchived: Boolean(raw.IsArchived ?? raw.isArchived ?? false),
      isDeleted: Boolean(raw.IsDeleted ?? raw.isDeleted ?? false),
      accountManagerName: raw.AccountManagerName ? String(raw.AccountManagerName) : undefined,
    };
  }

  private extractGroups(raw: Record<string, unknown>): { id: string; name: string }[] {
    const groupsData = raw.Groups ?? raw.groups ?? raw.ClientGroups ?? raw.clientGroups;
    if (!groupsData) return [];
    if (Array.isArray(groupsData)) {
      return groupsData.map((g: Record<string, unknown>) => ({
        id: String(g.ID ?? g.Id ?? g.id ?? ''),
        name: String(g.Name ?? g.name ?? ''),
      }));
    }
    return [];
  }

  private extractRelationships(raw: Record<string, unknown>): ClientRelationship[] {
    const relData = raw.Relationships ?? raw.relationships;
    if (!relData) return [];
    if (Array.isArray(relData)) {
      return relData.map((r: Record<string, unknown>) => ({
        relatedClientId: String(r.RelatedClientID ?? r.RelatedClientId ?? r.relatedClientId ?? ''),
        relatedClientName: String(r.RelatedClientName ?? r.relatedClientName ?? r.Name ?? ''),
        relationshipType: this.parseRelationshipType(r.RelationshipType ?? r.relationshipType ?? r.Type),
        shares: r.Shares != null ? Number(r.Shares) : undefined,
      }));
    }
    return [];
  }

  private parseBusinessStructure(value: unknown): BusinessStructure {
    const str = String(value ?? '').toLowerCase();
    if (str.includes('company') || str.includes('pty') || str.includes('ltd')) return 'Company';
    if (str.includes('trust')) return 'Trust';
    if (str.includes('individual')) return 'Individual';
    if (str.includes('partnership')) return 'Partnership';
    if (str.includes('sole')) return 'Sole Trader';
    if (str.includes('fund') || str.includes('smsf') || str.includes('super')) return 'Fund';
    if (str) return 'Other';
    return 'Individual'; // default
  }

  private parseRelationshipType(value: unknown): ClientRelationship['relationshipType'] {
    const str = String(value ?? '').toLowerCase();
    if (str.includes('director')) return 'Director Of';
    if (str.includes('sharehold') || str.includes('owner')) return 'Shareholder Of';
    if (str.includes('trustee')) return 'Trustee Of';
    if (str.includes('beneficiar')) return 'Beneficiary Of';
    if (str.includes('partner')) return 'Partner Of';
    if (str.includes('secretary')) return 'Secretary Of';
    if (str.includes('appointer')) return 'Appointer Of';
    return 'Member Of';
  }
}

// Create a client from saved config
export function createODataClient(config: ODataConfig): ODataClient {
  return new ODataClient(config);
}
