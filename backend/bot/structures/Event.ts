import EventEmitter from "events";
import { BotClient } from "./BotClient";

export interface EventOptions {
    readonly type?: 'once' | 'on';
}

export abstract class Event {

    client: Required<BotClient>;
    readonly name: string;
    readonly type: 'once' | 'on';

    constructor(client: BotClient, name: string, options?: EventOptions) {
        this.client = client;
        this.name = name;
        this.type = options && options.type ? options.type : 'on';
    }

    async run(...args: any): Promise<void> { }
}