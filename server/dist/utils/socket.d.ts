import { Server as HttpServer } from "http";
declare module "socket.io" {
    interface SocketData {
        user: {
            id: string;
            username: string;
        };
    }
    interface Socket {
        userId: string;
        username: string;
    }
}
declare const initSocket: (server: HttpServer) => void;
export default initSocket;
//# sourceMappingURL=socket.d.ts.map