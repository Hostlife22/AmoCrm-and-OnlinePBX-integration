import { ReactNode, createContext, useContext, useEffect, useReducer, useState } from "react"
import cloneDeep from "lodash.clonedeep"
import wsConnect from "../services/wsConnect"

export enum ECallState {
  IN_PROGRESS = "IN_PROGRESS",
  CALL_END = "CALL_END",
  CALLING = "CALLING",
  INITIALIZED = "INITIALIZED",
  NONE = "NONE",
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

interface IOnlinePBXPluginState {
  callerInfo?: {
    phoneNumber: string
  }
  state: ECallState
  initCallInfo?: {
    phoneNumber: string
  }
}
interface IOnlinePBXPluginContext {
  info: IOnlinePBXPluginState
  dispatch: React.Dispatch<TEventActions>
  state: IInitialState
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
  const [events, setEvents] = useState("")
  const [providerState, setProviderState] = useState<IOnlinePBXPluginState>({ state: ECallState.NONE })

  useEffect(() => {
    if (state.isConnect && accountName && apiKey) wsConnect(state, setEvents)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isConnect])

  return (
    <onlinePBXPluginContext.Provider value={{ info: providerState, dispatch, state }}>{children}</onlinePBXPluginContext.Provider>
  )
}

export const useOnlinePBXPluginContext = () => {
  const context = useContext(onlinePBXPluginContext)

  if (!context) throw new Error("OnlinePBXPluginContext should be used only with OnlinePBXPluginProvider")

  return context
}
