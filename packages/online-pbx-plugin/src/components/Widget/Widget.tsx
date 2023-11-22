import { ReactElement } from "react"
import cn from 'classnames';

import styles from './Widget.module.css';

export interface IWidgetProps {
  className?: string;
}

export const Widget = ({ className }: IWidgetProps): ReactElement => {
  return <div className={cn(styles.container, className)}>asdasd</div>
}
