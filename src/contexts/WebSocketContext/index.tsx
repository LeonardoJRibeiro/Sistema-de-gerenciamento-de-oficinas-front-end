import React, { createContext, useCallback, useState } from "react"
import { useEffect, } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "../../hooks/useAuth";

export interface Notification {
  inserted: number;
  changed: number;
}

export type Dominio =
  "servico"
  | "marca"
  | "marca"
  | "modelo"
  | "peca"
  | "veiculo"
  | "cliente"
  | "fornecedor"
  | "funcionario"
  | "especialidade"

interface WebSocketValues {
  webSocket: Socket;
  getNotification: (dominio: Dominio) => Notification;
}

type Action = "changed" | "inserted"


interface Notifications {
  servico: Notification;
  marca: Notification;
  modelo: Notification;
  peca: Notification;
  veiculo: Notification;
  cliente: Notification;
  fornecedor: Notification;
  funcionario: Notification;
  especialidade: Notification;
}

const WebSocketContext = createContext<WebSocketValues>({} as WebSocketValues)

interface ProviderProps {
  webSocket: Socket;
}

const Provider: React.FC<ProviderProps> = ({ webSocket, children }) => {
  const [notifications, setNotifications] = useState<Notifications>({
    servico: { changed: 0, inserted: 0 },
    cliente: { changed: 0, inserted: 0 },
    especialidade: { changed: 0, inserted: 0 },
    fornecedor: { changed: 0, inserted: 0 },
    funcionario: { changed: 0, inserted: 0 },
    marca: { changed: 0, inserted: 0 },
    modelo: { changed: 0, inserted: 0 },
    peca: { changed: 0, inserted: 0 },
    veiculo: { changed: 0, inserted: 0 },
  } as Notifications);

  const updateNotifications = useCallback((dominio: Dominio, action: Action) => {
    setNotifications(notifications => {
      return {
        ...notifications,
        [dominio]: {
          changed: action === "changed" ? notifications[dominio].changed + 1 : notifications[dominio].changed,
          inserted: action === "inserted" ? notifications[dominio].inserted + 1 : notifications[dominio].inserted,
        }
      }
    })
  }, []);

  useEffect(() => {

    webSocket.on(`servicoIncluido`, (item: any) => {
      updateNotifications("servico", "inserted")
    })

    webSocket.on(`marcaIncluido`, (item: any) => {
      updateNotifications("marca", "inserted")
    })

    return () => {
      webSocket.close()
    }

  }, [updateNotifications, webSocket])

  const getNotification = useCallback((dominio: Dominio) => {
    return notifications[dominio]
  }, [notifications])

  return (
    <WebSocketContext.Provider value={{ webSocket, getNotification }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const WebSocketProvider: React.FC = ({ children }) => {
  const auth = useAuth();
  const webSocket = io(process.env.REACT_APP_API_URL as string, { auth: { token: auth.token }, });

  useEffect(() => {
    webSocket.on("connect", () => {
      console.log("conectou");
    })
    webSocket.on("connect_error", (err: any) => {
      console.log(err.message);
    });
    return () => console.log('desmontando')
  }, [webSocket])


  return (
    <Provider webSocket={webSocket} >
      {children}
    </Provider>
  );
}

export default WebSocketContext

