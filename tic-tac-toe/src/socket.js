import {createContext} from 'react';
import socketClient from 'socket.io-client';
const SERVER = "http://127.0.0.1:4001";  // url of the backend server
export const socket = socketClient(SERVER);
export const SocketContext = createContext(socket);