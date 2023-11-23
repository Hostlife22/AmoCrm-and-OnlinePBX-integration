import { useEffect, useState } from "react"

export const useNotifications = () => {
  const [isAllow, setIsAllow] = useState<boolean>()

  const checkPermission = () => {
    if (!("Notification" in window)) {
      return
    }
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        setIsAllow(true)
      }
    })
  }

  const sendNotification = (message: string) => {
    if (!("Notification" in window) || !isAllow) {
      return
    }
    const notification = new Notification(message)
    return notification
  }

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setIsAllow(true)
      } else {
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            setIsAllow(true)
          }
        })
      }
    }
  }, [])

  return {
    isAllow,
    checkPermission,
    sendNotification,
  }
}
