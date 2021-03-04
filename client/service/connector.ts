import { Utility } from "../../shared/utility.ts"

export class Connector {

    static async searchHost() {

        const promises: Promise<Response>[] = []

        const createEmptyPromise = () => new Promise<Response>(resolve => setTimeout(() => resolve(new Response(null, { status: 500 })), 2000))
        promises.push(createEmptyPromise())

        for (let i = 0; i < 256; i++) promises.push(fetch("http://192.168.2." + i + ":8000/ping"))

        const response = await Promise.any(promises)

        if (response.status === 500) throw new Error("No host found")

        return new ClientConnection(response.url.replace("http", "ws").replace("/ping", ""))
    }


    static createHost = () => new AdminConnection()

    static async connect<T extends Connection>(connection: T) {
        await connection.connect()
    }

}


export abstract class Connection {

    private _target: string
    protected socket: WebSocket | undefined
    get target() {
        return this._target
    }
    get socketConnection() {
        return this.socket
    }
    protected newConnection() {

        if (this.socket) this.socket.onmessage = (ev: MessageEvent<any>) => console.log(ev.data)
    }
    abstract connect(): Promise<void>

    constructor(target: string) {
        this._target = target
    }
}

class ClientConnection extends Connection {
    async connect() {
        this.socket = new WebSocket(this.target)
        this.newConnection()
    }
    constructor(target: string) {
        super(target)
    }
}

class AdminConnection extends Connection {
    async connect() {

        this.socket = new WebSocket("ws://localhost:8000");
        this.newConnection()
    }
    constructor() {
        super("localhost")

        const process = Deno.run({
            cmd: ["deno", "run", "--allow-net", Deno.cwd() + "/server/server.ts"]
        });

    }
}