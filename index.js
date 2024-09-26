require("dotenv/config");

// Importing necessary dependencies
const { Client, Partials, ActivityType, GatewayIntentBits } = require("discord.js");
const express = require("express");
const path = require("path");
const axios = require("axios");

// Configuring page for monitor
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'alive.html'));
});

const port = process.env.PORT || 5003;

app.listen(port, () => {
    console.log("Monitor server is alive!");
});

// Configuring bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User
    ]
});

// Creating a function to replace text and adding it to the String prototype
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

// Listening on client events
client.once('ready', () => {
    client.user.setStatus("idle");
    client.user.setActivity({
        name: 'Anime WAYS',
        type: ActivityType.Watching,
        url: 'https://youtu.be/omUlBf1zJHg?si=9O6G0Ms9izHNUq_z'
    });
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.channel.id !== '1288920882864979999') return;
    const user_message = message.content;
    message.channel.sendTyping().then(() => {
        axios.get(`https://api.popcat.xyz/chatbot?msg=${user_message}&owner=Anime+WAYS&botname=Saitama`).then(response => {
            message.reply(response.data.response).then(() => {
                return;
            }).catch(err => console.log(err));
        }).catch(err => {
            message.reply(err);
        }); 
    }).catch(err => {
        console.log(err);
    });
});

// Launching the bot
client.login(process.env.TOKEN);