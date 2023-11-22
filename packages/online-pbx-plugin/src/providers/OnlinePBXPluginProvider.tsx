import { ReactNode, createContext, useContext, useState } from "react"

interface IOnlinePBXPluginState {
  callerInfo?: {
    phoneNumber: string
  }
  isCalling?: boolean
  isCallInProgress?: boolean
  initCallInfo?: {
    phoneNumber: string
  }
}
interface IOnlinePBXPluginContext {
  info: IOnlinePBXPluginState
}

const onlinePBXPluginContext = createContext<IOnlinePBXPluginContext | undefined>(undefined)

interface IMeProviderProps {
  children: ReactNode
  apiKey: string
}

export const OnlinePBXPluginProvider = ({ children, apiKey }: IMeProviderProps) => {
  const [providerState, setProviderState] = useState<IOnlinePBXPluginState>({})

  return <onlinePBXPluginContext.Provider value={{ info: providerState }}>{children}</onlinePBXPluginContext.Provider>
}

export const useOnlinePBXPluginContext = () => {
  const context = useContext(onlinePBXPluginContext)

  if (!context) throw new Error("OnlinePBXPluginContext should be used only with OnlinePBXPluginProvider")

  return context
}
