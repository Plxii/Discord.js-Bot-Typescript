import { Client, Events, GatewayIntentBits } from 'discord.js';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';

// replace SQL string to Database File & Check directory
const DBFiles = fs.readdirSync('./assets/db-builder/').filter(v => v.endsWith('.sql'));

for (let DBFile of DBFiles) {
    if (!fs.existsSync('./database/')) {
        fs.mkdirSync('./database/');
    } else if (!fs.existsSync(`./database/${DBFile.replace('.sql', '.db')}`)) {
        fs.writeFileSync(`./database/${DBFile.replace('.sql', '.db')}`, '');

        let Container = new sqlite3.Database(`./database/${DBFile.replace('.sql', '.db')}`, err => {
            if (err) return console.error(err);
        });

        let BuildContainer = fs.readFileSync(`./assets/db-builder/${DBFile}`).toString(); // Convert buffer to string

        Container.run(BuildContainer);
        console.info('\x1b[31m%s\x1b[0m', `Please review '${DBFile.replace('.sql', '.db')}' before executing it.`)
    }
}



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