import Eris, { ActionRowComponents, ComponentInteraction, InteractionContent } from "eris";
import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import { ButtonStyles, ComponentTypes } from "../utils/CommandUtils";
import global from "../global";
import ClickMenu from "../menus/ClickMenu";
import Menu from "../menus/Menu";

export default class ClickCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Click";
        this.description = "Click the cookie!";
        this.onRun = async (interaction) => {
            if (InteractionUtils.isInDm(interaction)) {
                interaction.createMessage({ content: "This command is not allowed in dms!" });
                return;
            }

            await interaction.acknowledge();

            let user = InteractionUtils.getUser(interaction);
            let clickerUser = await ClickerUser.findUser(user, interaction.guildID);
            clickerUser.updateCookies();
            clickerUser.save();

            let cookieButton: ActionRowComponents = {
                type: ComponentTypes.Button,
                custom_id: `${Math.random()}|CookieButton`,
                style: ButtonStyles.Success,
                emoji: { name: "🍪" },
            };

            let message: InteractionContent = {
                embeds: [
                    {
                        title: "CookieClicker!",
                        description: `You currently have **${clickerUser.cookies.toLocaleString(
                            "en-US"
                        )}** cookies! \nClick the button to get more`,
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
                            await interaction.acknowledge();
                            clickerUser.cookies++;
                            clickerUser.save();
                            let original = await interaction.getOriginalMessage();
                            original.edit({
                                embeds: [
                                    {
                                        title: "CookieClicker!",
                                        description: `You currently have **${clickerUser.cookies.toLocaleString(
                                            "en-US"
                                        )}** cookies! \nClick the button to get more`,
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
                    maxTime: 120000,
                }
            );
        };
    }
}
