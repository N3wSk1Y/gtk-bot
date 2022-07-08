"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMessages = void 0;
const discord_js_1 = require("discord.js");
const appearance_json_1 = __importDefault(require("../../configurations/appearance.json"));
const channels_json_1 = __importDefault(require("../../configurations/channels.json"));
const templates_json_1 = __importDefault(require("../../configurations/templates.json"));
function UpdateMessages(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const rowBankMenu = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('lk')
            .setLabel('👨‍💼 Войти в Личный кабинет')
            .setStyle('PRIMARY'));
        const embedBankMenu = new discord_js_1.MessageEmbed()
            .setColor(appearance_json_1.default.Colors.Default)
            .setTitle(appearance_json_1.default.Tags.Bank)
            .setFooter("© Все права защищены.", appearance_json_1.default.MainLogo)
            .setDescription('**Первый частный банк на СП!**');
        // TODO: Добавить шаблон сообщения для личного кабинета
        client.channels.cache.get(channels_json_1.default.BANK_CHANNEL).messages.fetch(templates_json_1.default.MENUS.BANK_MENU).then((message) => {
            message.edit({ embeds: [embedBankMenu], components: [rowBankMenu] });
        });
        // Меню маркета
        const rowMarketMenu = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('cart')
            .setLabel('🛒 Создать заказ')
            .setStyle('PRIMARY'));
        const embedMarketMenu = new discord_js_1.MessageEmbed()
            .setColor(appearance_json_1.default.Colors.Default)
            .setTitle(appearance_json_1.default.Tags.iMarket)
            .setFooter("© Все права защищены.", appearance_json_1.default.MainLogo);
        yield client.channels.cache.get(channels_json_1.default.BOT_MESSAGES_TEMPLATES_CHANNEL).messages.fetch(templates_json_1.default.TEMPLATES.MARKET_TEMPLATE).then((message) => {
            embedMarketMenu.setDescription(message.content);
        });
        yield client.channels.cache.get(channels_json_1.default.IMARKET_CHANNEL).messages.fetch(templates_json_1.default.MENUS.MARKET_MENU).then((message) => {
            message.edit({ embeds: [embedMarketMenu], components: [rowMarketMenu] });
        });
        // Трудоустройство
        const rowJobMenu = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageSelectMenu()
            .setCustomId('apply_job')
            .setPlaceholder('Выберите вакансию')
            .addOptions([
            {
                emoji: '993120126838779914',
                label: 'Сотрудник отдела доставки',
                description: 'Выполнение заказов iMarket',
                value: 'delivery',
            },
            {
                emoji: '993118818421456966',
                label: 'Сотрудник отдела производства',
                description: 'Создание предметов для iMarket',
                value: 'production',
            },
            {
                emoji: '993118590934986774',
                label: 'Сотрудник отдела финансов',
                description: 'Работа в ГлорианБанке',
                value: 'finance',
            },
            {
                emoji: '993119853210775662',
                label: 'Менеджер персонала',
                description: 'Контроль сотрудников',
                value: 'manager',
            },
            {
                emoji: '993118584538665000',
                label: 'Юрист/Адвокат',
                description: 'Контроль документации, суды',
                value: 'lawyer',
            },
        ]));
        const embedJobMenu = new discord_js_1.MessageEmbed()
            .setColor(appearance_json_1.default.Colors.Default)
            .setTitle('Трудоустройство в Глорианскую Торговую Компанию 💼')
            .setFooter("© Все права защищены.", appearance_json_1.default.MainLogo);
        yield client.channels.cache.get(channels_json_1.default.BOT_MESSAGES_TEMPLATES_CHANNEL).messages.fetch(templates_json_1.default.TEMPLATES.EMPLOYMENT_TEMPLATE).then((message) => {
            embedJobMenu.setDescription(message.content);
        });
        yield client.channels.cache.get(channels_json_1.default.EMPLOYMENT_REQUESTS_CHANNEL).messages.fetch(templates_json_1.default.MENUS.EMPLOYMENT_MENU).then((message) => {
            message.edit({ embeds: [embedJobMenu], components: [rowJobMenu] });
        });
    });
}
exports.UpdateMessages = UpdateMessages;
