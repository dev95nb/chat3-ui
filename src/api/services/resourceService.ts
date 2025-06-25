import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../config";
import type { ResourceListResponse } from "../types";

export class ResourceService {
  async getResource(params: {
    module: string;
    type?: string;
  }): Promise<ResourceListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.type) searchParams.set("type", params.type);

    const url = `${API_ENDPOINTS.resource.list}/${params?.module}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiClient.get(url).json<ResourceListResponse>();
  }
}

// Export singleton instance
export const resourceService = new ResourceService();
