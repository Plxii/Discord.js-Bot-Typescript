import { AutocompleteInteraction, ChatInputCommandInteraction, Client, Interaction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription('Replies with "Pong!"')
    ,
    async autoInteraction(client: Client, interaction: AutocompleteInteraction) {},
    async run(interaction: ChatInputCommandInteraction) {
        interaction.reply({
            content: `🏓 Pong~!`
        });
    }
}