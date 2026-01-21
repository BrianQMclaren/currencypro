export default class FetchWrapper {
  baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  async get<T>(endpoint: string): Promise<T> {
    return await fetch(this.baseURL + endpoint).then((response) => response.json());
  }
}
