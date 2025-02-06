export class HttpClient {
  static async fetch(url: string, options: RequestInit | undefined) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/json';

    const response = await fetch(url, options).catch((error) => {
      console.error(error);
      throw error;
    });

    if (!response.ok) {
      console.error(response.statusText);
      throw new Error(response.statusText);
    }

    return response.json().catch(() => ({}));
  }
}
