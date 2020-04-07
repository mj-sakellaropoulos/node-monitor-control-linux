import {
    createServer,
    IncomingMessage,
    RequestListener,
    Server,
    ServerResponse
} from 'http';
import { XSET } from './XSET';

export class BasicServer {
    public httpServer: Server;

    constructor(listenAddress: string, port: number, user: string, pass: string) {
        this.httpServer = createServer(this.requestCallback);
        this.httpServer.listen(port, listenAddress);
    }

    public requestCallback: RequestListener = (
        request: IncomingMessage,
        response: ServerResponse
    ) => {
        switch (request.url) {
            case '/dpms': {
                if (request.method === 'GET') {
                    response.end(JSON.stringify(XSET.getMonitorStatus()));
                } else if (request.method === 'POST') {
                    const data:any = [];
                    request.on('data', chunk => {
                        data.push(chunk);
                    })
                    request.on('end', () => {
                        const body = JSON.parse(data);
                        if(body.monitor){
                            const result = XSET.setMonitorStatus(body.monitor);
                            if(result === false){
                                response.statusCode = 400;
                                response.end("standby, suspend, off, on")
                            }else{
                                response.end(JSON.stringify(result));
                            }
                        }
                    })
                }
                break;
            }
            default: {
                response.statusCode = 404;
                response.end();
            }
        }
    };
}
