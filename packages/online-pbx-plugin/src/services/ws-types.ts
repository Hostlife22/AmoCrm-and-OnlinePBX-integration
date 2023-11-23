export enum EEventGroups {
  calls = "calls",
  user_blf = "user_blf",
  gateway = "gateway",
  user_registration = "user_registration",
}

export enum ECallType {
  inbound = "inbound",
  outbound = "outbound",
  local = "local",
}

export enum EOriginType {
  callback = "callback",
  http_api = "http_api",
  autorecall = "autorecall",
}

export enum EWsSendCommands {
  bridge = "bridge",
  hangup_channel = "hangup_channel",
  subscribe = "subscribe",
  transfer = "transfer",
  unsubscribe = "unsubscribe",
}

export enum EWsEvents {
  /** Notification of successful connection of two active channels */
  bridged = "bridged",
  /** Notification of call termination. Available when subscribing to a call event group */
  call_end = "call_end",
  /** Notification that a channel has switched to the answered state. Available when subscribing to the calls event group */
  channel_answer = "channel_answer",
  /** Notification that channels have connected. Available when subscribing to the calls event group */
  channel_bridge = "channel_bridge",
  /** Notification of new channel creation. Available when subscribing to the event group calls */
  channel_create = "channel_create",
  /** Channel deletion notification. Available when subscribing to the event group calls */
  channel_destroy = "channel_destroy",
  /** Notification that a PBX user has put a call on hold. Available when subscribing to the calls event group */
  channel_hold = "channel_hold",
  /** Notification when channels are disconnected. Available when subscribing to the calls event group */
  channel_unbridge = "channel_unbridge",
  /** Notification that a PBX user has taken a call off hold. Available when subscribing to the calls event group */
  channel_unhold = "channel_unhold",
  /** Channel connection error notification  */
  error_bridge = "error_bridge",
  /** Error notification */
  error_hangup_channel = "error_hangup_channel",
  /** Error notification when subscribing to an event group */
  error_subscribe = "error_subscribe",
  /** Error notification when transferring the active channel */
  error_transfer = "error_transfer",
  /** Notification of successful completion of the active channel */
  hangup_channel = "hangup_channel",
  /** Notification of successful subscription to an event group */
  subscribed = "subscribed",
  /** Error notification when unsubscribing from an event group */
  unsubscribed = "unsubscribed",
  /** Notification of successful transfer of the active channel to another number */
  transferred = "transferred",
}

type TEventGroups = `${EEventGroups}`

export interface ITransferCallData {
  uuid: string
  to: string
  domain_to?: string
  gateway_id?: string
}

export interface IBridgeChannelsData {
  uuids: string[]
}

export interface IHangupChannelData {
  uuid: string
}

export interface IWsMessageCommonType {
  event: EWsEvents
  reqId?: string
}

export interface IWsErrorMessageType extends IWsMessageCommonType {
  message: string
}

export interface IWsSubMessageType extends IWsMessageCommonType {
  data: {
    eventGroups: Array<TEventGroups>
  }
}

export interface IWsTransferMessageType extends IWsMessageCommonType {
  data: {
    uuid: string
  }
}

export interface IWsBridgeMessageType extends IWsMessageCommonType {
  data: {
    uuids: Array<string>
  }
}

export interface IWsHangupMessageType extends IWsMessageCommonType {
  data: {
    uuid: string
  }
}

export interface IWsCallEndMessageType extends IWsMessageCommonType {
  data: {
    uuid: string
    caller_name: string
    caller_number: string
    destination_number: string
    from_host: string
    to_host: string
    start_stamp: number
    end_stamp: number
    duration: number
    user_talk_time: number
    hangup_cause: string
    type: ECallType
    origin: EOriginType
    gateway_id: string
    gateway_number: string
  }
}

export interface IWsChannelAnswerMessageType extends IWsMessageCommonType {
  data: {
    uuid: string
    answered_stamp: number
    read_codec: string
    read_rate: string
    read_bitrate: string
    write_codec: string
    write_rate: string
    write_bitrate: string
    call_uuid: string
  }
}

export interface IWsChannelBridgeMessageType extends IWsMessageCommonType {
  data: {
    uuids: Array<string>
    direction: string
    call_uuid: string
  }
}

export interface IWsChannelCreateMessageType extends IWsMessageCommonType {
  data: {
    uuid: string
    direction: string
    created_stamp: number
    state: string
    domain: string
    caller_number: string
    caller_name: string
    destination_number: string
    destination_host: string
    gateway_id: string
    gateway_number: string
    origin: string
    call_uuid: string
  }
}

export interface IWsChannelDestroyMessageType extends IWsMessageCommonType {
  data: {
    uuid: string
    direction: string
    created_stamp: number
    state: string
    call_uuid: string
    hangup_cause: string
  }
}

export interface IWsChannelHoldMessageType extends IWsMessageCommonType {
  data: {
    uuid: string
    call_uuid: string
  }
}

export interface IEventData {
  [EWsEvents.bridged]: IWsBridgeMessageType
  [EWsEvents.call_end]: IWsCallEndMessageType
  [EWsEvents.channel_answer]: IWsChannelAnswerMessageType
  [EWsEvents.channel_bridge]: IWsChannelBridgeMessageType
  [EWsEvents.channel_create]: IWsChannelCreateMessageType
  [EWsEvents.channel_destroy]: IWsChannelDestroyMessageType
  [EWsEvents.channel_hold]: IWsChannelHoldMessageType
  [EWsEvents.channel_unbridge]: IWsChannelBridgeMessageType
  [EWsEvents.channel_unhold]: IWsChannelHoldMessageType
  [EWsEvents.error_bridge]: IWsErrorMessageType
  [EWsEvents.error_hangup_channel]: IWsErrorMessageType
  [EWsEvents.error_subscribe]: IWsErrorMessageType
  [EWsEvents.error_transfer]: IWsErrorMessageType
  [EWsEvents.hangup_channel]: IWsHangupMessageType
  [EWsEvents.subscribed]: IWsSubMessageType
  [EWsEvents.unsubscribed]: IWsSubMessageType
  [EWsEvents.transferred]: IWsTransferMessageType
}

export type TWsEvent = IEventData[keyof IEventData]
