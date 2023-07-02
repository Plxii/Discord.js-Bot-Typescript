import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Client,
    Interaction,
    SlashCommandBuilder,
} from 'discord.js';
import * as math from 'mathjs';
import {
    createCanvas,
    loadImage,
    registerFont
} from 'canvas';
import fetch from 'node-fetch';

// Define default chart size
const defaultChartWidth = 250;
const defaultChartHeight = 150;

export default {
    data: new SlashCommandBuilder()
        .setName('calculate')
        .setDescription('Perform math calculations')
        .addStringOption((expression) =>
            expression.setName('expression').setDescription('Enter a math expression').setRequired(true)
        ),
    async autoInteraction(client: Client, interaction: AutocompleteInteraction) {},
    async run(interaction: ChatInputCommandInteraction) {
        const mathExpression = interaction.options.getString('expression', true);

        try {
            let result = math.evaluate(mathExpression).toString();
            let latexExpression = math.parse(mathExpression).toTex({
                parenthesis: 'auto'
            });
            let LaTexCode = `${latexExpression}=${result}`;
            console.info(LaTexCode);
            const imageBuffer = await renderLaTeX(LaTexCode);

            await interaction.deferReply(); // Defer the initial reply

            await interaction.followUp({
                content: `The expression \`${mathExpression}\` is equal to \`${result}\``,
                files: [{
                    attachment: imageBuffer,
                    name: "expression-chart.png",
                }],
            });
        } catch (error) {
            console.error('Error parsing math expression:', error);
            await interaction.reply({
                content: 'Invalid math expression. Please check your input.',
            });
        }
    },
};

async function renderLaTeX(latexCode: string) {
    const chartUrl = await getChartUrl(latexCode);
    const response = await fetch(chartUrl);
    const buffer = await response.buffer();
    return buffer;
}

async function getChartUrl(latexCode: string) {
    const chartApiUrl = 'https://chart.googleapis.com/chart';
    const chartWidth = calculateChartWidth(latexCode);
    const chartHeight = calculateChartHeight(chartWidth);
    const textColor = 'D86E28';
    const backgroundColor = '1B1D20';

    const chartUrl = `${chartApiUrl}?cht=tx&chl=${encodeURIComponent(
        latexCode
    )}&chs=${chartWidth}x${chartHeight}&chf=bg,s,${backgroundColor}&chco=${textColor},${textColor}&chxs=0,${textColor},0,lt`;
    return chartUrl;
}


function calculateChartWidth(latexCode: string) {
    const maxWidth = 1200; // Maximum width of the chart
    const codeLength = latexCode.length;
    const characterWidth = 8; // Width of each character in pixels

    // Calculate the width based on the length of the code and the character width
    var width = codeLength * characterWidth;

    // Check if the calculated width is smaller than the default width, use the default width instead
    if (width < defaultChartWidth) {
        width = defaultChartWidth;
    }

    // Return the minimum value between the calculated width and the maximum width
    return Math.min(width, maxWidth);
}

function calculateChartHeight(chartWidth: number): number {
    const aspectRatio = 2 / 3; // Desired aspect ratio (height / width)
    var height = Math.round(chartWidth * aspectRatio);

    // Check if the calculated height is smaller than the default height, use the default height instead
    if (height < defaultChartHeight) {
        height = defaultChartHeight;
    }

    return height;
}
