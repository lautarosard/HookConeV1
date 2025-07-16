async function obtenerImagenReddit(url) {
    try {
        const redditJsonUrl = url.endsWith('/') ? `${url}.json` : `${url}/.json`;
        const { data } = await axios.get(redditJsonUrl, {
            headers: { 'User-Agent': 'DiscordBot/1.0 by tu_usuario' }
        });

        const post = data[0].data.children[0].data;

        // Este campo suele contener la imagen real del post
        if (post.url_overridden_by_dest && post.post_hint === 'image') {
            return post.url_overridden_by_dest;
        }

        // Si no es imagen directa, tal vez tiene un thumbnail válido
        if (post.thumbnail && post.thumbnail.startsWith('http')) {
            return post.thumbnail;
        }

        return null;
    } catch (error) {
        console.error('❌ Error al obtener imagen desde Reddit:', error.message);
        return null;
    }
}

module.exports = { obtenerImagenReddit };