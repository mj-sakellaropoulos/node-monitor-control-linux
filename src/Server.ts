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
                    let data:any = [];
                    request.on('data', chunk => {
                        data.push(chunk);
                    })
                    request.on('end', () => {
                        let body = JSON.parse(data);
                        if(body.monitor){
                            response.end(JSON.stringify(XSET.setMonitorStatus(body.monitor)));
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
