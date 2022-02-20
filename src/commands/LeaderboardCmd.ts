import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";

export default class LeaderboardCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Leaderboard";
        this.description = "Leaderboards for this server.";
        this.onRun = async (interaction) => {
            if (InteractionUtils.isInDm(interaction)) {
                interaction.createFollowup({ content: "This command is not allowed in dms!" });
                return;
            }

            let all = await ClickerUser.findAll({
                where: {
                    guildID: interaction.guildID,
                },
                order: [["cookies", "DESC"]],
            });

            let desc = "";
            all.forEach((index) => {
                desc += `${index.lastKnownUsername}: ${index.cookies} cookies\n`;
            });

            interaction.createFollowup({
                embeds: [
                    {
                        title: "Leaderboards",
                        description: desc,
                        color: global.defaultColor,
                    },
                ],
            });
        };
    }
}
