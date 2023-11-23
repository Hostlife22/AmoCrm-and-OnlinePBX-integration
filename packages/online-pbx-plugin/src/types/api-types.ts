export interface IApiUrlRequests {
  auth: string
  instantCallNow: string
  instantCallInstantly: string
}

export type TInstallCallType = "now" | "instantly"
export interface IApiInstance {
  authenticate: () => Promise<void>
  instantCall: (type: TInstallCallType, requestData: IInstantCallNowRequest) => Promise<string | null>
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
  ForbiddenIp = "FORBIDDEN_IP",
  WrongAuthData = "WRONG_AUTH_DATA",
  ApiKeyNotSpecified = "API_KEY_NOT_SPECIFIED",
  WrongApiKey = "WRONG_API_KEY",
  ApiKeyCheckFailed = "API_KEY_CHECK_FAILED",
  WrongGateway = "WRONG_GATEWAY",
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

export interface IInstantCallNowRequest {
  from: string
  to: string
  gateFrom?: string
  gateTo?: string
  toDomain?: string
  fromOrigNumber?: string
  fromOrigName?: string
}

export interface IInstantCallNowResponse {
  status: EResponseStatus
  comment?: string
  data?: {
    uuid: string
  }
  errorCode?: EErrorCode
}
