import Eris, { ActionRowComponents, ComponentInteraction, InteractionContent } from "eris";
import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import { ButtonStyles, ComponentTypes } from "../utils/CommandUtils";
import global from "../global";
import Menu from "../menus/Menu";

export default class ResetCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Reset";
        this.description = "Reset your progress in this server!";
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

            let confirmButton: ActionRowComponents = {
                label: "Yes I'm sure.",
                type: ComponentTypes.Button,
                custom_id: `${Math.random()}|ConfirmButton`,
                style: ButtonStyles.Danger,
            };
            let cancelButton: ActionRowComponents = {
                label: "Dont reset my progress.",
                type: ComponentTypes.Button,
                custom_id: `${Math.random()}|CancelButton`,
                style: ButtonStyles.Primary,
            };

            let message: InteractionContent = {
                embeds: [
                    {
                        title: `Reset your progress?`,
                        description: `THIS IS **__IRREVERSABLE__**`,
                        color: global.defaultColor,
                    },
                ],
                components: [
                    {
                        type: ComponentTypes.ActionRow,
                        components: [confirmButton, cancelButton],
                    },
                ],
            };

            new Menu(
                global.bot,
                interaction,
                message,
                [
                    {
                        button: confirmButton,
                        func: async (interaction: ComponentInteraction) => {
                            await clickerUser.destroy();
                            let original = await interaction.getOriginalMessage();
                            original.edit({
                                embeds: [
                                    {
                                        title: "Progress deleted.",
                                        color: global.defaultColor,
                                    },
                                ],
                                components: [
                                    {
                                        type: ComponentTypes.ActionRow,
                                        components: [
                                            {
                                                label: "Goodbye 😔",
                                                type: ComponentTypes.Button,
                                                custom_id: `${Math.random()}|GoodbyeButton`,
                                                style: ButtonStyles.Danger,
                                            },
                                        ],
                                    },
                                ],
                            });
                        },
                    },
                    {
                        button: cancelButton,
                        func: async (interaction: ComponentInteraction) => {
                            let original = await interaction.getOriginalMessage();
                            original.edit({
                                embeds: [
                                    {
                                        title: "Cancelled.",
                                        color: global.defaultColor,
                                    },
                                ],
                                components: [
                                    {
                                        type: ComponentTypes.ActionRow,
                                        components: [
                                            {
                                                label: "Epic 😎",
                                                type: ComponentTypes.Button,
                                                custom_id: `${Math.random()}|EpicButton`,
                                                style: ButtonStyles.Success,
                                            },
                                        ],
                                    },
                                ],
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
