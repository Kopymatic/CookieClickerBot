import { Client } from "eris";
import { Sequelize } from "sequelize";
import config from "./resources/config.json";

module global {
    export const experimental = config.experimental;
    export const version = config.version;
    export let name: string;
    export let token: string;
    export const defaultColor = 0xff6fff; //I would load these from config.json but then id have to parse and ehhhhhh
    export const red = 0xed4245;
    export const green = 0x57f287;
    if (experimental) {
        //There is probably a much better way to do this
        name = config.devBot.name;
        token = config.devBot.token;
    } else {
        name = config.mainBot.name;
        token = config.mainBot.token;
    }
    export let bot: Client;
    export const databaseUsername: string = config.database.user;
    export const databasePassword: string = config.database.password;
    export let database: Sequelize;
    export const devServerId: string = config.devGuild;
    export const loggingChannelId: string = config.loggingChannelId;
    export let absoluteStartTime: number;
    export let quotes: [];
}
export default global;
