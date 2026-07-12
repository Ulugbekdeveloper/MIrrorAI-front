import { ApiError } from './errors';
import { http } from './client';
import type { PresignRequest, PresignResponse } from './types';

export const uploadsApi = {
  presign: (body: PresignRequest) => http.post<PresignResponse>('/uploads/presign', body),

  /**
   * PUT the file bytes directly at the presigned S3 URL.
   * Uses fetch (not our http client) because the URL is external and pre-signed.
   */
  async putFile(uploadUrl: string, uri: string, contentType: string): Promise<void> {
    const blob = await (await fetch(uri)).blob();
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: blob,
    });
    if (!res.ok) {
      throw new ApiError(res.status, `Upload failed: ${res.statusText}`);
    }
  },
};
