const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const si = require('systeminformation');
const fs = require('fs');
require('dotenv').config();

const config = require('./config.js');  
const printLog = require('./print.js');  

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Define the new log message with the current time
    const logMessage = ` 


    ░▒▓██████▓▒░░▒▓███████▓▒░░▒▓███████▓▒░ ░▒▓██████▓▒░  
    ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
    ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
     ░▒▓███████▓▒░▒▓███████▓▒░░▒▓███████▓▒░░▒▓████████▓▒░ 
           ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
           ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
     ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░ 
                                                          
                                                          
               

Made By 9R3A OWNER OF 9R3A HUB ( 9H )
Telegram : https://t.me/R3A_HUB
Discord Server : https://discord.gg/ZDe7vEHYJJ
Github :https://github.com/9R3A
`;

    // Read the original content of print.js to preserve it
    const originalContent = fs.readFileSync('./print.js', 'utf8');

    // Replace only the logMessage in print.js while keeping other content intact
    const updatedContent = originalContent.replace(
        /logMessage: `.*`/s,
        `logMessage: \`${logMessage}\``
    );

    // Write the updated content back to print.js
    fs.writeFileSync('./print.js', updatedContent);
    
    console.log(logMessage);

    const updateMetrics = async () => {
        try {
            const cpuLoad = await si.currentLoad();
            const memory = await si.mem();
            const cpuPercent = cpuLoad.avgLoad.toFixed(2);
            const ramPercent = ((memory.active / memory.total) * 100).toFixed(2);

            client.user.setPresence({
                activities: [{ name: `CPU: ${cpuPercent}% | RAM: ${ramPercent}%`, type: 'WATCHING' }],
                status: 'idle',
            });

            if (config.metricsChannelId) {
                const channel = client.channels.cache.get(config.metricsChannelId);
                if (channel) {
                    const metricsEmbed = new EmbedBuilder()
                        .setColor(0x0099ff)
                        .setTitle('System Metrics')
                        .setDescription(`📊 **System Metrics**\nCPU Usage: ${cpuPercent}%\nRAM Usage: ${ramPercent}%`)
                        .setFooter({ text: 'Use !help to call commands like !metrics-c or get help.' });

                    await channel.send({ embeds: [metricsEmbed] });
                }
            }
        } catch (error) {
            console.error('Error fetching or sending system information:', error);
        }
    };

    setInterval(updateMetrics, 120000);
    updateMetrics();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!custom-m')) {
        customMessage = message.content.replace('!custom-m', '').trim();
        config.customMessage = customMessage;
        message.channel.send(`Custom message set to: "${customMessage}"`);

        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);
    }

    else if (message.content === '!usage') {
        try {
            const cpuLoad = await si.currentLoad();
            const memory = await si.mem();
            const cpuPercent = cpuLoad.avgLoad.toFixed(2);
            const ramPercent = ((memory.active / memory.total) * 100).toFixed(2);

            const usageEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('System Metrics')
                .setDescription(`📊 **System Metrics**\nCPU Usage: ${cpuPercent}%\nRAM Usage: ${ramPercent}%`)
                .setFooter({ text: 'Use /command to call commands like !metrics-c or get help.' });

            await message.channel.send({ embeds: [usageEmbed] });
        } catch (error) {
            console.error('Error fetching system information:', error);
            message.channel.send('⚠️ Unable to retrieve system information at this time.');
        }
    }

    else if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Bot Commands')
            .setDescription('Here is a list of all available commands:')
            .addFields(
                { name: '> !custom-m', value: '``Set a custom message for the bot to send in specific channels.``' },
                { name: '> !usage', value: '``Displays the current system metrics (CPU and RAM usage).``' },
                { name: '> !status-channel-set', value: '``Set the channel ID where system metrics are sent.``' },
                { name: '> !status-channel-remove', value: '``Remove the channel ID where system metrics are sent.``' },
                { name: '> !wlc-add', value: '``Add a channel to the whitelist for custom messages.``' },
                { name: '> !wlc-remove', value: '``Remove a channel from the whitelist.``' },
                { name: '> !help', value: '``Shows a list of all available commands.``' }
            )
            .setFooter({ text: 'Made By 9R3A ' });

        message.channel.send({ embeds: [helpEmbed] });
    }

    else if (message.content.startsWith('!status-channel-set')) {
        const channelId = message.content.split(' ')[1];
        if (channelId) {
            config.metricsChannelId = channelId;
            message.channel.send(`Metrics will now be sent to channel ID: ${config.metricsChannelId}`);

            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);
        } else {
            message.channel.send('Please provide a valid channel ID.');
        }
    }

    else if (message.content.startsWith('!status-channel-remove')) {
        config.metricsChannelId = '';
        message.channel.send('Metrics channel has been removed.');

        fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);
    }

    else if (message.content.startsWith('!wlc-add')) {
        const channelId = message.content.split(' ')[1];
        if (channelId) {
            config.whitelistChannelIds = config.whitelistChannelIds || [];
            if (!config.whitelistChannelIds.includes(channelId)) {
                config.whitelistChannelIds.push(channelId);
                message.channel.send(`Channel ${channelId} has been added to the whitelist.`);
            } else {
                message.channel.send(`Channel ${channelId} is already in the whitelist.`);
            }
            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);
        } else {
            message.channel.send('Please provide a valid channel ID.');
        }
    }

    else if (message.content.startsWith('!wlc-remove')) {
        const channelId = message.content.split(' ')[1];
        if (config.whitelistChannelIds && config.whitelistChannelIds.includes(channelId)) {
            config.whitelistChannelIds = config.whitelistChannelIds.filter(id => id !== channelId);
            message.channel.send(`Channel ${channelId} has been removed from the whitelist.`);
            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);
        } else {
            message.channel.send(`Channel ${channelId} is not in the whitelist.`);
        }
    }

    else if (config.customMessage && config.whitelistChannelIds && config.whitelistChannelIds.includes(message.channel.id)) {
        message.channel.send(config.customMessage);
    }
});

client.login(process.env.DISCORD_TOKEN);
