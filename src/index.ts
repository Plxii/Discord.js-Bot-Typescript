import { Client, GatewayIntentBits } from 'discord.js';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import { Discord_ClientCredentials_Container } from '../database/container/types';

// Verify that the database directory aligns with the database builder.
const DBFiles = fs.readdirSync('./assets/db-builder/').filter(v => v.endsWith('.sql'));

for (let DBFile of DBFiles) {
    if (!fs.existsSync(`./database/${DBFile.replace('.sql', '.db')}`)) {
        fs.writeFileSync(`./database/${DBFile.replace('.sql', '.db')}`, '');

        let Container = new sqlite3.Database(`./database/${DBFile.replace('.sql', '.db')}`, err => {
            if (err) return console.error(err);
        });

        let BuildContainer = fs.readFileSync(`./assets/db-builder/${DBFile}`).toString(); // Convert buffer to string

        Container.run(BuildContainer);
        console.info('\x1b[31m%s\x1b[0m', `Please review '${DBFile.replace('.sql', '.db')}' before executing it.`)
    }
}


// Create database method of database file
const DiscordContainer = new sqlite3.Database('./database/discord.db', err => {
    if (err) return console.error(err);
});

// Main
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
    
    client.login(rows.Token).then(
        async () => {
            // event files
            const events = fs.readdirSync('./src/events/').filter(v => (v.endsWith('.ts') || v.endsWith('.js')));
            if (events) events.map(async v => (await import(`./events/${v}`)).default(client));

            // handler files
            const handlers = fs.readdirSync('./src/handlers/').filter(v => (v.endsWith('.ts') || v.endsWith('.js')));
            if (handlers) handlers.map(async v => (await import(`./handlers/${v}`)).default(client));
        }
    );
});


DiscordContainer.close(err => { if (err) console.error(err) });