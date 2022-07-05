import Discord, { ColorResolvable, MessageEmbed } from "discord.js";
import { SPWorlds } from "spworlds";
import CardsConfig from '../configurations/cards_configuration.json';
import AppearanceConfig from '../configurations/appearance_configuration.json'

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

module.exports = {
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
                .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.MainLogo)
            await member.send({ embeds: [embed] })
            await member.kick("Отсутствует проходка на СП")
        }
    }
}
