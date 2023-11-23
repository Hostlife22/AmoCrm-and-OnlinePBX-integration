import { AxiosInstance } from "axios"
import axios from 'axios';

interface IApiRequests {
  auth: string
}

export interface IApiInstance {
  authenticate: () => Promise<void>
  getKey: () => Promise<void>
}

export class Api implements IApiInstance {
  private instance: AxiosInstance
  private requests: IApiRequests
  private keyId: string | null = null
  private key: string | null = null

  constructor(
    private apiKey: string,
    private domain: string,
  ) {
    console.log(axios);
    this.instance = axios.create({
      baseURL: "https://api.onlinepbx.ru/",
    })
    this.requests = {
      auth: `/${this.domain}/auth.json`,
    }
  }

  private setAuthenticationHeaders(): void {
    if (this.keyId && this.key) {
      this.instance.defaults.headers.common["x-pbx-authentication"] = `${this.keyId}:${this.key}`
    }
  }

  public async authenticate(): Promise<void> {
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      }
      const payload = new URLSearchParams()
      payload.append("auth_key", this.apiKey)

      const response = await this.instance.post(this.requests.auth, payload.toString(), { headers })
      if (response.data && response.data.status === "1") {
        this.keyId = response.data.data.key_id
        this.key = response.data.data.key
        this.setAuthenticationHeaders()
      }
      console.log(response)
    } catch (err) {}
  }

  public async getKey(): Promise<void> {
    try {
      if (!this.keyId || !this.key) {
        await this.authenticate()
      }
    } catch (err) {}
  }
}
