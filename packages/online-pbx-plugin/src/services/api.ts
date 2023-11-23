import axios, { AxiosInstance, AxiosResponse } from "axios"
import {
  EResponseStatus,
  IApiInstance,
  IApiUrlRequests,
  IAuthResponse,
  IInstantCallNowRequest,
  IInstantCallNowResponse,
} from "../types"

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
      instantCallNow: `/${this.domain}/call/now.json`,
    }
    this.loadFromLocalStorage()
    this.setAuthenticationHeaders()
  }

  private setAuthenticationHeaders(): void {
    if (this.keyId && this.key) {
      this.instance.defaults.headers.common["x-pbx-authentication"] = `${this.keyId}:${this.key}`
    }
    this.instance.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded"
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
        const payload = new URLSearchParams()
        payload.append("auth_key", this.apiKey)

        const { data: response }: AxiosResponse<IAuthResponse> = await this.instance.post(this.requests.auth, payload.toString())

        if (response && Number(response.status) === EResponseStatus.Success && response.data) {
          this.keyId = response.data.key_id
          this.key = response.data.key
          this.setAuthenticationHeaders()
          this.updateLastApiCallTimestamp()
          this.saveToLocalStorage()
        } else if (Number(response.status) === EResponseStatus.Failure && response.errorCode && response.comment) {
          console.error(`Authentication error: ${response.comment}`)
        } else {
          console.error(`Authentication error. Unknown status`)
        }
      }
    } catch (error) {
      console.error(`Authentication error. Something was wrong`)
    }
  }

  private async getKey(): Promise<boolean> {
    try {
      if (!this.keyId || !this.key || this.shouldRefreshKey()) {
        await this.authenticate()
      }
      return !!this.keyId && !!this.key
    } catch (error) {
      return false
    }
  }

  public async instantCallNow(requestData: IInstantCallNowRequest): Promise<string | null> {
    try {
      const gotKey = await this.getKey()
      if (gotKey) {
        const payload = new URLSearchParams()
        payload.append("from", requestData.from)
        payload.append("to", requestData.to)

        if (requestData.gateFrom) payload.append("gate_from", requestData.gateFrom)
        if (requestData.gateTo) payload.append("gate_to", requestData.gateTo)
        if (requestData.toDomain) payload.append("to_domain", requestData.toDomain)
        if (requestData.fromOrigNumber) payload.append("from_orig_number", requestData.fromOrigNumber)
        if (requestData.fromOrigName) payload.append("from_orig_name", requestData.fromOrigName)

        const response: AxiosResponse<IInstantCallNowResponse> = await this.instance.post(
          this.requests.instantCallNow,
          payload.toString(),
        )
        if (response.status === 200) {
          if (response && response.data.status === EResponseStatus.Success && response.data.data) {
            console.log(`Instant call initiated successfully. UUID: ${response.data.data.uuid}`)
            return response.data.data.uuid
          } else if (response && response.data.status === EResponseStatus.Failure) {
            console.error(`Instant call initiation failed: ${response.data.comment}`)
          } else {
            console.error(`Instant call initiation failed. Unknown status`)
          }
        } else if (response.status === 429) {
          console.error(`Instant call initiation failed. Too many requests: ${response.data.comment}`)
        } else {
          console.error(`Instant call initiation failed. Unexpected status: ${response.status}`)
        }
      } else {
        console.error(`Failed to get the key. Cannot initiate instant call.`)
      }
      return null
    } catch (error) {
      console.error(`Instant call initiation error. Something was wrong`)
      return null
    }
  }
}
