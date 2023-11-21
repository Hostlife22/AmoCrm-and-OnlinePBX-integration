import { ReactNode, createContext, useContext } from "react"

interface IOnlinePBXPluginContext {}

const onlinePBXPluginContext = createContext<IOnlinePBXPluginContext | undefined>(undefined)

interface IMeProviderProps {
  children: ReactNode
  apiKey: string
}

export const OnlinePBXPluginProvider = ({ children, apiKey }: IMeProviderProps) => {
  return <onlinePBXPluginContext.Provider value={{}}>{children}</onlinePBXPluginContext.Provider>
}

export const useOnlinePBXPluginContext = () => {
  const context = useContext(onlinePBXPluginContext)

  if (!context) throw new Error("OnlinePBXPluginContext should be used only with OnlinePBXPluginProvider")

  return context
}
