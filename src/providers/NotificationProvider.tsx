import {notification} from "@subwallet/react-ui";
import {NotificationContext} from "../contexts";
import React from "react";

interface Props {
  children: React.ReactElement
}

export function NotificationProvider({children}: Props) {
  const [notify, contextHolder] = notification.useNotification({
    top: 64
  });

  return <NotificationContext.Provider value={notify}>
    {contextHolder}
    {children}
  </NotificationContext.Provider>
}

export default NotificationProvider;
