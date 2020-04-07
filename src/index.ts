import { BasicServer } from './Server';
import * as process from 'process'

const listenAddress: string = "0.0.0.0";
let port: number = 10245;
let user: string = "admin";
let pass: string = "admin";

if(process.argv[2]){
    port = parseInt(process.argv[2]);
}

if(process.argv[3] && process.argv[4]){
    user = process.argv[3];
    pass = process.argv[4];
}

console.log(`Starting server on ${listenAddress}:${port}...`);

const server: BasicServer = new BasicServer(listenAddress, port, user, pass);