import Discord from "discord.js";
import { STATUS } from "../configurations/bot.json"
import { UpdateMessages } from './middleware/botMessagesUpdating'
import { SendCatalog } from "./middleware/catalogUpdating";

export = {
    name: 'ready',
    once: true,
    async execute (client: Discord.Client): Promise<void> {
        console.log(`${client.user.username} включен!`);
        await UpdateMessages(client)
        await SendCatalog(client)
        if (STATUS.enable)
            client.user.setPresence(STATUS as Discord.PresenceData);
    }
}
