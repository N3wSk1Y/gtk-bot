import Discord from "discord.js";
import { UpdateMessages } from './middleware/botMessagesUpdating'
import { SendCatalog } from "./middleware/catalogUpdating";
import {CheckSPWorldsAvaliability} from "../index";

export = {
    name: 'ready',
    once: true,
    async execute (client: Discord.Client): Promise<void> {
        console.log(`${client.user.username} включен!`);
        await UpdateMessages(client)
        await SendCatalog(client)
        await CheckSPWorldsAvaliability()
    }
}
