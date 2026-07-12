import { http } from './client';
import type { TryOnJob, TryOnJobList } from './types';

export const tryOnApi = {
  start: (body: { personKey: string; garmentKey: string }) =>
    http.post<TryOnJob>('/try-on', body),

  get: (jobId: string) => http.get<TryOnJob>(`/try-on/${jobId}`),

  list: () => http.get<TryOnJobList>('/try-on'),
};
