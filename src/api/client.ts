import { env } from '@/config/env';
import { logger } from '@/lib/logger';

import { authBridge } from './authBridge';
import { ApiError } from './errors';

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Json;
  headers?: Record<string, string>;
  /** Skip Authorization header — used by the refresh call itself. */
  skipAuth?: boolean;
  /** Skip 401 refresh-and-retry — used by the refresh call itself. */
  skipRefresh?: boolean;
  signal?: AbortSignal;
};

/**
 * De-duped refresh: if several requests get 401 concurrently, they share
 * one refresh call instead of stampeding /auth/refresh.
 */
let refreshInFlight: Promise<string | null> | null = null;

function refreshOnce(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = authBridge()
      .refresh()
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isApiErrorShape(x: unknown): x is { message?: string; code?: string } {
  return typeof x === 'object' && x !== null;
}

async function raw<T>(path: string, opts: RequestOptions): Promise<T> {
  const url = path.startsWith('http') ? path : `${env.apiBaseUrl}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.apiTimeoutMs);
  const signal = opts.signal
    ? mergeSignals(opts.signal, controller.signal)
    : controller.signal;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...opts.headers,
  };

  if (!opts.skipAuth) {
    const token = authBridge().getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const message =
      err instanceof Error && err.name === 'AbortError'
        ? 'Request timed out'
        : 'Network error';
    throw new ApiError(0, message);
  }
  clearTimeout(timeoutId);

  const body = await parseBody(res);

  if (res.ok) {
    return body as T;
  }

  const shape = isApiErrorShape(body) ? body : {};
  const message =
    (typeof shape.message === 'string' && shape.message) || res.statusText || 'Request failed';
  throw new ApiError(res.status, message, shape.code, body);
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  try {
    return await raw<T>(path, opts);
  } catch (err) {
    if (
      err instanceof ApiError &&
      err.isUnauthorized &&
      !opts.skipRefresh &&
      !opts.skipAuth
    ) {
      const newToken = await refreshOnce();
      if (newToken) {
        return raw<T>(path, { ...opts, skipRefresh: true });
      }
      authBridge().onAuthFailure();
    }
    if (err instanceof ApiError) {
      logger.warn('api', opts.method ?? 'GET', path, err.status, err.message);
    }
    throw err;
  }
}

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  const ctrl = new AbortController();
  const abort = () => ctrl.abort();
  if (a.aborted || b.aborted) ctrl.abort();
  a.addEventListener('abort', abort);
  b.addEventListener('abort', abort);
  return ctrl.signal;
}

export const http = {
  get: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: Json, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: Json, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: Json, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
};
