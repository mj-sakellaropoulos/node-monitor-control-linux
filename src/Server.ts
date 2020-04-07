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
    public user: string;
    public pass: string;

    constructor(listenAddress: string, port: number, user: string, pass: string) {
        this.httpServer = createServer(this.requestCallback);
        this.httpServer.listen(port, listenAddress);
        this.user = user;
        this.pass = pass;
    }

    public requestCallback: RequestListener = (
        request: IncomingMessage,
        response: ServerResponse
    ) => {
        console.log(`REQUEST : [${request.method}] ${request.url}`);
        
        //basic auth
        response.setHeader('WWW-Authenticate', 'Basic realm=NodeMonitorControlLinux')
        if(request.headers.authorization){
            const auth = request.headers.authorization.trim().split(" ");
            if(auth[0] === "Basic"){
                const base64 = auth[1];
                const buff = new Buffer(base64, 'base64');
                const token = buff.toString('ascii').trim().split(":");
                const user = token[0]
                const pass = token[1];
                if(user !== this.user || pass !== this.pass){
                    response.statusCode = 401;
                    response.end("Unauthorized.")
                }
            }else{
                response.statusCode = 401;
                response.end("Unauthorized.")
            }
        }else{
            response.statusCode = 401;
            response.end("Unauthorized.")
        }
        

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
