import Discord from "discord.js";
import { STATUS } from "../configurations/bot.json"
import { UpdateMessages } from './middleware/botMessagesUpdating'
import AppearanceConfig from '../configurations/appearance.json'

export = {
    name: 'ready',
    once: true,
    async execute (client: Discord.Client): Promise<void> {
        console.log(`${client.user.username} включен!`);
        // TODO: Добавить проверку аватара
        // await client.user.setAvatar(AppearanceConfig.Images.MainLogo)
        await UpdateMessages(client)
        if (STATUS.enable)
            client.user.setPresence(STATUS as Discord.PresenceData);
    }
}
