import {Client, ColorResolvable, Intents, MessageEmbed, TextChannel} from 'discord.js';
import fs from 'fs'
import './app'
import BotConfig from './configurations/bot.json';
import {SPWorlds} from "spworlds";
import CardsConfig from "./configurations/cards.json";
import ChannelsConfig from "./configurations/channels.json";
import TemplatesConfig from "./configurations/templates.json";
import AppearanceConfig from "./configurations/appearance.json";

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});


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
    client.on('interactionCreate', async (interaction) => {
        route.execute(client, interaction)
    })
}

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

setInterval(async () => {
    await CheckSPWorldsAvaliability()
}, 600000)

export async function CheckSPWorldsAvaliability() {
    console.log("Проверка работы SPWorlds")
    await ( client.channels.cache.get(ChannelsConfig.IMARKET_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.MENUS.MARKET_MENU).then((message) => {
        for (let x = 0; x < message.components[0].components.length; x++) {
            message.components[0].components[x].setDisabled(false)
            message.embeds[0].setColor(AppearanceConfig.Colors.Default as ColorResolvable)
        }
        message.edit({ embeds: [message.embeds[0]], components: message.components })
    })
    await sp.findUser("332149563831877632")
        .catch(async () => {
            await ( client.channels.cache.get(ChannelsConfig.IMARKET_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.MENUS.MARKET_MENU).then((message) => {
                for (let x = 0; x < message.components[0].components.length; x++) {
                    message.components[0].components[x].setDisabled(true)
                    message.embeds[0].setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                }
                const errorEmbed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
                    .setTitle("К сожалению, iMarket временно недоступен из-за ошибок на серверах SPWorlds.")
                    .setFooter("С глубочайшими извинениями, команда ГТК", AppearanceConfig.Images.MainLogo)
                message.embeds = [message.embeds[0]]
                message.embeds.push(errorEmbed)
                message.embeds[0].setColor(AppearanceConfig.Colors.Error as ColorResolvable)
                message.edit({ embeds: message.embeds, components: message.components })
            })
            console.log("Ошибка в работе SPWorlds")
        })
}