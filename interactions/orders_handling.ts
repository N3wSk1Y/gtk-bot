import Discord, {
    MessageEmbed,
    MessageActionRow,
    MessageButton, ColorResolvable
} from "discord.js";
import AppearanceConfig from '../configurations/appearance.json'

export = {
    async execute(client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        if (interaction.isButton()) {
            if (interaction.customId === 'accept_order') {
                const orderAuthor = await client.users.fetch(interaction.message.embeds[0].fields[3].value.replace('**`', '').replace('`**', ''))
                interaction.message.embeds[0].color = AppearanceConfig.Colors.Warning as any
                (interaction.message.embeds[0] as MessageEmbed).addFields(
                    { name: "**Курьер**:", value: `<@${interaction.user.id}>` },
                )

                const embed = new MessageEmbed()
                    .setTitle("Ваш заказ в обработке")
                    .addField("**Курьер:**", `<@${interaction.user.id}>`)
                    .setColor(AppearanceConfig.Colors.Warning as ColorResolvable)
                    .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('finish_order')
                            .setLabel('Завершить заказ')
                            .setStyle('SUCCESS'),
                    )

                await orderAuthor.send({ embeds: [embed] })
                await interaction.update({ content: `<@${interaction.user.id}>`, embeds: interaction.message.embeds, components: [row] })
            }

            if (interaction.customId === 'finish_order') {
                const deliverId = interaction.message.embeds[0].fields[4].value.replace('<@', '').replace('>', '')
                if (interaction.user.id !== deliverId) {
                    const embed = new MessageEmbed()
                        .setTitle("Ошибка")
                        .setDescription(`Данный заказ уже в обработке курьером <@${deliverId}>`)
                        .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
                        .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)
                    await interaction.reply({ ephemeral: true, embeds: [embed]})
                    return;
                }

                const orderAuthor = await client.users.fetch(interaction.message.embeds[0].fields[3].value.replace('**`', '').replace('`**', ''))
                interaction.message.embeds[0].color = AppearanceConfig.Colors.Success as any

                const embed = new MessageEmbed()
                    .setTitle("Ваш заказ выполнен!")
                    .setDescription("Надеемся, вам все понравилось. Вы можете оставить свое пожелание или отзыв о нашем сервисе 😊")
                    .addField("**Вас обслуживал курьер:**", `<@${interaction.user.id}>`)
                    .setColor(AppearanceConfig.Colors.Success as ColorResolvable)
                    .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('Оставить отзыв')
                            .setURL('https://discord.com/channels/990684607861116959/992504305527570442')
                            .setStyle('LINK'),
                    )

                await orderAuthor.send({ embeds: [embed], components: [row] })
                await interaction.update({ content: null, embeds: interaction.message.embeds, components: [] })
            }
        }
    }
}