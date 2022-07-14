import { Client, Intents } from 'discord.js';
import fs from 'fs'
import './app'
import BotConfig from './configurations/bot.json';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

// TODO: Пройтись по всем варнингам во всех файлах
// TODO: Добавить историю пополнения и снятие денег
// TODO: Добавить кнопку назад в историю пополнений (есть код в withdraw_modal)

const botEvents = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))
const botRoutes = fs.readdirSync('./interactions/').filter(f => f.endsWith('.js'))

client.login(BotConfig.BOT_TOKEN)
    .catch((error) => {
        console.error("Ошибка при авторизации бота:\n" + error);
    })

// Инициализация events
for (const file of botEvents) {
    const event = require(`./events/${file}`)
    if (event.once)
        client.once(event.name, async (...args) => event.execute(client, ...args))
    else
        client.on(event.name, async (...args) => event.execute(client, ...args))
}

// Инициализация interactions
for (const file of botRoutes) {
    const route = require(`./interactions/${file}`)
    client.on('interactionCreate', async (...args) => route.execute(client, ...args))
}