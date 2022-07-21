import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    ColorResolvable,
    Client,
    TextChannel
} from "discord.js";
import AppearanceConfig from '../../configurations/appearance.json'
import ChannelsConfig from '../../configurations/channels.json'
import TemplatesConfig from '../../configurations/templates.json'
import CardsConfig from '../../configurations/cards.json'
import crypto from 'crypto'
import {client} from "../../index";
import {SPWorlds} from "spworlds";
const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

setInterval(async () => {
    await ( client.channels.cache.get(ChannelsConfig.IMARKET_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.MENUS.MARKET_MENU).then((message) => {
        for (let x = 0; x < message.components[0].components.length; x++) {
            message.components[0].components[x].setDisabled(false)
        }
        message.edit({ embeds: [message.embeds[0]], components: message.components })
    })
    await sp.findUser("332149563831877632")
        .catch(async () => {
            await ( client.channels.cache.get(ChannelsConfig.IMARKET_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.MENUS.MARKET_MENU).then((message) => {
                for (let x = 0; x < message.components[0].components.length; x++) {
                    message.components[0].components[x].setDisabled(true)
                }
                const errorEmbed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
                    .setTitle("К сожалению, iMarket временно недоступен из-за ошибки на серверах SPWorlds.")
                    .setFooter("С глубочайшими извинениями, команда ГТК", AppearanceConfig.Images.MainLogo)
                message.embeds.push()
                message.edit({ embeds: message.embeds, components: message.components })
            })
            console.log("Ошибка в работе SPWorlds")
        })
}, 600000)

export async function UpdateMessages (client: Client) {
    const rowBankMenu = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('lk')
                .setLabel('👨‍💼 Войти в Личный кабинет')
                .setStyle('PRIMARY'),
        );

    const embedBankMenu = new MessageEmbed()
        .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
        .setTitle(AppearanceConfig.Tags.Bank)
        .setImage(AppearanceConfig.Images.Bank[crypto.randomInt(0, AppearanceConfig.Images.Bank.length)])
        .setFooter("© Все права защищены.", AppearanceConfig.Images.MainLogo)
        .setDescription('**Первый частный банк на СП!**');

    // TODO: Добавить шаблон сообщения для личного кабинета
    // ( client.channels.cache.get(ChannelsConfig.BANK_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.MENUS.BANK_MENU).then((message) => {
    //     message.edit({ embeds: [embedBankMenu], components: [rowBankMenu] })
    // })

    // Меню маркета
    const rowMarketMenu = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('cart')
                .setLabel('🛒 Создать заказ')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('lk')
                .setLabel('👨‍💼 Войти в Личный кабинет')
                .setStyle('SUCCESS'),
        );

    const embedMarketMenu = new MessageEmbed()
        .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
        .setTitle(AppearanceConfig.Tags.iMarket)
        .setImage(AppearanceConfig.Images.iMarket[crypto.randomInt(0, AppearanceConfig.Images.iMarket.length)])
        .setFooter("© Все права защищены.", AppearanceConfig.Images.MainLogo)

    await ( client.channels.cache.get(ChannelsConfig.BOT_MESSAGES_TEMPLATES_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.TEMPLATES.MARKET_TEMPLATE).then((message) => {
        embedMarketMenu.setDescription(message.content);
    })
    await ( client.channels.cache.get(ChannelsConfig.IMARKET_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.MENUS.MARKET_MENU).then((message) => {
        message.edit({ embeds: [embedMarketMenu], components: [rowMarketMenu] })
    })

    // Трудоустройство
    const rowJobMenu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
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
                    // {
                    //     emoji: '993118590934986774',
                    //     label: 'Сотрудник отдела финансов',
                    //     description: 'Работа в ГлорианБанке',
                    //     value: 'finance',
                    // },
                    // {
                    // 	emoji: '993119853210775662',
                    // 	label: 'Менеджер персонала',
                    // 	description: 'Контроль сотрудников',
                    // 	value: 'manager',
                    // },
                    // {
                    // 	emoji: '993118584538665000',
                    // 	label: 'Юрист/Адвокат',
                    // 	description: 'Контроль документации, суды',
                    // 	value: 'lawyer',
                    // },
                ])
        )

    const embedJobMenu = new MessageEmbed()
        .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
        .setTitle('Трудоустройство в Глорианскую Торговую Компанию')
        .setImage(AppearanceConfig.Images.Employment)
        .setFooter("© Все права защищены.", AppearanceConfig.Images.MainLogo)

    await ( client.channels.cache.get(ChannelsConfig.BOT_MESSAGES_TEMPLATES_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.TEMPLATES.EMPLOYMENT_TEMPLATE).then((message) => {
        embedJobMenu.setDescription(message.content);
    })
    await ( client.channels.cache.get(ChannelsConfig.EMPLOYMENT_REQUESTS_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.MENUS.EMPLOYMENT_MENU).then((message) => {
        message.edit({ embeds: [embedJobMenu], components: [rowJobMenu] })
    })

    const embedSupport = new MessageEmbed()
        .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
        .setTitle("Служба поддержки")
        .setDescription("**Для обращения в поддержку, напишите свою проблему или вопрос в этот канал**")
        .setImage(AppearanceConfig.Images.Banner)
        .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)

    await ( client.channels.cache.get(ChannelsConfig.SUPPORT_CHANNEL) as TextChannel ).messages.fetch(TemplatesConfig.MENUS.SUPPORT_MENU).then((message) => {
        message.edit({ embeds: [embedSupport] })
    })
}