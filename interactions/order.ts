import Discord, {
    ColorResolvable,
    MessageEmbed,
    TextInputComponent,
    MessageActionRow,
    Modal, TextChannel, MessageSelectMenu, MessageButton, Interaction
} from "discord.js";
import { SPWorlds } from "spworlds";
import CardsConfig from '../configurations/cards.json';
import AppearanceConfig from '../configurations/appearance.json'
import ChannelsConfig from '../configurations/channels.json'
import mcdata from "mcdata"
import { DBRequest } from "../database";
import crypto from "crypto";
import {getBalance, OperationTypes, postTransferHistory, transferBalance} from '../bank_handling'

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

// TODO: Сделать выбор способа оплаты и бесплатную доставку от 32 АР

export = {
    async execute(client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        const username = await sp.findUser(interaction.user.id);
        const minecraftUser = await mcdata.playerStatus(username, { renderSize: 2 })

        if (interaction.isModalSubmit()) {
            // Принятие заказа из ГлорианБанка
            if (interaction.customId === 'submit_modal') {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('accept_order')
                            .setLabel('Принять заказ')
                            .setStyle('PRIMARY'),
                    )

                const address = interaction.fields.getTextInputValue('submit_address')
                interaction.message.embeds[0].title = interaction.message.embeds[0].title.replace("Корзина", "Заказ")
                interaction.message.embeds[0].color = AppearanceConfig.Colors.Default as any
                interaction.message.embeds = [interaction.message.embeds[0] as MessageEmbed] as MessageEmbed[]
                (interaction.message.embeds[0] as MessageEmbed).addFields(
                    { name: "**Адрес**:", value: `**\`${address}\`**` },
                    { name: "**Покупатель:**", value: `**<@${interaction.user.id}>**` },
                )
                // Отправка уведомления о заказе в канал
                await interaction.update({ embeds: interaction.message.embeds, components: [] })

                // Отправка уведомления о заказе в ЛС пользователю
                const privateMessage = await interaction.user.send({embeds: interaction.message.embeds});

                (interaction.message.embeds[0] as MessageEmbed).addFields(
                    { name: "**ID покупателя:**", value: `**\`${interaction.user.id}\`**` }
                )

                // Отправка уведомления о заказе в канал #заказы
                await (client.channels.cache.get(ChannelsConfig.NEW_ORDERS_CHANNEL) as TextChannel).send({ content: `<@&992410294167011359>`,embeds: interaction.message.embeds, components: [row as any]});
            }
        }

        if (interaction.isSelectMenu()) {
            // Обработка категории
            if (interaction.customId === 'select_category') {
                interaction.message.components = [interaction.message.components[0] as any]
                const products = await DBRequest(`SELECT * FROM \`products\` WHERE \`category_name\` = '${interaction.values[0]}'`) as any[]
                const lines = Math.ceil(products.length / 5)
                for (let x = 0; x < lines; x++) {
                    const row = new MessageActionRow()
                    for (const product of products) {
                        row.addComponents(
                            new MessageButton()
                                .setCustomId(`product_${product.id}`)
                                .setLabel(`${product.name} - ${product.price} АР`)
                                .setEmoji(product.emoji_id)
                                .setStyle('SECONDARY')
                                .setDisabled(product.enabled !== 1),
                        )
                        products.shift()
                    }
                    interaction.message.components.splice(1, 0, row)
                }

                const total = parseInt(interaction.message.embeds[0].fields[0].value.slice(0, interaction.message.embeds[0].fields[0].value.indexOf("<")-1))
                if(total !== 0) {
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('submit')
                                .setLabel('Оплатить заказ')
                                .setEmoji('990969911671136336')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('installment')
                                .setLabel('Купить в рассрочку')
                                .setEmoji('990969911671136336')
                                .setDisabled(true)
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('reset')
                                .setLabel('Сбросить')
                                .setStyle('DANGER'),
                        )
                    interaction.message.components.push(row as any)
                }
                await interaction.update({ components: interaction.message.components as any });
            }
        }

        if (interaction.isButton()) {
            // Вызов корзины
            if (interaction.customId === 'cart') {
                const username = await sp.findUser(interaction.user.id);
                const minecraftUser = await mcdata.playerStatus(username, {renderSize: 2})
                const categories = await DBRequest("SELECT * FROM `categories`") as any[]
                const options = () => {
                    const optionsArray = []
                    for (let x = 0; x < categories.length; x++) {
                        optionsArray.push({
                            emoji: categories[x].emoji_id,
                            label: categories[x].name,
                            description: categories[x].description,
                            value: categories[x].id,
                        })
                    }
                    return optionsArray;
                }

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('select_category')
                            .setPlaceholder('Выберите категорию')
                            .addOptions(options() as any),
                    );

                const embed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setTitle(`Корзина ${username}`)
                    .setDescription('**Список товаров:**\n')
                    .setThumbnail(minecraftUser.skin.avatar)
                    .addField("**Сумма:**", `${0} <:diamond_ore:990969911671136336>`)
                    .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)
                await interaction.reply({ephemeral: true, embeds: [embed], components: [row]});
            }

            // Выбор определенного продукта
            if (interaction.customId.startsWith('product_')) {
                const item = interaction.component.label
                let total = parseInt(interaction.message.embeds[0].fields[0].value.slice(0, interaction.message.embeds[0].fields[0].value.indexOf("<")-1))
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('submit')
                            .setLabel('Оплатить заказ')
                            .setEmoji('990969911671136336')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('installment')
                            .setLabel('Купить в рассрочку')
                            .setEmoji('990969911671136336')
                            .setDisabled(true)
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('reset')
                            .setLabel('Сбросить')
                            .setStyle('DANGER'),
                    )
                if (total === 0)
                    {
                        // @ts-ignore
                        interaction.message.components.push(row)
                    }

                interaction.message.embeds[0].description += `\n<:${interaction.component.emoji.name}:${interaction.component.emoji.id}> ${item.replace("АР", "<:diamond_ore:990969911671136336>")}`
                total += parseInt(item.slice(item.indexOf(" - ")+3, item.indexOf(" АР") ))
                interaction.message.embeds[0].fields[0].value = `${total} <:diamond_ore:990969911671136336>`

                await interaction.update({ embeds: interaction.message.embeds, components: interaction.message.components as any });
            }

            // Обработка обнуления заказа
            if (interaction.customId === 'reset') {
                interaction.message.components = [interaction.message.components[0] as any]
                interaction.message.embeds[0].description = "**Список товаров:**\n"
                interaction.message.embeds[0].fields[0].value = "0 <:diamond_ore:990969911671136336>"

                await interaction.update({ embeds: interaction.message.embeds, components: interaction.message.components as any });
            }

            // Обработка оплаты заказа
            if (interaction.customId === 'submit') {
                const embed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setTitle(`Выберите способ оплаты`)
                    .setDescription('**Оплачивая товары с помощью счета в ГлорианБанке, вы получите кешбек в размере 20%, а также бесплатную доставку от 32 АР :star_struck:**')

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('submit_bank')
                            .setLabel('Оплатить через ГлорианБанк (-10%)')
                            .setEmoji('990969911671136336')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('submit_spworlds')
                            .setLabel('Оплатить через SPWorlds')
                            .setEmoji('990969911671136336')
                            .setStyle('PRIMARY')
                            .setDisabled(true),
                    )
                interaction.message.embeds.push(embed as any)
                await interaction.update({ embeds: interaction.message.embeds, components: [row] });
            }

            // Оплата через ГлорианБанк
            if (interaction.customId === 'submit_bank') {
                const count = await DBRequest(`SELECT count(id) as count FROM users WHERE uuid='${minecraftUser.uuid}'`)
                const users = await DBRequest(`SELECT * FROM users WHERE uuid = '${minecraftUser.uuid}'`)
                // @ts-ignore
                const total = parseInt(interaction.message.embeds[0].fields[0].value.slice(0, interaction.message.embeds[0].fields[0].value.indexOf("<")-1))

                // Проверка на наличие аккаунта
                if((count as any[])[0].count === 0) {
                    const embed = new MessageEmbed()
                        .setColor(AppearanceConfig.Colors.HighWarning as ColorResolvable)
                        .setTitle(`Зарегистрируйте аккаунт в ГлорианБанке`)
                        .setDescription('**Создайте свой счет за 7 секунд, перейдя по кнопке снизу :money_with_wings:**')
                        .setImage(AppearanceConfig.Images.Bank[crypto.randomInt(0, AppearanceConfig.Images.Bank.length)])
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel('Создать счет за 7 секунд')
                                .setStyle('LINK')
                                .setURL("https://discord.com/channels/990684607861116959/990684804716580985/991355633603452999"),
                            new MessageButton()
                                .setCustomId("submit_bank")
                                .setLabel('У меня уже есть счет')
                                .setStyle('SUCCESS')
                        )
                    interaction.message.embeds[0].color = AppearanceConfig.Colors.HighWarning as any
                    interaction.message.embeds[1] = embed
                    await interaction.update({ embeds: interaction.message.embeds, components: [row] });
                    return;
                }

                // Проверка на баланс
                // @ts-ignore
                const balance = await getBalance(users[0].id as number)
                if(balance - total < 0) {
                    const embed = new MessageEmbed()
                        .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
                        .setTitle(`Недостаточно средств`)
                        .setDescription('**К сожалению, на вашем счету недостаточно средств для совершения операции.**')
                        .addField("Текущий баланс:", `\`${balance}\` <:diamond_ore:990969911671136336>`)
                        .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel('Пополнить счет')
                                .setStyle('LINK')
                                .setURL("https://discord.com/channels/990684607861116959/990684804716580985/991355633603452999"),
                            new MessageButton()
                                .setCustomId("submit_bank")
                                .setLabel('Счет уже пополнен')
                                .setStyle('SUCCESS')
                        )
                    interaction.message.embeds[0].color = AppearanceConfig.Colors.Error as any
                    interaction.message.embeds[1] = embed
                    await interaction.update({ embeds: interaction.message.embeds, components: [row] });
                    return;
                }

                const modal = new Modal()
                    .setCustomId('submit_modal')
                    .setTitle('Оформление заказа')

                const value = new TextInputComponent()
                    .setCustomId('submit_address')
                    .setLabel("Введите адрес доставки")
                    .setStyle('PARAGRAPH')
                    .setRequired(true)

                const firstActionRow = new MessageActionRow().addComponents(value);
                modal.addComponents(firstActionRow as any);
                await interaction.showModal(modal)
                // @ts-ignore
                await transferBalance(users[0].id as number, total, OperationTypes.iMarket, `Покупка товаров в iMarket`)
            }
        }
    }
}