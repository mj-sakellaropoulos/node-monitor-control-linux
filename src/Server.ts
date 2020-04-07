import { createServer, Server } from 'https';

import * as fs from 'fs';

import { IncomingMessage, RequestListener, ServerResponse } from 'http';
import { XSET } from './XSET';

export class BasicServer {
    public httpsServer: Server;
    public user: string;
    public pass: string;

    constructor(listenAddress: string, port: number, user: string, pass: string) {
        const opts = {
            key: fs.readFileSync('key.pem'),
            // tslint:disable-next-line: object-literal-sort-keys
            cert: fs.readFileSync('cert.pem')
        };
        this.httpsServer = createServer(opts, this.requestCallback);
        this.httpsServer.listen(port, listenAddress);
        this.user = user;
        this.pass = pass;
    }

    public requestCallback : RequestListener = (
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
                const buff = Buffer.from(base64, 'base64');
                const token = buff.toString('ascii').trim().split(":");
                const user = token[0]
                const pass = token[1];
                if(user !== this.user || pass !== this.pass){
                    response.statusCode = 401;
                    response.end("Unauthorized.")
                    return;
                }
            }else{
                response.statusCode = 401;
                response.end("Unauthorized.")
                return;
            }
        }else{
            response.statusCode = 401;
            response.end("Unauthorized.")
            return;
        }
        

        switch (request.url) {
            case '/dpms': {
                if (request.method === 'GET') {
                    response.end(JSON.stringify(XSET.getMonitorStatus()));
                    return;
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
                                response.end("Accepted values: standby, suspend, off, on")
                                return;
                            }else{
                                response.end(JSON.stringify(result));
                                return;
                            }
                        }
                    })
                }
                break;
            }
            default: {
                response.statusCode = 404;
                response.end();
                return;
            }
        }
    };
}
