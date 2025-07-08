const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json()); // Permite recibir JSON

let discordClient = null;

// Exponemos esta función para recibir el cliente
function iniciarServidorExpress(client) {
    discordClient = client;

    app.post('/webhook', async (req, res) => {
        const { titulo, url } = req.body;

        if (!titulo || !url) {
            return res.status(400).send('Faltan campos requeridos.');
        }

        // Reemplazá con tu ID real del canal
        const canalId = '864998575946858518';

        try {
            const canal = await discordClient.channels.fetch(canalId);
            await canal.send(`📢 **Nuevo post**: [${titulo}](${url})`);
            res.status(200).send('Mensaje enviado a Discord');
        } catch (error) {
            console.error('Error al mandar mensaje al canal:', error);
            res.status(500).send('Error interno');
        }
    });

    app.listen(PORT, () => {
        console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
    });
}

module.exports = { iniciarServidorExpress };
