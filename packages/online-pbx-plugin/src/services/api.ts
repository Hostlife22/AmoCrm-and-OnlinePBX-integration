interface IApiRequests {
  auth: string
}

export interface IApiInstance {
  authenticate: () => Promise<void>
  getKey: () => Promise<void>
}

export class Api implements IApiInstance {
  private baseUrl: string
  private requests: IApiRequests
  private keyId: string | null = null
  private key: string | null = null

  constructor(
    private apiKey: string,
    private domain: string,
  ) {
    this.baseUrl = "https://api.onlinepbx.ru/"
    this.requests = {
      auth: `/${this.domain}/auth.json`,
    }
  }

  private setAuthenticationHeaders(): void {
    if (this.keyId && this.key) {
      // Implement your header setting logic if needed
      // For example, you can set headers in the fetch options
    }
  }

  public async authenticate(): Promise<void> {
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      }
      const payload = new URLSearchParams()
      payload.append("auth_key", this.apiKey)

      const response = await fetch(this.baseUrl + this.requests.auth, {
        method: "POST",
        headers: headers,
        body: payload.toString(),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        if (data.status === "1") {
          this.keyId = data.data.key_id
          this.key = data.data.key
          this.setAuthenticationHeaders()
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  public async getKey(): Promise<void> {
    try {
      if (!this.keyId || !this.key) {
        await this.authenticate()
      }
    } catch (err) {
      console.error(err)
    }
  }
}
