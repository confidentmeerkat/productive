import { fetcher } from "./fetcher";

export interface NewApiKeyDetails {
  id: number;
  label: string;
  prefix: string;
  key: string; // The full API key, shown only once
  createdAt: Date;
  expiresAt?: Date | null;
}

export interface ApiKeyInfo {
  id: number;
  label: string;
  prefix: string;
  createdAt: Date;
  lastUsedAt?: Date | null;
  expiresAt?: Date | null;
  isActive: boolean;
}

export const apikeyService = {
  async createApiKey(apiKeyName: string) {
    const response = await fetcher<NewApiKeyDetails>(`/api-keys`, {
      method: 'POST',
      body: JSON.stringify({ label: apiKeyName })
    });
    return response;
  },
  async getApiKeys() {
    const response = await fetcher<ApiKeyInfo[]>(`/api-keys`);
    return response;
  },
  async deleteApiKey(id: number) {
    const response = await fetcher<ApiKeyInfo>(`/api-keys/${id}`, {
      method: 'DELETE'
    });
    return response;
  }
}

