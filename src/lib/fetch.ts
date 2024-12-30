type HttpClientConstructor = {
  baseURl: string
  headers: HeadersInit
}

export class HttpClient {
  baseURL: string
  headers: HeadersInit

  constructor({ baseURl, headers }: HttpClientConstructor) {
    this.baseURL = baseURl
    this.headers = headers
  }

  async request<T>(endpoint?: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint || ""}`, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    })

    if (!response.ok)
      throw new Error(`Error Happened, Status : ${response.status}`)

    return response.json() as Promise<T>
  }
}
