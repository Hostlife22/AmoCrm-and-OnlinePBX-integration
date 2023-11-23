import { ComponentProps } from "react"
import classNames from "classnames"

import styles from "./Input.module.css"

interface IInputProps {
  error?: boolean
}

export const Input = ({ className, error, ...props }: ComponentProps<"input"> & IInputProps) => {
  return <input className={classNames(styles.input, { [styles.input_error]: error }, className)} {...props} />
}
