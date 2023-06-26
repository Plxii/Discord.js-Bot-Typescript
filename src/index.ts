import { Client, Events, GatewayIntentBits, Presence, Sweepers } from 'discord.js';
import * as sqlite3 from 'sqlite3';

const DiscordContainer = new sqlite3.Database('./database/discord.db', err => {
    if (err) return console.error(err);
});

export interface Discord_ClientCredentials_Container {
    "Token": string
    "Application Id": string
    "Public Key": string
    "Client Id": string
    "Client Secret": string
}

DiscordContainer.get('SELECT * FROM ClientCredentials', (err, rows: Discord_ClientCredentials_Container) => {
    if (err) return console.error(err);

    const client = new Client({
        intents: [
            // Auto Moderation
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution,
    
            // DirectMessages
            GatewayIntentBits.DirectMessages,
    
            // Guild
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildWebhooks,
    
            // Message Content
            GatewayIntentBits.MessageContent
        ],
        failIfNotExists: true,
        waitGuildTimeout: 15000,
    });
    
    client.on(Events.ClientReady, () => {
        console.info(`${__filename} >> Running on ${client.user?.tag} already.`)
    });
    
    client.login(rows.Token);
});