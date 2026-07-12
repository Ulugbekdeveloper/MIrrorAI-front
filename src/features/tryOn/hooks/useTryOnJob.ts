import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError, tryOnApi, uploadsApi } from '@/api';
import type { TryOnJob } from '@/api';
import { logger } from '@/lib/logger';

import type { LocalImage } from '../state';

export type JobPhase =
  | 'idle'
  | 'uploading-person'
  | 'uploading-garment'
  | 'starting'
  | 'polling'
  | 'succeeded'
  | 'failed';

type State = {
  phase: JobPhase;
  job: TryOnJob | null;
  error: string | null;
};

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 3 * 60_000;

async function upload(img: LocalImage): Promise<string> {
  const { uploadUrl, fileKey } = await uploadsApi.presign({
    fileName: img.fileName,
    contentType: img.contentType,
  });
  await uploadsApi.putFile(uploadUrl, img.uri, img.contentType);
  return fileKey;
}

export function useTryOnJob() {
  const [state, setState] = useState<State>({ phase: 'idle', job: null, error: null });
  const cancelledRef = useRef(false);

  useEffect(() => () => {
    cancelledRef.current = true;
  }, []);

  const run = useCallback(async (person: LocalImage, garment: LocalImage) => {
    cancelledRef.current = false;
    setState({ phase: 'uploading-person', job: null, error: null });

    try {
      const personKey = await upload(person);
      if (cancelledRef.current) return;

      setState((s) => ({ ...s, phase: 'uploading-garment' }));
      const garmentKey = await upload(garment);
      if (cancelledRef.current) return;

      setState((s) => ({ ...s, phase: 'starting' }));
      const started = await tryOnApi.start({ personKey, garmentKey });
      if (cancelledRef.current) return;

      setState({ phase: 'polling', job: started, error: null });
      const finished = await poll(started.jobId, () => cancelledRef.current);
      if (cancelledRef.current) return;

      if (finished.status === 'succeeded' && finished.resultUrl) {
        setState({ phase: 'succeeded', job: finished, error: null });
      } else {
        setState({
          phase: 'failed',
          job: finished,
          error: finished.error ?? 'The try-on failed. Try different photos.',
        });
      }
    } catch (err) {
      if (cancelledRef.current) return;
      logger.error('tryOn', err);
      const message =
        err instanceof ApiError ? err.message : 'Something went wrong. Try again.';
      setState((s) => ({ ...s, phase: 'failed', error: message }));
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setState({ phase: 'idle', job: null, error: null });
  }, []);

  return { ...state, run, cancel };
}

async function poll(jobId: string, isCancelled: () => boolean): Promise<TryOnJob> {
  const started = Date.now();
  while (Date.now() - started < POLL_TIMEOUT_MS) {
    if (isCancelled()) throw new Error('cancelled');
    const job = await tryOnApi.get(jobId);
    if (job.status === 'succeeded' || job.status === 'failed') return job;
    await sleep(POLL_INTERVAL_MS);
  }
  throw new ApiError(504, 'Try-on timed out. Please try again.');
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
