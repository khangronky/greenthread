const API_BASE_URL = '/api';
const DEFAULT_TIMEOUT = 300000;

interface FetcherOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
}

export class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

export async function fetcher<T>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { body, timeout = DEFAULT_TIMEOUT, ...init } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...init,
      signal: controller.signal,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new FetchError(
        data.error || data.message || 'Request failed',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new FetchError('Request timeout', 408);
    }
    throw new FetchError(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
