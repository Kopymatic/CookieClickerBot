import Eris from "eris";
import { CommandStats } from "../models";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import { ButtonPaginator } from "../utils/ButtonPaginator";

export default class StatsCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Stats";
        this.description = "Bot statistics!";
        this.onRun = async (interaction) => {
            let user;
            if (interaction.member == undefined || interaction.member == null) {
                user = interaction.user;
            } else {
                user = interaction.member;
            }

            await interaction.createMessage({
                embeds: [
                    {
                        title: "Loading...",
                    },
                ],
            });

            let all = await CommandStats.findAll();

            let allTimeTotal: number = 0;
            let recentTotal: number = 0;
            all.forEach((index) => {
                recentTotal += +index.recentUses;
                allTimeTotal += +index.allTimeUses;
            });

            let embeds: Eris.Embed[] = [
                {
                    title: `About ${global.name}`,
                    description: `This is a bot made by Kopymatic to hopefully make peoples lives better.\nAll time commands run: ${allTimeTotal}\nCommands run since last restart: ${recentTotal}`,
                    color: global.defaultColor,
                    type: "rich",
                },
            ];

            all.forEach((index) => embeds.push(this.makeEmbed(index)));

            new ButtonPaginator(global.bot, await interaction.getOriginalMessage(), {
                startingPage: 0,
                allowedUsers: [user.id],
                maxTime: 30000,
                pages: embeds,
            });
        };
    }
    makeEmbed(commandStats: CommandStats): Eris.Embed {
        return {
            title: `About the command ${commandStats.commandName}`,
            description: `All time uses: ${commandStats.allTimeUses}\nUses since last restart: ${commandStats.recentUses}`,
            color: global.defaultColor,
            type: "rich",
        };
    }
}
