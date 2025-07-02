const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
    //permisos explicitos del bot   
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ],
});


client.once('ready', () => {
    console.log(`Bot iniciado como ${client.user.tag}`);
});

client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.reply('Pong!');
    }
});
const {token} = require('./config.json');
client.login(token);
