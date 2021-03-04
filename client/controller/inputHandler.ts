import { Connector, Connection } from "../service/connector.ts"
import { parse } from "https://deno.land/std@0.89.0/flags/mod.ts";
import { Utility } from "../../shared/utility.ts"
import {
    decode,
    encode,
} from "https://deno.land/std@0.89.0/encoding/ascii85.ts"
export class InputHandler {

    async initialize(args: string[]) {
        // this.printStartOutput()
        const { host } = parse(args)


        let connection: Connection
        if (host) {
            connection = Connector.createHost()
            await Utility.pause(5)
        } else {


            try {
                connection = await Connector.searchHost()
                console.log("Found active Host at " + connection.target)
                console.log("Dou you want to connect? (y/n)")
                let bytes = new Uint8Array(2)
                await Deno.stdin.read(bytes)
                const input = encode(bytes)
                if (input[0].toLowerCase() === "n") Deno.exit()
            } catch (err) {
                console.log("Do you want to start a Host? (y/n)")
                let bytes = new Uint8Array(2)
                await Deno.stdin.read(bytes)
                const input = encode(bytes)
                if (input[0].toLowerCase() === "n") Deno.exit()
                connection = Connector.createHost()
                await Utility.pause(5)
            }
        }
        await Connector.connect(connection)

        while (true) {
            const inputxxx = new Uint8Array(1024);
            await Deno.stdin.read(inputxxx);
            const msg = new TextDecoder().decode(inputxxx)
            connection.socketConnection?.send(msg);
        }
    }
    printStartOutput() {
        console.log(
            `************************************
*  LocalChat
************************************`.replace(" ", ""))
    }
}