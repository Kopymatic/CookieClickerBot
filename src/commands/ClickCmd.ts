import Eris, { ActionRowComponents, ComponentInteraction, InteractionContent } from "eris";
import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import { ButtonStyles, ComponentTypes } from "../utils/CommandUtils";
import global from "../global";
import Menu from "../menus/Menu";

export default class ClickCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Click";
        this.description = "Click the cookie!";
        this.onRun = async (interaction) => {
            if (InteractionUtils.isInDm(interaction)) {
                interaction.createFollowup({ content: "This command is not allowed in dms!" });
                return;
            }

            let user = InteractionUtils.getUser(interaction);
            let clickerUser = await ClickerUser.findUser(user, interaction.guildID);
            clickerUser.lastKnownUsername = user.username;
            let secsSinceLastUpdate = clickerUser.updateCookies();
            clickerUser.save();

            let cookieButton: ActionRowComponents = {
                type: ComponentTypes.Button,
                custom_id: `${Math.random()}|CookieButton`,
                style: ButtonStyles.Primary,
                emoji: { name: "🍪" },
            };

            let message: InteractionContent = {
                embeds: [
                    {
                        title: `${clickerUser.lastKnownUsername}'s Dashboard`,
                        description: `Welcome to your dashboard!`,
                        fields: [
                            {
                                name: "Cookies",
                                value: `You have **${clickerUser.cookies.toLocaleString(
                                    "en-US"
                                )}** cookies!`,
                            },
                            {
                                name: "Cookies Per Second",
                                value: `You are making **${clickerUser
                                    .getCPS()
                                    .toLocaleString("en-US")}** cookies per second!`,
                            },
                            {
                                name: `Its been ${secsSinceLastUpdate} seconds since the last update`,
                                value: `You made ${Math.round(
                                    secsSinceLastUpdate * clickerUser.getCPS()
                                ).toLocaleString("en-US")} cookies in that time!`,
                            },
                        ],
                        color: global.defaultColor,
                    },
                ],
                components: [
                    {
                        type: ComponentTypes.ActionRow,
                        components: [cookieButton],
                    },
                ],
            };

            new Menu(
                global.bot,
                interaction,
                message,
                [
                    {
                        button: cookieButton,
                        func: async (interaction: ComponentInteraction) => {
                            clickerUser.cookies++;
                            clickerUser.save();
                            let original = await interaction.getOriginalMessage();
                            original.edit({
                                embeds: [
                                    {
                                        title: `${clickerUser.lastKnownUsername}'s Dashboard`,
                                        description: `Welcome to your dashboard!`,
                                        fields: [
                                            {
                                                name: "Cookies",
                                                value: `You have **${clickerUser.cookies.toLocaleString(
                                                    "en-US"
                                                )}** cookies!`,
                                            },
                                            {
                                                name: "Cookies Per Second",
                                                value: `You are making **${clickerUser
                                                    .getCPS()
                                                    .toLocaleString(
                                                        "en-US"
                                                    )}** cookies per second!`,
                                            },
                                            {
                                                name: `Its been ${secsSinceLastUpdate} seconds since the last update`,
                                                value: `You made ${Math.round(
                                                    secsSinceLastUpdate * clickerUser.getCPS()
                                                ).toLocaleString("en-US")} cookies in that time!`,
                                            },
                                        ],
                                        color: global.defaultColor,
                                    },
                                ],
                                components: message.components,
                            });
                        },
                    },
                ],
                {
                    allowedUsers: [user.id],
                    maxTime: 30000,
                }
            );
        };
    }
}
