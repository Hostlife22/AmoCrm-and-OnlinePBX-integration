import { ReactNode, createContext, useContext, useEffect, useReducer, useState } from "react"
import cloneDeep from "lodash.clonedeep"
import wsConnect from "../services/wsConnect"
import { Api, IApiInstance } from "../services/api"

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
  type:
    | ETypeAction.SET_CALLS
    | ETypeAction.SET_GATEWAY
    | ETypeAction.SET_GATEWAY
    | ETypeAction.SET_IS_CONNECT
    | ETypeAction.SET_USER_BLF
    | ETypeAction.SET_USER_REGISTRATION
  payload: {
    eventName: boolean
  }
}
export interface IInitialState {
  accountName: string
  apiKey: string
  calls: boolean
  gateway: boolean
  isConnect: boolean
  userRegistration: boolean
  userBlf: boolean
}

export interface IOnlinePBXPluginProviderState {
  callerInfo?: {
    phoneNumber: string
  }
  action: ECallState
}

const reducer = (state: IInitialState, action: TEventActions) => {
  const newState = cloneDeep(state)
  switch (action.type) {
    case ETypeAction.SET_CALLS:
      return { ...newState, calls: !action.payload.eventName }
    case ETypeAction.SET_GATEWAY:
      return { ...newState, gateway: !action.payload.eventName }
    case ETypeAction.SET_IS_CONNECT:
      return { ...newState, isConnect: !action.payload.eventName }
    case ETypeAction.SET_USER_BLF:
      return { ...newState, userBlf: !action.payload.eventName }
    case ETypeAction.SET_USER_REGISTRATION:
      return { ...newState, userRegistration: !action.payload.eventName }
    default:
      return newState
  }
}

export type TActionProps = { onSuccess?: () => void }

export type TMakeCall = (phoneNumber: string, props?: TActionProps) => void
export type TResetCall = (props?: TActionProps) => void
export type TAcceptCall = (props?: TActionProps) => void

interface IOnlinePBXPluginContext {
  dispatch: React.Dispatch<TEventActions>
  state: IInitialState
  callInfo: IOnlinePBXPluginProviderState
  makeCall: TMakeCall
  resetCall: TResetCall
  acceptCall: TAcceptCall
}

const onlinePBXPluginContext = createContext<IOnlinePBXPluginContext | undefined>(undefined)

interface IMeProviderProps {
  children: ReactNode
  apiKey: string
  accountName: string
}

export const OnlinePBXPluginProvider = ({ children, apiKey, accountName }: IMeProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    accountName,
    apiKey,
    calls: false,
    gateway: false,
    isConnect: false,
    userRegistration: false,
    userBlf: false,
  })
  const [providerState, setProviderState] = useState<IOnlinePBXPluginProviderState>({ action: ECallState.NO_ACTION })
  const [apiService] = useState<IApiInstance>(new Api(apiKey, accountName))
  const [events, setEvents] = useState("")

  const makeCall: TMakeCall = (phoneNumber, props): void => {
    setProviderState((prev) => ({
      ...prev,
      action: ECallState.CALLING,
      callerInfo: {
        phoneNumber,
      },
    }))
    if (props?.onSuccess) {
      props.onSuccess()
    }
  }

  const resetCall: TResetCall = (props): void => {
    setProviderState((prev) => ({
      ...prev,
      action: ECallState.NO_ACTION,
      callerInfo: undefined,
    }))
    if (props?.onSuccess) {
      props.onSuccess()
    }
  }

  const acceptCall: TAcceptCall = (props): void => {
    setProviderState((prev) => ({
      ...prev,
      action: ECallState.CALL_IN_PROGRESS,
    }))
    if (props?.onSuccess) {
      props.onSuccess()
    }
  }

  useEffect(() => {
    if (state.isConnect && accountName && apiKey) wsConnect(state, setEvents)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isConnect])

  useEffect(() => {
    if (accountName && apiKey) apiService.authenticate()
  }, [])

  return (
    <onlinePBXPluginContext.Provider value={{ dispatch, callInfo: providerState, state, makeCall, resetCall, acceptCall }}>
      {children}
    </onlinePBXPluginContext.Provider>
  )
}

export const useOnlinePBXPluginContext = () => {
  const context = useContext(onlinePBXPluginContext)

  if (!context) throw new Error("OnlinePBXPluginContext should be used only with OnlinePBXPluginProvider")

  return context
}
