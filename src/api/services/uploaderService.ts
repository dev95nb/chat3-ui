import { apiClient } from '../apiClient';
import { UploadResponse } from '../types';

const UPLOADS_API_URL = 'uploads';

const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient
    .post(UPLOADS_API_URL, {
      body: formData,
    })
    .json<UploadResponse>();

  return response;
};

export const uploaderService = {
  uploadFile,
}; 