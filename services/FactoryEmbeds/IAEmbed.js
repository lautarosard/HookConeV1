const { EmbedBuilder } = require('discord.js');

async function crearEmbedIA(texto) {
    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Respuesta de la IA🤖')
        .setDescription(texto)
        .setTimestamp();

    return embed;
}

module.exports = { crearEmbedIA };