"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bot_json_1 = require("../configurations/bot.json");
const botMessagesUpdating_1 = require("./middleware/botMessagesUpdating");
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`${client.user.username} включен!`);
            yield (0, botMessagesUpdating_1.UpdateMessages)(client);
            if (bot_json_1.STATUS.enable)
                client.user.setPresence(bot_json_1.STATUS);
        });
    }
};
