import * as React from "react";
import { ReactElement } from "react"

export interface IWidgetProps {
  phoneNumber?: string
}

export const Widget = ({ phoneNumber }: IWidgetProps): ReactElement => {
  return <div></div>
}
