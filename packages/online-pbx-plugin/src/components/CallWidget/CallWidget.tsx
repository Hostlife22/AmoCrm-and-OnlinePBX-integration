import classNames from "classnames"

import { Button } from "../Button"
import { ECallState, useOnlinePBXPluginContext } from "../../providers"
import { PhoneIcon, PhoneXIcon } from "../../assets"
import { Timer } from "../Timer"

import styles from "./CallWidget.module.css"

interface ICallWidgetProps {
  className?: string
}
export const CallWidget = ({ className }: ICallWidgetProps) => {
  const { acceptCall, resetCall, callInfo } = useOnlinePBXPluginContext()

  const handleAcceptCall = (): void => {
    acceptCall()
  }

  const handleResetCall = (): void => {
    resetCall()
  }

  return (
    <div
      className={classNames(styles.container, { [styles.container_hidden]: callInfo.action === ECallState.NO_ACTION }, className)}
    >
      <div className={styles.callerInfo}>
        <p className={styles.callerInfoText}>{callInfo?.callerInfo?.phoneNumber}</p>
      </div>
      <div className={styles.bodyContainer}>
        <div className={styles.timeContainer}>
          {(callInfo.action === ECallState.CALLING || callInfo.action === ECallState.CALL_IN_PROGRESS) && <Timer />}
        </div>
        <div className={styles.buttonsGroup}>
          {callInfo.action === ECallState.AWAITING_ACCEPTANCE && (
            <Button className={styles.buttonAccept} onClick={handleAcceptCall}>
              <PhoneIcon />
            </Button>
          )}
          <Button className={styles.buttonDecline} onClick={handleResetCall}>
            <PhoneXIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
