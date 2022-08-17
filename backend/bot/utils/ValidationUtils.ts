import { Snowflake } from "discord.js";
import { BotClient } from "../structures/BotClient";

export class ValidationUtils {
    private client: BotClient;

    constructor(client: BotClient) {
        this.client = client;
    }

    isCreator(id: Snowflake) {
        return this.client.creators.includes(id);
    }
}