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
import mcdata from "mcdata";

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

// TODO: СДЕЛАТЬ ИМПОРТ КАТЕГОРИЙ И ТОВАРОВ ИЗ БД
const cathegories = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select_category')
            .setPlaceholder('Выберите категорию')
            .addOptions([
                {
                    emoji: '992185372618526780',
                    label: 'Инструменты и оружие',
                    description: 'Кирки, мечи, лопаты и топоры',
                    value: 'instruments',
                },
                {
                    emoji: '993118490829533224',
                    label: 'Броня',
                    description: 'Топочка и не только',
                    value: 'armor',
                },
                {
                    emoji: '992339167063310347',
                    label: 'Зачарования',
                    description: 'Шелк, удача и даже починка',
                    value: 'enchanted_books',
                },
                {
                    emoji: '993243381801160835',
                    label: 'Строительные блоки',
                    description: 'Из этого можно построить Дестен',
                    value: 'building_blocks',
                },
                {
                    emoji: '993118524912435230',
                    label: 'Еда',
                    description: 'Золотая морковка и не только',
                    value: 'food',
                },
                {
                    emoji: '993123409351409725',
                    label: 'Прочее',
                    description: 'Всякая мелочовка',
                    value: 'other',
                },
            ]),
    );

export = {
    async execute(client: Discord.Client, interaction: Discord.Interaction): Promise<void> {

        if (interaction.isModalSubmit()) {
            // Принятие отправленного заказа (после отправки формы с адресом)
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
                interaction.message.embeds[0].color = AppearanceConfig.Colors.Warning as any
                (interaction.message.embeds[0] as MessageEmbed).addFields(
                    { name: "**Адрес**:", value: `**\`${address}\`**` },
                    { name: "**Статус заказа:**", value: "**`ВЫПОЛНЯЕТСЯ`**" },
                    { name: "**Покупатель:**", value: `**<@${interaction.user.id}>**` },
                )
                await interaction.update({ embeds: interaction.message.embeds, components: [] })
                const privateMessage = await interaction.user.send({embeds: interaction.message.embeds});

                (interaction.message.embeds[0] as MessageEmbed).addField("**Номер клиента:**", `**\`${interaction.user.id}\`**`)
                await (client.channels.cache.get(ChannelsConfig.NEW_ORDERS_CHANNEL) as TextChannel).send({ embeds: interaction.message.embeds, components: [row as any]});
            }
        }

        if (interaction.isSelectMenu()) {
            // Обработка категории
            if (interaction.customId === 'select_category') {
                const row = new MessageActionRow()
                interaction.message.components = [interaction.message.components[0] as any]
                // TODO: Добавить автоподгрузку товаров из БД, а также обработчик категорий и товаров
                switch (interaction.values[0]) {
                    case 'instruments':
                        row.addComponents(
                            new MessageButton()
                                .setCustomId('product_diamond_pickaxe_silk')
                                .setLabel('Алмазная кирка (шелк) - 10 АР')
                                .setEmoji('992185372618526780')
                                .setStyle('SECONDARY'),
                        )
                        interaction.message.components.splice(1, 0, row)
                        break;

                    case 'enchanted_books':
                        row.addComponents(
                            new MessageButton()
                                .setCustomId('product_mending')
                                .setLabel('Починка - 50 АР')
                                .setEmoji('992339167063310347')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('product_silk_touch')
                                .setLabel('Шелковое касание - 15 АР')
                                .setEmoji('992339167063310347')
                                .setStyle('SECONDARY'),
                        )
                        interaction.message.components.splice(1, 0, row)
                        break;
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
                const embed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setTitle(`Корзина ${username}`)
                    .setDescription('**Список товаров:**\n')
                    .setThumbnail(minecraftUser.skin.avatar)
                    .addField("**Сумма:**", `${0} <:diamond_ore:990969911671136336>`)
                    .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.MainLogo)
                await interaction.reply({ephemeral: true, embeds: [embed], components: [cathegories]});
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

                // @ts-ignore
                await interaction.update({ ephemeral: true, embeds: interaction.message.embeds, components: interaction.message.components as any });
            }

            // Обработка обнуления заказа
            if (interaction.customId === 'reset') {
                interaction.message.components = [interaction.message.components[0] as any]
                interaction.message.embeds[0].description = "**Список товаров:**\n"
                interaction.message.embeds[0].fields[0].value = "0 <:diamond_ore:990969911671136336>"

                // @ts-ignore
                await interaction.update({ ephemeral: true, embeds: interaction.message.embeds, components: interaction.message.components as any });
            }

            // Обработка принятие заказа (показ формы с адресом)
            if (interaction.customId === 'submit') {
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
                await interaction.showModal(modal);
            }
        }
    }
}