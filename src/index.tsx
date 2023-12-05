import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router";
import {router} from "./router";
import {ThemeProvider} from "./providers/ThemeProvider";
import {AppStateProvider} from "./providers/AppStateProvider";
import NotificationProvider from './providers/NotificationProvider';
import {DataContextProvider} from "./providers/DataContext";
import {ModalContextProvider} from "@subwallet/react-ui";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <DataContextProvider>
            <ThemeProvider>
                <ModalContextProvider>
                    <NotificationProvider>
                        <AppStateProvider>
                            <RouterProvider router={router}/>
                        </AppStateProvider>
                    </NotificationProvider>
                </ModalContextProvider>
            </ThemeProvider>
        </DataContextProvider>
    </React.StrictMode>
);

