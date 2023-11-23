import { ComponentProps } from "react"
import classNames from "classnames"

import styles from "./Button.module.css"

export const Button = ({ className, children, ...props }: ComponentProps<"button">) => {
  return (
    <button className={classNames(styles.button, className)} {...props}>
      {children}
    </button>
  )
}
