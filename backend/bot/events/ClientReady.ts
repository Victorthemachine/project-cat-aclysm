import { ActivityType } from 'discord.js';
import { BotClient } from '../structures/BotClient';
import { Event, EventOptions } from '../structures/Event';

export default class extends Event {
    
    private activities: string[] = [
        'These kids with their sci-fi mumbo jumbo like: sleep, happiness and Switzerland',
        'Will accept hefty donation of nuts during this harsh winter',
        'If you want to help send Nya~san all of your collage savings or pizza',
        'Munching on deez nuts',
    ];

    constructor(client: BotClient, name: string, options?: EventOptions) {
        super(client, name, {
            ...options,
            type: 'once'
        });
    }

    async statusInterval(timeout?: number) {
        return setTimeout(() => {
            this.client.user!.setActivity(`${this.activities[Math.floor(Math.random() * this.activities.length)]}`,
                { type: ActivityType.Listening });
            this.statusInterval(300000);
        }, timeout || 10);
    }

    async run() {
        console.log([
            `Logged in as ${this.client.user!.tag}`,
            `Loaded ${this.client.commands.size} commands!`,
            `Loaded ${this.client.slashcommands.size} slash interactions!`,
            `Loaded ${this.client.events.size} events!`
        ].join('\n'));
        this.statusInterval();
    }

};
