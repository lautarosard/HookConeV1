const {SlashCommandBuilder} = require('discord.js');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { crearEmbedDesdeTexto } = require('./../../services/FactoryEmbeds/EmbedFactory');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ia')
    .setDescription('Pregunta a la IA')
    .addStringOption(option => 
        option.setName('mensaje')
        .setDescription('Pregunta a la IA')
        .setRequired(true)
    ),

    async execute(interaction) {
        const mensaje = await interaction.options.getString('mensaje');

        console.log('--- INTERACTION ---');
        console.log(interaction.options.data);

        if (!mensaje) {
            return await interaction.reply('❌ No escribiste ningún mensaje para enviar a la IA.');
        }
        //Para evitar timeouts
        await interaction.deferReply();

        try {
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: 'mistral',
                prompt: mensaje,
                stream: false,
                max_tokens: 300,
                stop: null,
                temperature: 0.5,
            });

            const respuestaIa= response.data.response?.trim();
            if (!respuestaIa) {
                return await interaction.editReply('⚠️ La IA no generó ninguna respuesta.');
            }
            //embed
            const embed = await crearEmbedDesdeTexto(1,respuestaIa);
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error al conectar con Ollama:', error);
            await interaction.editReply('Hubo un error al obtener la respuesta de la IA.');
        }
    },
};