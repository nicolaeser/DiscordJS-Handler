import { ChatInputCommandInteraction, Message, Interaction } from "discord.js";
import type { ExtendedClient } from "@/structs/ExtendedClient";
import { CommandOptions } from "@/types";
export type MiddlewareContext = {
    client: ExtendedClient;
    interaction?: Interaction;
    message?: Message;
    command: {
        options?: CommandOptions;
        structure: {
            name: string;
            [key: string]: any;
        }
    };
    args?: string[];
};
export type MiddlewareResult = {
    next: boolean;
    message?: string; 
};
export type MiddlewareFunction = (context: MiddlewareContext) => Promise<MiddlewareResult>;
export class MiddlewareManager {
    private middlewares: MiddlewareFunction[] = [];
    public use(middleware: MiddlewareFunction) {
        this.middlewares.push(middleware);
    }
    public async execute(context: MiddlewareContext): Promise<MiddlewareResult> {
        for (const middleware of this.middlewares) {
            try {
                const result = await middleware(context);
                if (!result.next) {
                    return result;
                }
            } catch (error) {
                console.error("Middleware error:", error);
                return { next: false, message: "An internal error occurred during command validation." };
            }
        }
        return { next: true };
    }
}
