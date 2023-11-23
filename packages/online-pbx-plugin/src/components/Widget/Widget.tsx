import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react"
import cn from "classnames"
import { phone } from "phone"

import { ECallState, ETypeAction, TEventActions, useOnlinePBXPluginContext } from "../../providers"
import { PhoneIcon } from "../../assets"
import { Button } from "../Button"

import styles from "./Widget.module.css"
import { Input } from "../Input"

export interface IWidgetProps {
  className?: string
}

type TEventName = "calls" | "gateway" | "userBlf" | "userRegistration" | "isConnect"

export const Widget = ({ className }: IWidgetProps): ReactElement => {
  const [isOpenedForm, setIsOpenedForm] = useState<boolean>()
  const [isInvalidPhone, setIsInvalidPhone] = useState<boolean>()

  const { dispatch, state, makeCall, callInfo } = useOnlinePBXPluginContext()

  const invertParams = (type: TEventActions["type"], eventName: TEventName) => {
    return dispatch({
      type,
      payload: { eventName: state[eventName] },
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (callInfo.action !== ECallState.NO_ACTION) {
      return
    }
    if (!isOpenedForm) {
      setIsOpenedForm((prev) => !prev)
      return
    }
    const phoneNumber = new FormData(e.target as HTMLFormElement).get("phoneNumber")?.toString()
    if (phoneNumber) {
      const phoneDetails = phone(phoneNumber)
      if (phoneDetails.isValid) {
        makeCall(phoneDetails.phoneNumber, {
          onSuccess() {
            setIsOpenedForm(false)
          },
        })
      } else {
        setIsInvalidPhone(true)
      }
    } else {
      setIsOpenedForm(false)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const number = e.target.value
    if (number) {
      const phoneDetails = phone("number")
      if (phoneDetails.isValid) {
        setIsInvalidPhone(false)
      }
    } else {
      setIsInvalidPhone(false)
    }
  }

  useEffect(() => {
    if (callInfo.action !== ECallState.NO_ACTION) {
      setIsInvalidPhone(false)
      setIsOpenedForm(false)
    }
  }, [callInfo])
  return (
    <div className={cn(styles.container, { [styles.container_unactive]: !isOpenedForm }, className)}>
      <form action="" className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="tel"
          name="phoneNumber"
          className={cn(styles.phoneInput, { [styles.hiddenInput]: !isOpenedForm })}
          error={isInvalidPhone}
          onChange={handleInputChange}
        />
        <Button type="submit" className={isOpenedForm ? styles.submitButton : styles.phoneButton}>
          <PhoneIcon className={cn(styles.phoneIcon)} />
        </Button>
      </form>
    </div>
  )
}
