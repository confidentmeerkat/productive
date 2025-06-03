import { fetcher } from "./fetcher";

export interface AccountDetails {
  name: string;
  type: string;
  status: string;
  meta: any;
}

export interface AccountInfo {
  id: number;
  name: string;
  type: string;
  status: string;
  meta: any;
  userId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

export const accountsService = {
  async getAccounts() {
    const response = await fetcher<AccountInfo[]>("/accounts");
    return response;
  },

  async createAccount(account: AccountDetails) {
    const response = await fetcher<AccountInfo>("/accounts", {
      method: "POST",
      body: JSON.stringify(account)
    });
    return response;
  },

  async updateAccount(id: number, account: AccountDetails) {
    const response = await fetcher<AccountInfo>(`/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(account)
    });
    return response;
  },

  async deleteAccount(id: number) {
    const response = await fetcher<void>(`/accounts/${id}`, {
      method: "DELETE"
    });
    return response;
  }
}

