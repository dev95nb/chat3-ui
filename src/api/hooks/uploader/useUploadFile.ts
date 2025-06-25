import { useMutation } from '@tanstack/react-query';
import { uploaderService } from '@/api/services/uploaderService';
import { UploadResponse } from '@/api/types';

export const useUploadFile = () => {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: (file: File) => uploaderService.uploadFile(file),
  });
}; 