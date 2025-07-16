const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function crearEmbedRedditConApi(titulo, urlImagen, permalink, posthint) {
    try {
        let postData = null;

        if (permalink) {
            const url = `https://www.reddit.com${permalink}.json`;
            const res = await axios.get(url, {
                headers: { 'User-Agent': 'HookConeBot/1.0' },
                timeout: 9000 // 5 segundos
            });
            postData = res.data[0]?.data?.children[0]?.data;
        } else {
            const query = encodeURIComponent(titulo);
            const searchUrl = `https://www.reddit.com/search.json?q=${query}&limit=1&type=link`;
            const searchRes = await axios.get(searchUrl, {
                headers: { 'User-Agent': 'HookConeBot/1.0' }
            });
            postData = searchRes.data?.data?.children[0]?.data;
        }

        if (!postData) {
            console.warn('🔍 No se encontró el post en Reddit.');
            return null;
        }

        const postUrl = `https://www.reddit.com${postData.permalink}`;
        const image = postData.url_overridden_by_dest || urlImagen;

        if (!postData.title || !postData.permalink || !image) {
            console.warn('❗ Post incompleto, no se puede crear el embed.');
            return null;
        }

        const embed = new EmbedBuilder()
            .setTitle(postData.title || titulo)
            .setURL(postUrl)
            .setImage(image)
            .setDescription((postData.selftext ? postData.selftext.substring(0, 200) : '📬 Nuevo post en Reddit'))
            .setAuthor({ name: `u/${postData.author}` })
            .setFooter({ text: `r/${postData.subreddit}` })
            .setColor(0xFF4500)
            .setTimestamp();
        console.log('✅ Embed de Reddit creado con API. ', postData.selftext.substring(0, 200));
        return embed;

    } catch (error) {
        console.error('❌ Error al crear embed Reddit con API:', error.message);
        return null;
    }
}

module.exports = { crearEmbedRedditConApi };
