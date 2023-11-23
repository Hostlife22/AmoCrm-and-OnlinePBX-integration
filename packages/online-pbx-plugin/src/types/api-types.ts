export interface IApiUrlRequests {
  auth: string
}
export interface IApiInstance {
  authenticate: () => Promise<void>
  getKey: () => Promise<void>
}

export enum EResponseStatus {
  Success = 1,
  Failure = 0,
}

export enum EErrorCode {
  WrongDomain = "WRONG_DOMAIN",
  DisabledDomain = "DISABLED_DOMAIN",
  TooManyRequests = "TOO_MANY_REQUESTS",
  ValidationFailed = "VALIDATION_FAILED",
  Internal = "INTERNAL",
  WrongAuthData = "WRONG_AUTH_DATA",
  ApiKeyNotSpecified = "API_KEY_NOT_SPECIFIED",
  ForbiddenIp = "FORBIDDEN_IP",
  WrongApiKey = "WRONG_API_KEY",
}

export interface IAuthResponseData {
  key: string
  key_id: string
  new: 0 | 1
}

export interface IAuthResponse {
  status: EResponseStatus
  comment?: string
  isNotAuth?: boolean
  data?: IAuthResponseData
  errorCode?: EErrorCode
}
