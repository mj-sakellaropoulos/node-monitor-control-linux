import { BasicServer } from './Server';

export * from './lib/async';
export * from './lib/hash';
export * from './lib/number';

const listenAddress: string = "0.0.0.0";
const port: number = 10245;
const user: string = "admin";
const pass: string = "admin";

console.log(`Starting server on ${listenAddress}:${port}...`);

const server: BasicServer = new BasicServer(listenAddress, port, user, pass);