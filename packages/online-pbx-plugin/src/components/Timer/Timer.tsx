import { ComponentProps, useEffect, useMemo, useRef, useState } from "react"
import classNames from "classnames"

import styles from "./Timer.module.css"

interface ITimerProps {
  startTime?: Date
}

export const Timer = ({ className, startTime: defaultStartTime, children, ...props }: ComponentProps<"div"> & ITimerProps) => {
  const [time, setTime] = useState("00:00")
  const interval = useRef<ReturnType<typeof setInterval>>()
  const startTime = useMemo(() => defaultStartTime || new Date(), [defaultStartTime]);
  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current)
    }
    interval.current = setInterval(() => {
      const diff = (Date.now() - startTime.getTime()) / 1000
      const m = Math.floor(diff / 60)
      const s = Math.floor(diff - (m * 60));
      setTime(`${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`)
    }, 1000)

    return () => {
      if (interval.current) {
        clearInterval(interval.current)
      }
    }
  }, [startTime])

  return (
    <div className={classNames(styles.timer, className)} {...props}>
      {time}
    </div>
  )
}
