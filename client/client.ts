import { Connector } from "./service/connector.ts"
import { InputHandler } from "./controller/inputHandler.ts"

await new InputHandler().initialize(Deno.args)
