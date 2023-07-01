import { AutocompleteInteraction, ChatInputCommandInteraction, Client, Interaction, SlashCommandBuilder } from 'discord.js';
import * as math from 'mathjs';

// Looking forward to the upcoming developments!
import * as katex from 'katex'; // Updated import
import { createCanvas, loadImage, CanvasRenderingContext2D, Image } from 'canvas';


export default {
    data: new SlashCommandBuilder()
        .setName('calculate')
        .setDescription('Perform math calculations')
        .addStringOption(expression => expression
            .setName('expression')
            .setDescription('Enter a math expression')
            .setRequired(true)
        ),
    async autoInteraction(client: Client, interaction: AutocompleteInteraction) {},
    async run(interaction: ChatInputCommandInteraction) {
        const mathExpression = interaction.options.getString('expression', true);
        try {
            let result = math.evaluate(mathExpression);
            // Looking forward to the upcoming developments!
            let latexExpression = math.parse(mathExpression).toTex({ parenthesis: 'auto' });
            let latexResult = math.format(result, { notation: 'fixed' });

            // You can then send the image buffer in your Discord reply.
            await interaction.reply({
                content: `The expression ${mathExpression} is equal to ${result}.`,
            });
        } catch (e) {
            console.info(e);
            // If an error occurs during evaluation or parsing, handle it gracefully
            await interaction.reply({
                content: 'An error occurred while processing the expression.',
            });
            return;
        }
    }
};
