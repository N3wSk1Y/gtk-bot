import express from 'express';
import request from 'request';
import { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent } from 'discord.js';
import { SPWorlds } from "spworlds";
import mcdata from "mcdata";
import fs from 'fs'

import BotConfig from './configurations/bot_configuration.json';
import CardsConfig from './configurations/cards_configuration.json';
import DataBaseConfig from './configurations/database_configuration.json';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS
    ]});
const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);
const botEvents = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))

client.login(BotConfig.BOT_TOKEN)
    .catch((error) => {
        console.error("Ошибка при авторизации бота:\n" + error);
    })

// Инициализация всех событий бота
for (const file of botEvents) {
    const event = require(`./events/${file}`)
    if (event.once)
        client.once(event.name, async (...args) => event.execute(client, ...args))
    else
        client.on(event.name, async (...args) => event.execute(client, ...args))
}