const express = require('express');
const {obtenerImagenDesdeURL} = require('./services/GetImages');
const { crearEmbedDesdeURL } = require('./services/FactoryEmbeds/EmbedFactory');
const e = require('express');
const app = express();
const PORT = 3001;

app.use(express.json()); // Permite recibir JSON

let discordClient = null;

// Exponemos esta función para recibir el cliente
function iniciarServidorExpress(client) {
    discordClient = client;

    app.post('/webhook', async (req, res) => {
        
        console.log('📩 Payload recibido:', req.body); // <-- log importante
        const { titulo, urlImagen, permalink, posthint } = req.body;
        if (!titulo || !urlImagen) {
            return res.status(400).send('Faltan campos requeridos.');
        }
        
        // Reemplazá con tu ID real del canal
        const canalId = '864998575946858518';

        //const urlImagen = await obtenerImagenDesdeURL(url);
        
        try {
        const embed = await crearEmbedDesdeURL({ 
            titulo, 
            urlImagen, 
            permalink,
            posthint 
        });
        // 2. Verificar si se creó el embed correctamente
        if (!embed) {
            console.error('✖️ No se pudo crear el embed (factory devolvió null)');
            return res.status(400).send('No se pudo crear el embed');
        }
        // 3. Obtener el canal y enviar el mensaje
        const canal = await discordClient.channels.fetch(canalId);
        await canal.send({ 
            embeds: [embed],
            // Asegurar que siempre hay content o embeds válidos
            content: ' ' // Espacio en blanco como fallback
        });
        res.status(200).send('Mensaje enviado a Discord');
    } catch (error) {
        console.error('✖️Error en el endpoint /webhook:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
    });

    app.listen(PORT, () => {
        console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
    });
}

module.exports = { iniciarServidorExpress };
