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
  
      let result = math.evaluate(mathExpression);
      let latexExpression = math.parse(mathExpression).toTex({ parenthesis: 'auto' });
      let LaTexCode = `${latexExpression}=${result}`;
      console.info(LaTexCode);
  
      const imageBuffer = await renderLaTeX(LaTexCode);
      console.log('Image rendered');
  
      await interaction.reply({
        content: `The expression \`${mathExpression}\` is equal to \`${result}\``,
        files: [
          {
            attachment: imageBuffer,
            name: 'expression.png',
          },
        ],
      });
    },
  };
  
  async function renderLaTeX(latexCode: string | number | boolean) {
    const chartUrl = await getChartUrl(latexCode);
    const response = await fetch(chartUrl);
    const buffer = await response.buffer();
    return buffer;
  }
  
  async function getChartUrl(latexCode: string | number | boolean) {
    const chartApiUrl = 'https://chart.googleapis.com/chart';
    const chartWidth = 600;
    const chartHeight = 200;
  
    const chartUrl = `${chartApiUrl}?cht=tx&chl=${encodeURIComponent(latexCode)}&chs=${chartWidth}x${chartHeight}`;
    return chartUrl;
  }
  