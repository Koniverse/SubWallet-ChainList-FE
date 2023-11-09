
import React from "react";
import {appTheme} from "../../themes";
import {CheckCircle, WarningCircle, XCircle, Info} from "phosphor-react";

interface Props {
    status: 'success' | 'info' | 'error' | 'warning';
}


const iconMapFilled = {
  success: CheckCircle,
  info: Info,
  error: XCircle,
  warning: WarningCircle,
};

const StatusIcon = ({ status }: Props) => {
  const theme = appTheme;
  // @ts-ignore
  const color = theme.token[`color${status[0].toUpperCase()}${status.slice(1)}`];
    const Icon = iconMapFilled[status];
    return <Icon color={color} weight='fill' size={18}/>;
}
export default StatusIcon;
