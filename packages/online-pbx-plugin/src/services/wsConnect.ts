import { useCallback, useRef } from "react"
import WebSocket from "isomorphic-ws"

import { dataFormatter } from "../utils"
import { IOnlinePBXPluginProviderState, IReducerState } from "../types"
import {
  EWsEvents,
  EWsSendCommands,
  IBridgeChannelsData,
  IEventData,
  IHangupChannelData,
  ITransferCallData,
  TWsEvent,
} from "./ws-types"

interface IStateManagement {
  state: IOnlinePBXPluginProviderState
  setState: React.Dispatch<React.SetStateAction<IOnlinePBXPluginProviderState>>
}

export const useWebsocket = (props: IReducerState, { setState, state }: IStateManagement) => {
  const account = props.accountName
  const apiKey = props.apiKey
  const port = props.wsPort || 3342
  const calls = props.calls ? "calls" : ""
  const gateway = props.gateway ? "gateway" : ""
  const userBlf = props.userBlf ? "userBlf" : ""
  const userRegistration = props.userRegistration ? "userRegistration" : ""

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const groupNames = [calls, gateway, userBlf, userRegistration]

  const wsRef = useRef<WebSocket>()

  const connect = useCallback(() => {
    console.log(wsRef.current)
    if (!wsRef.current) {
      wsRef.current = new WebSocket(`wss://${account}:${port}/?key=${apiKey}`)
    }
    const ws = wsRef.current
    ws.onopen = (): void => {
      ws.send(
        JSON.stringify({
          command: EWsSendCommands.subscribe,
          data: {
            eventGroups: groupNames.filter((name) => name !== ""),
          },
        }),
      )
      console.log("Connect")
    }

    ws.onmessage = (event: WebSocket.MessageEvent): void => {
      // const currentDate = dateCreator()
      if (event.data) {
        const data: TWsEvent = JSON.parse(dataFormatter(event.data?.toString()))

        switch (data.event) {
          case EWsEvents.bridged: {
            return
          }
          case EWsEvents.channel_answer: {
            const future = data as IEventData[typeof data.event]

            setState((prev) => ({
              ...prev,
              callInfo: {
                ...(prev.callInfo || { caller_number: "" }),
                call_uuid: future.data.call_uuid,
                channel_uuid: future.data.uuid,
              },
            }))
            return
          }
          case EWsEvents.channel_create: {
            const future = data as IEventData[typeof data.event]

            setState((prev) => ({
              ...prev,
              action: future.data.direction === "inbound" ? "WAITING_FOR_ACCEPTANCE" : "CALLING",
              callInfo: {
                ...(prev.callInfo || {}),
                caller_number: future.data.caller_number,
                destination_number: future.data.destination_number,
                gateway_number: future.data.gateway_number,
                caller_name: future.data.caller_number,
                isHold: false,
                call_uuid: future.data.call_uuid,
                channel_uuid: future.data.uuid,
              },
            }))
            return
          }
          case EWsEvents.channel_hold: {
            const future = data as IEventData[typeof data.event]

            setState((prev) => ({
              ...prev,
              callInfo:
                prev.callInfo &&
                (prev.callInfo?.channel_uuid === future.data.uuid || prev.callInfo?.call_uuid === future.data.call_uuid)
                  ? {
                      ...(prev.callInfo || { caller_number: "" }),
                      isHold: true,
                      call_uuid: future.data.call_uuid,
                      channel_uuid: future.data.uuid,
                    }
                  : prev.callInfo,
            }))
            return
          }
          case EWsEvents.channel_unbridge: {
            return
          }
          case EWsEvents.call_end: {
            const future = data as IEventData[typeof data.event]

            setState((prev) => ({
              ...prev,
              action: "NO_ACTION",
              callInfo: prev.callInfo?.call_uuid === future.data.uuid ? undefined : prev.callInfo,
            }))
            return
          }
          case EWsEvents.channel_bridge: {
            return
          }
          case EWsEvents.channel_destroy: {
            const future = data as IEventData[typeof data.event]

            setState((prev) => ({
              ...prev,
              action: "NO_ACTION",
              callInfo: prev.callInfo?.channel_uuid === future.data.uuid ? undefined : prev.callInfo,
            }))
            return
          }
          case EWsEvents.channel_unhold: {
            const future = data as IEventData[typeof data.event]

            setState((prev) => ({
              ...prev,
              callInfo:
                prev.callInfo &&
                (prev.callInfo?.channel_uuid === future.data.uuid || prev.callInfo?.call_uuid === future.data.call_uuid)
                  ? {
                      ...(prev.callInfo || { caller_number: "" }),
                      isHold: false,
                      call_uuid: future.data.call_uuid,
                      channel_uuid: future.data.uuid,
                    }
                  : prev.callInfo,
            }))
            return
          }
          case EWsEvents.error_bridge: {
            const future = data as IEventData[typeof data.event]
            setState((prev) => ({ ...prev, errorMessage: future.message }))
            return
          }
          case EWsEvents.error_hangup_channel: {
            const future = data as IEventData[typeof data.event]
            setState((prev) => ({ ...prev, errorMessage: future.message }))
            return
          }
          case EWsEvents.error_subscribe: {
            const future = data as IEventData[typeof data.event]
            setState((prev) => ({ ...prev, errorMessage: future.message }))
            return
          }
          case EWsEvents.error_transfer: {
            const future = data as IEventData[typeof data.event]
            setState((prev) => ({ ...prev, errorMessage: future.message }))
            return
          }
          case EWsEvents.hangup_channel: {
            const future = data as IEventData[typeof data.event]

            setState((prev) => ({
              ...prev,
              action: "NO_ACTION",
              callInfo: prev.callInfo?.channel_uuid === future.data.uuid ? undefined : prev.callInfo,
            }))
            return
          }
          case EWsEvents.subscribed: {
            setState((prev) => ({ ...prev, subscribed: true }))
            return
          }
          case EWsEvents.unsubscribed: {
            setState((prev) => ({ ...prev, action: "NO_ACTION", subscribed: false, callInfo: undefined }))
            return
          }
          case EWsEvents.transferred: {
            const future = data as IEventData[typeof data.event]

            setState((prev) => ({
              ...prev,
              callInfo: prev.callInfo
                ? {
                    ...(prev.callInfo || { caller_number: "" }),
                    channel_uuid: future.data.uuid,
                  }
                : prev.callInfo,
            }))
            return
          }
          default: {
            const _exhaustiveCheck: never = data.event
            /**
             * Exhaustiveness check
             * @see {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking}
             */
            return _exhaustiveCheck
          }
        }
      }
    }
  }, [account, apiKey, groupNames, port, setState])

  const transferCall = useCallback((data: ITransferCallData) => {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          command: EWsSendCommands.transfer,
          data,
        }),
      )
    }
  }, [])

  const hangUpCall = useCallback((data: IHangupChannelData) => {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          command: EWsSendCommands.hangup_channel,
          data,
        }),
      )
    }
  }, [])

  const bridgeCalls = useCallback((data: IBridgeChannelsData) => {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          command: EWsSendCommands.bridge,
          data,
        }),
      )
    }
  }, [])

  return {
    connect,
    transferCall,
    hangUpCall,
    bridgeCalls,
  }
}
