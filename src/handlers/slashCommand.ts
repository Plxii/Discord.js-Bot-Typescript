import { Client, Collection, REST, Routes,  } from 'discord.js';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import { Discord_ClientCredentials_Container } from '../../database/container/types';


export default async (client: Client) => {
    // Create database method of database file
    const DiscordContainer = new sqlite3.Database('./database/discord.db', err => {
        if (err) return console.error(err);
    });

    DiscordContainer.get('SELECT * FROM ClientCredentials', async (err, rows: Discord_ClientCredentials_Container): Promise<void> => {
        if (err) return console.error(err);
        const CommandCollection = new Collection();
        const CommandArray: any[] = [];

        // get slash command files
        let commandFiles = fs.readdirSync(`./src/commands/`).filter(v => (v.endsWith('.ts') || v.endsWith('.js')));
        for (let commandFile of commandFiles) {
            const command = (await import(`../commands/${commandFile}`)).default;
            CommandArray.push(command.data.toJSON());
            CommandCollection.set(command.data.name, command);
        }
        
        const rest = new REST({ version: '10' }).setToken(client.token ? client.token : rows.Token);
        
        try {
            console.log('Started refreshing application (/) commands.');
            
            await rest.put(Routes.applicationCommands(client.application?.id ? client.application?.id : rows['Application Id']), { body: CommandArray });
            
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }


        // Create an Interaction
        client.on('interactionCreate', async interaction => {
            if (interaction.isChatInputCommand()) {
                let command: any = CommandCollection.get(interaction.commandName);
                try {
                    command.run(interaction);
                }
                catch (error) {
                    interaction.reply({
                        content: 'Sorry, but found some error while running this command, please try again!',
                        ephemeral: true
                    })
                }
            }
            else if (interaction.isAutocomplete()) {
              // TODO document why this block is empty
                let command: any = CommandCollection.get(interaction.commandName);
                try {
                    command.autoInteraction(client, interaction);
                }
                catch (error) {
                    console.error(error);
                }
            }
          });
    });

    DiscordContainer.close(err => { if (err) console.error(err) });
}