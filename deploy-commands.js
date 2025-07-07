const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const commandPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] El comando en ${filePath} no tiene "data" o "execute".`);
        }
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`🔄 Registrando ${commands.length} comandos slash...`);

        const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
        );

        console.log(`✅ Comandos registrados con éxito: ${data.length}`);
    } catch (error) {
        console.error('⛔ Error al registrar comandos:', error);
    }
})();
