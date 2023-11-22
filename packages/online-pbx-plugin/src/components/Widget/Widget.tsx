import { ReactElement } from "react"
import cn from "classnames"

import styles from "./Widget.module.css"
import { ETypeAction, TEventActions, useOnlinePBXPluginContext } from "../../providers"

export interface IWidgetProps {
  className?: string
}

type TEventName = "calls" | "gateway" | "userBlf" | "userRegistration" | "isConnect"

export const Widget = ({ className }: IWidgetProps): ReactElement => {
  const { dispatch, state } = useOnlinePBXPluginContext()

  const invertParams = (type: TEventActions["type"], eventName: TEventName) => {
    return dispatch({
      type,
      payload: { eventName: state[eventName] },
    })
  }

  return (
    <div className={cn(styles.container, className)}>
      <form>
        <h4>Group events</h4>
        <div>
          <input
            type="checkbox"
            onClick={() => {
              invertParams(ETypeAction.SET_CALLS, "calls")
            }}
            role="switch"
            id="calls"
          ></input>
          <label htmlFor="calls">Calls</label>
        </div>
        <div>
          <input
            type="checkbox"
            onClick={() => {
              invertParams(ETypeAction.SET_GATEWAY, "gateway")
            }}
            role="switch"
            id="gateway"
          ></input>
          <label htmlFor="gateway">Gateway</label>
        </div>
        <div>
          <input
            type="checkbox"
            onClick={() => {
              invertParams(ETypeAction.SET_GATEWAY, "userBlf")
            }}
            role="switch"
            id="userBlf"
          ></input>
          <label htmlFor="userBlf">User blf</label>
        </div>
        <div>
          <input
            type="checkbox"
            onClick={() => {
              invertParams(ETypeAction.SET_USER_REGISTRATION, "userRegistration")
            }}
            role="switch"
            id="userRegistration"
          ></input>
          <label htmlFor="userRegistration">User registration</label>
        </div>
        <button
          type="button"
          onClick={() => {
            invertParams(ETypeAction.SET_IS_CONNECT, "isConnect")
          }}
        >
          Connect
        </button>
      </form>
    </div>
  )
}
