import { Client, Events } from "discord.js";

export default async (client: Client) => {
    client.on(Events.ClientReady, () => {
        console.info(`Heya~, ${client.user?.tag} online already now~!`)
    });
}