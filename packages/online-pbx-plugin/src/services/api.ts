import axios, { AxiosInstance, AxiosResponse } from "axios"
import { IApiInstance, IApiUrlRequests } from "../types"

export class Api implements IApiInstance {
  private instance: AxiosInstance
  private requests: IApiUrlRequests
  private keyId: string | null = null
  private key: string | null = null
  private lastApiCallTimestamp: number = 0

  constructor(
    private apiKey: string,
    private domain: string,
  ) {
    this.instance = axios.create({
      baseURL: "https://api.onlinepbx.ru/",
    })
    this.requests = {
      auth: `/${this.domain}/auth.json`,
    }
    this.loadFromLocalStorage()
  }

  private setAuthenticationHeaders(): void {
    if (this.keyId && this.key) {
      this.instance.defaults.headers.common["x-pbx-authentication"] = `${this.keyId}:${this.key}`
    }
  }

  private updateLastApiCallTimestamp(): void {
    this.lastApiCallTimestamp = Date.now()
    localStorage.setItem("lastApiCallTimestamp", this.lastApiCallTimestamp.toString())
  }

  private shouldRefreshKey(): boolean {
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000
    return Date.now() - this.lastApiCallTimestamp > threeDaysInMilliseconds
  }

  private saveToLocalStorage(): void {
    localStorage.setItem("keyId", this.keyId || "")
    localStorage.setItem("key", this.key || "")
  }

  private loadFromLocalStorage(): void {
    this.keyId = localStorage.getItem("keyId") || null
    this.key = localStorage.getItem("key") || null
    this.lastApiCallTimestamp = parseInt(localStorage.getItem("lastApiCallTimestamp") || "0", 10)
  }

  public async authenticate(): Promise<void> {
    try {
      if (!this.keyId || !this.key || this.shouldRefreshKey()) {
        const headers = { "Content-Type": "application/x-www-form-urlencoded" }
        const payload = new URLSearchParams()
        payload.append("auth_key", this.apiKey)

        const response: AxiosResponse = await this.instance.post(this.requests.auth, payload.toString(), { headers })
        console.log(response, response.data)

        if (response.data && response.data.status === "1") {
          this.keyId = response.data.data.key_id
          this.key = response.data.data.key
          this.setAuthenticationHeaders()
          this.updateLastApiCallTimestamp()
          this.saveToLocalStorage()
        }
      }
    } catch (error) {}
  }

  public async getKey(): Promise<void> {
    try {
      if (!this.keyId || !this.key || this.shouldRefreshKey()) {
        await this.authenticate()
      }
    } catch (error) {}
  }
}
