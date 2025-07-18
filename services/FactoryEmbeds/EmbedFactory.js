const { crearEmbedIA } = require('./IAEmbed');
const { crearEmbedRedditConApi } = require('./RedditEmbed');

async function crearEmbedDesdeURL({ titulo, urlImagen, permalink, posthint }) {
    try {
        // Validación básica de parámetros
        if (!titulo || !urlImagen) {
            console.warn('Faltan parámetros requeridos');
            return null;
        }

        // Factory para diferentes tipos de contenido
        if (urlImagen.includes('i.redd.it')) {
            const embed = await crearEmbedRedditConApi(titulo, urlImagen, permalink, posthint);
            if (!embed) {
                console.warn('No se pudo crear embed de Reddit');
                return null;
            }
            return embed;
        }
        
        // Puedes agregar más condiciones para otros tipos de contenido aquí
        console.warn('Tipo de URL no soportado:', urlImagen);
        return null;
        
    } catch (error) {
        console.error('Error en crearEmbedDesdeURL:', error.message);
        return null;
    }
}

async function crearEmbedDesdeTexto(opc, texto) {
    try{
        if(opc == 1){
            const embed = crearEmbedIA(texto);
            return embed;
        }else{
            console.log("No existe un embed con esta opción 💔");
            return null;
        }
    }catch(error){
        console.error('Error en crearEmbedDesdeTexto:', error.message);
        return null;
    }
}
module.exports = { crearEmbedDesdeURL, crearEmbedDesdeTexto };