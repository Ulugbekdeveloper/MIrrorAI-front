export type User = {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = AuthTokens & { user: User };

export type PresignRequest = {
  fileName: string;
  contentType: string;
};

export type PresignResponse = {
  uploadUrl: string;
  fileKey: string;
};

export type TryOnStatus = 'queued' | 'processing' | 'succeeded' | 'failed';

export type TryOnJob = {
  jobId: string;
  status: TryOnStatus;
  personKey: string;
  garmentKey: string;
  resultUrl?: string;
  error?: string;
  createdAt: string;
  finishedAt?: string;
};

export type TryOnJobList = {
  items: TryOnJob[];
};
