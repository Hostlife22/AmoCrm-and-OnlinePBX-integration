import { ReactNode, createContext, useContext, useEffect, useReducer, useRef, useState } from "react"
import cloneDeep from "lodash.clonedeep"

import { useWebsocket } from "../services/wsConnect"
import { Api } from "../services/api"
import {
  ECallState,
  ETypeAction,
  IApiInstance,
  IOnlinePBXPluginContext,
  IOnlinePBXPluginProviderState,
  IReducerState,
  TAcceptCall,
  TEventActions,
  TMakeCall,
  TResetCall,
} from "../types"

const reducer = (state: IReducerState, action: TEventActions) => {
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

const onlinePBXPluginContext = createContext<IOnlinePBXPluginContext | undefined>(undefined)

interface IMeProviderProps {
  accountName: string
  apiKey: string
  children: ReactNode
  wsPort?: number
}

export const OnlinePBXPluginProvider = ({ children, apiKey, accountName, wsPort }: IMeProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    accountName,
    apiKey,
    wsPort,
    calls: true,
    gateway: false,
    isConnect: true,
    userRegistration: false,
    userBlf: false,
  })
  const [providerState, setProviderState] = useState<IOnlinePBXPluginProviderState>({
    action: ECallState.NO_ACTION,
    subscribed: false,
  })
  const [apiService] = useState<IApiInstance>(new Api(apiKey, accountName))
  const { connect, hangUpCall } = useWebsocket(state, { setState: setProviderState, state: providerState })
  const authFetchedRef = useRef(false)

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
    if (providerState.callInfo?.channel_uuid) {
      hangUpCall({ uuid: providerState.callInfo?.channel_uuid })
    }
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
    if (accountName && apiKey) connect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountName, apiKey])

  useEffect(() => {
    if (!authFetchedRef.current && accountName && apiKey) {
      apiService.authenticate()
    }
    return () => {
      authFetchedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
