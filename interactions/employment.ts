import Discord, {
    ColorResolvable,
    MessageEmbed,
    TextInputComponent,
    MessageActionRow,
    Modal, TextChannel
} from "discord.js";
import { SPWorlds } from "spworlds";
import CardsConfig from '../configurations/cards.json';
import AppearanceConfig from '../configurations/appearance.json'
import ChannelsConfig from '../configurations/channels.json'
import mcdata from "mcdata";

enum Vacancies {
    delivery = "Сотрудник отдела доставки",
    production = "Сотрудник отдела производства",
    finance = "Сотрудник финансового отдела",
    manager = "Менеджер персонала",
    lawyer = "Юрист"
}

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

export = {
    async execute (client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        const username = await sp.findUser(interaction.user.id);
        const minecraftUser = await mcdata.playerStatus(username, { renderSize: 2 })

        // Выбор вакансии TODO: Подгружать доступные и недоступные вакансии из БД
        if (interaction.isSelectMenu()) {
            if (interaction.customId === 'apply_job') {
                const vacancy = interaction.values[0]
                const modal = new Modal()
                    .setCustomId(`apply_job_${vacancy}`)
                    .setTitle('Заявка на трудоустройство')

                const about = new TextInputComponent()
                    .setCustomId('about')
                    .setLabel("Расскажите о себе")
                    .setPlaceholder("Возраст, часовой пояс, опыт и.т.д.")
                    .setStyle('PARAGRAPH')
                    .setRequired(true)

                const timeperday = new TextInputComponent()
                    .setCustomId('timeperday')
                    .setLabel("Сколько вы готовы работать в день")
                    .setStyle('SHORT')
                    .setRequired(true)

                const income = new TextInputComponent()
                    .setCustomId('income')
                    .setLabel("Желаемая з/п")
                    .setStyle('SHORT')
                    .setRequired(true)

                const firstActionRow = new MessageActionRow().addComponents(about);
                const secondActionRow = new MessageActionRow().addComponents(timeperday);
                const thirdActionRow = new MessageActionRow().addComponents(income);
                modal.setComponents(firstActionRow as any, secondActionRow as any, thirdActionRow as any);
                await interaction.showModal(modal);
            }
        }

        // Отправка вакансии в канал, а также уведомление пользователю об отправке
        if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith('apply_job_')) {
                const vacancy = Vacancies[interaction.customId.slice(interaction.customId.indexOf('apply_job_')+10) as keyof typeof Vacancies]
                const about = interaction.fields.getTextInputValue('about')
                const timeperday = interaction.fields.getTextInputValue('timeperday')
                const income = interaction.fields.getTextInputValue('income')
                const notifyEmbed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Success as ColorResolvable)
                    .setTitle(`Заявка отправлена`)
                    .setThumbnail(minecraftUser.skin.avatar)
                    .setDescription("Заявление будет рассмотрено в течении суток.\nВам напишут в личные сообщения с результатом.")
                    .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
                await interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });


                const requestEmbed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setTitle(`Заявка на трудоустройство от ${username}`)
                    .setThumbnail(minecraftUser.skin.avatar)
                    .setTimestamp()
                    .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
                    .setFields(
                        { name: 'Никнейм', value: "```" + username + "```" },
                        { name: 'Вакансия', value: "```" + vacancy + "```" },
                        { name: 'О себе', value: "```" + about + "```" },
                        { name: 'Готов уделять работе', value: "```" + timeperday + "```" },
                        { name: 'Желаемая з/п', value: "```" + income + "```" },
                        { name: 'Discord', value: `<@${interaction.user.id}>` },
                    )

                await ( client.channels.cache.get(ChannelsConfig.EMPLOYMENT_APPLICATIONS_CHANNEL) as TextChannel).send({ content: "<@&990687295667568720>", embeds: [requestEmbed] });
            }
        }

    }
}
