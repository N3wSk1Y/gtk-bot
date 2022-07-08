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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const spworlds_1 = require("spworlds");
const mcdata_1 = __importDefault(require("mcdata"));
const cards_json_1 = __importDefault(require("../configurations/cards.json"));
const appearance_json_1 = __importDefault(require("../configurations/appearance.json"));
const channels_json_1 = __importDefault(require("../configurations/channels.json"));
const sp = new spworlds_1.SPWorlds(cards_json_1.default.CARD_ID, cards_json_1.default.CARD_TOKEN);
module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            if (message.channelId === channels_json_1.default.REVIEWS_CHANNEL) {
                const username = yield sp.findUser(message.author.id);
                const minecraftUser = yield mcdata_1.default.playerStatus(username, { renderSize: 2 });
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle(`Отзыв/Пожелание клиента ${username}`)
                    .setColor(appearance_json_1.default.Colors.Default)
                    .setDescription("```" + message.content + "```" + "\n**Вы можете оставить свой отзыв/пожелание, просто написав его в этом канале**")
                    .setThumbnail(minecraftUser.skin.avatar)
                    .setFooter(appearance_json_1.default.Tags.GTK, appearance_json_1.default.MainLogo);
                yield client.channels.cache.get(channels_json_1.default.REVIEWS_CHANNEL).send({ embeds: [embed] });
                yield message.delete();
            }
        });
    }
};
