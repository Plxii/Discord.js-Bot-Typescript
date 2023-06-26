"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const sqlite3 = __importStar(require("sqlite3"));
const DiscordContainer = new sqlite3.Database('./database/discord.db', err => {
    if (err)
        return console.error(err);
});
DiscordContainer.get('SELECT * FROM ClientCredentials', (err, rows) => {
    if (err)
        return console.error(err);
    const client = new discord_js_1.Client({
        intents: [
            // Auto Moderation
            discord_js_1.GatewayIntentBits.AutoModerationConfiguration,
            discord_js_1.GatewayIntentBits.AutoModerationExecution,
            // DirectMessages
            discord_js_1.GatewayIntentBits.DirectMessages,
            // Guild
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMembers,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.GuildPresences,
            discord_js_1.GatewayIntentBits.GuildModeration,
            discord_js_1.GatewayIntentBits.GuildIntegrations,
            discord_js_1.GatewayIntentBits.GuildMessageReactions,
            discord_js_1.GatewayIntentBits.GuildScheduledEvents,
            discord_js_1.GatewayIntentBits.GuildVoiceStates,
            discord_js_1.GatewayIntentBits.GuildWebhooks,
            // Message Content
            discord_js_1.GatewayIntentBits.MessageContent
        ],
        failIfNotExists: true,
        waitGuildTimeout: 15000,
    });
    client.on(discord_js_1.Events.ClientReady, () => {
        console.info(`${__filename} >> Running on ${client.user?.tag} already.`);
    });
    client.login(rows.Token);
});
