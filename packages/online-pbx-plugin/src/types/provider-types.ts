export enum ECallState {
  CALL_IN_PROGRESS = "CALL_IN_PROGRESS",
  CALLING = "CALLING",
  AWAITING_ACCEPTANCE = "WAITING_FOR_ACCEPTANCE",
  NO_ACTION = "NO_ACTION",
}

export enum ETypeAction {
  SET_CALLS = "setCalls",
  SET_GATEWAY = "setGateway",
  SET_IS_CONNECT = "setIsConnect",
  SET_USER_BLF = "setUserBlf",
  SET_USER_REGISTRATION = "setUserRegistration",
}
export type TEventActions = {
  type: ETypeAction
  payload: {
    eventName: boolean
  }
}

export interface IReducerState {
  accountName: string
  apiKey: string
  wsPort?: number
  calls: boolean
  gateway: boolean
  isConnect: boolean
  userRegistration: boolean
  userBlf: boolean
}

export interface IOnlinePBXPluginProviderState {
  callInfo?: {
    caller_number: string
    destination_number?: string
    gateway_number?: string
    caller_name?: string
    channel_uuid?: string
    call_uuid?: string
    isHold?: boolean
  }
  subscribed: boolean
  errorMessage?: string;
  action: `${ECallState}`
}

export type TActionProps = { onSuccess?: () => void }
export type TMakeCall = (phoneNumber: string, props?: TActionProps) => void
export type TResetCall = (props?: TActionProps) => void
export type TAcceptCall = (props?: TActionProps) => void

export interface IOnlinePBXPluginContext {
  dispatch: React.Dispatch<TEventActions>
  state: IReducerState
  callInfo: IOnlinePBXPluginProviderState
  makeCall: TMakeCall
  resetCall: TResetCall
  acceptCall: TAcceptCall
}
