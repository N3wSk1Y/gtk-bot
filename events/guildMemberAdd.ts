import Discord, {ColorResolvable, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import { SPWorlds } from "spworlds";
import CardsConfig from '../configurations/cards.json';
import AppearanceConfig from '../configurations/appearance.json'
import mcdata from "mcdata";

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

export = {
    name: 'guildMemberAdd',
    once: false,
    async execute (client: Discord.Client, member: Discord.GuildMember): Promise<void> {
        if (member.user.bot) return;

        const username = await sp.findUser(member.id);
        if (username === null) {
            const embed = new MessageEmbed()
                .setTitle(`Ошибка синхронизации`)
                .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
                .setDescription("К сожалению, ваш Discord не привязан к Minecraft-аккаунту с купленной проходкой на СП.")
                .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
            await member.send({ embeds: [embed] })
            await member.kick("Отсутствует проходка на СП")
        } else {
            const minecraftUser = await mcdata.playerStatus(username, { renderSize: 2 })
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel('Начать шопинг')
                        .setEmoji('993118590934986774')
                        .setStyle('LINK')
                        .setURL("https://discord.com/channels/990684607861116959/992156724494618694/992164274115981393"),
                );
            const embed = new MessageEmbed()
                .setTitle(`Здравствуйте, ${username}`)
                .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                .setThumbnail(minecraftUser.avatar)
                .setImage(AppearanceConfig.Images.Banner)
                .setDescription("Добро пожаловать в Глорианскую торговую компанию.\nВы можете воспользоваться нашим сервисом `iMarket` для заказа товаров с доставкой по самым лучшим ценам!\n\nПо всем вопросам обращайтесь в канал <#997181105109213244>")
                .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
            await member.send({ embeds: [embed], components: [row] })
        }
    }
}
