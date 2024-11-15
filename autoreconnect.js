const { joinVoiceChannel } = require('@discordjs/voice');

const reconnectToVoiceChannel = (client, channelId, guildId, adapterCreator) => {
    // Try to reconnect to the voice channel if disconnected
    const channel = client.channels.cache.get(channelId);
    if (channel && channel.isVoiceBased()) {
        try {
            joinVoiceChannel({
                channelId: channelId,
                guildId: guildId,
                adapterCreator: adapterCreator,
            });
            console.log(`Reconnected to voice channel ${channelId}.`);
        } catch (error) {
            console.error('Failed to reconnect to the voice channel:', error);
        }
    }
};

module.exports = { reconnectToVoiceChannel };
