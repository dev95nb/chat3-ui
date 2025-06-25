'use client';

import { useQuery } from '@tanstack/react-query';
import { resourceService } from '../../services/resourceService';
import { queryKeyFactory } from '../../utils/queryKeyFactory';
import { STALE_TIME } from '../../constants/queryKeys';

export function useResource(module: string) {
  return useQuery({
    queryKey: queryKeyFactory.resource.list(module),
    queryFn: () => resourceService.getResource({ module }),
    staleTime: STALE_TIME.MEDIUM,
  });
} 