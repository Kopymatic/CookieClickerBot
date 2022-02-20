import Eris, { Command, InteractionContent } from "eris";
import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import { ButtonPaginator } from "../utils/ButtonPaginator";
import ref from "../utils/ClickerReference";
import {
    ButtonStyles,
    CommandOptionTypes,
    ComponentTypes,
    ResponseFlags,
} from "../utils/CommandUtils";
import Menu, { MenuButton } from "../menus/Menu";

export default class BuyCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Buy";
        this.description = "Buy stuff!";
        this.options = [
            {
                name: "what",
                description: "What to buy",
                type: CommandOptionTypes.NUMBER,
                choices: [
                    {
                        name: "Cursor",
                        value: 0,
                    },
                    {
                        name: "Grandma",
                        value: 1,
                    },
                    {
                        name: "Farm",
                        value: 2,
                    },
                    {
                        name: "Mine",
                        value: 3,
                    },
                    {
                        name: "Factory",
                        value: 4,
                    },
                    {
                        name: "Bank",
                        value: 5,
                    },
                    {
                        name: "Temple",
                        value: 6,
                    },
                    {
                        name: "Wizard Tower",
                        value: 7,
                    },
                    {
                        name: "Shipment",
                        value: 8,
                    },
                    {
                        name: "Alchemy Lab",
                        value: 9,
                    },
                    {
                        name: "Portal",
                        value: 10,
                    },
                    {
                        name: "Time Machine",
                        value: 11,
                    },
                    {
                        name: "Antimatter Condenser",
                        value: 12,
                    },
                    {
                        name: "Prism",
                        value: 13,
                    },
                    {
                        name: "Chancemaker",
                        value: 14,
                    },
                    {
                        name: "Fractal Engine",
                        value: 15,
                    },
                    {
                        name: "Javascript Console",
                        value: 16,
                    },
                    {
                        name: "Idleverse",
                        value: 17,
                    },
                ],
                required: true,
            },
        ];
        this.onRun = async (interaction) => {
            if (InteractionUtils.isInDm(interaction)) {
                interaction.createMessage({ content: "This command is not allowed in dms!" });
                return;
            }

            await interaction.acknowledge();

            let user = InteractionUtils.getUser(interaction);
            let options = InteractionUtils.getOptions(interaction);
            let clickerUser = await ClickerUser.findUser(user, interaction.guildID);
            clickerUser.updateCookies();
            clickerUser.save();

            let buildingID = options[0].value;
            let building = ref.buildings[buildingID];

            let oneDisabled = !clickerUser.checkBuy(buildingID, 1);
            let tenDisabled = !clickerUser.checkBuy(buildingID, 10);
            let oneHundredDisabled = !clickerUser.checkBuy(buildingID, 100);

            let oneButton: MenuButton = {
                button: {
                    label: "Buy One",
                    custom_id: `${Math.random()}|OneButton`,
                    style: ButtonStyles.Primary,
                    type: ComponentTypes.Button,
                    disabled: oneDisabled,
                },
                func: async (interaction2: Eris.ComponentInteraction) => {
                    await interaction2.acknowledge();
                    if (clickerUser.buy(buildingID, 1)) {
                        interaction2.createFollowup({
                            content: "Buying success!",
                            flags: ResponseFlags.EPHEMERAL,
                        });
                        let original = await interaction.getOriginalMessage();
                        original.delete();
                    } else {
                        interaction2.createFollowup({
                            content: "Buying failed. Contact Kopy about this!",
                            flags: ResponseFlags.EPHEMERAL,
                        });
                    }
                },
            };

            let tenButton: MenuButton = {
                button: {
                    label: "Buy Ten",
                    custom_id: `${Math.random()}|TenButton`,
                    style: ButtonStyles.Primary,
                    type: ComponentTypes.Button,
                    disabled: tenDisabled,
                },
                func: async (interaction2: Eris.ComponentInteraction) => {
                    await interaction2.acknowledge();
                    if (clickerUser.buy(buildingID, 10)) {
                        interaction2.createFollowup({
                            content: "Buying success!",
                            flags: ResponseFlags.EPHEMERAL,
                        });
                        let original = await interaction.getOriginalMessage();
                        original.delete();
                    } else {
                        interaction2.createFollowup({
                            content: "Buying failed. Contact Kopy about this!",
                            flags: ResponseFlags.EPHEMERAL,
                        });
                    }
                },
            };

            let oneHundredButton: MenuButton = {
                button: {
                    label: "Buy One Hundred",
                    custom_id: `${Math.random()}|OneHundredButton`,
                    style: ButtonStyles.Primary,
                    type: ComponentTypes.Button,
                    disabled: oneHundredDisabled,
                },
                func: async (interaction2: Eris.ComponentInteraction) => {
                    await interaction2.acknowledge();
                    if (clickerUser.buy(buildingID, 100)) {
                        interaction2.createFollowup({
                            content: "Buying success!",
                            flags: ResponseFlags.EPHEMERAL,
                        });
                        let original = await interaction.getOriginalMessage();
                        original.delete();
                    } else {
                        interaction2.createFollowup({
                            content: "Buying failed. Contact Kopy about this!",
                            flags: ResponseFlags.EPHEMERAL,
                        });
                    }
                },
            };

            let maxBuy = clickerUser.getMaxBuy(buildingID);
            let maxButton: MenuButton = {
                button: {
                    label: `Buy max (${maxBuy})`,
                    custom_id: `${Math.random()}|MaxButton`,
                    style: ButtonStyles.Success,
                    type: ComponentTypes.Button,
                    disabled: maxBuy <= 0,
                },
                func: async (interaction2: Eris.ComponentInteraction) => {
                    await interaction2.acknowledge();
                    if (clickerUser.buy(buildingID, maxBuy)) {
                        interaction2.createFollowup({
                            content: "Buying success!",
                            flags: ResponseFlags.EPHEMERAL,
                        });
                        let original = await interaction.getOriginalMessage();
                        original.delete();
                    } else {
                        interaction2.createFollowup({
                            content: "Buying failed. Contact Kopy about this!",
                            flags: ResponseFlags.EPHEMERAL,
                        });
                    }
                },
            };

            let message: InteractionContent = {
                embeds: [
                    {
                        title: `Buy ${building.internalName}`,
                        description: `You have **${clickerUser.cookies.toLocaleString(
                            "en-US"
                        )}** cookies.\n\nTo buy 1 ${
                            building.internalName
                        } it will be ${clickerUser.getMultiCost(
                            buildingID,
                            1
                        )} cookies.\nTo buy 10 ${
                            building.internalName
                        } it will be ${clickerUser.getMultiCost(
                            buildingID,
                            10
                        )} cookies.\nTo buy 100 ${
                            building.internalName
                        } it will be ${clickerUser.getMultiCost(
                            buildingID,
                            100
                        )} cookies.\nTo buy max ${
                            building.internalName
                        } it will be ${clickerUser.getMultiCost(buildingID, maxBuy)} cookies.`,
                        color: global.defaultColor,
                    },
                ],
                components: [
                    {
                        type: ComponentTypes.ActionRow,
                        components: [
                            oneButton.button,
                            tenButton.button,
                            oneHundredButton.button,
                            maxButton.button,
                        ],
                    },
                ],
            };

            let menu = new Menu(
                global.bot,
                interaction,
                message,
                [oneButton, tenButton, oneHundredButton, maxButton],
                { allowedUsers: [user.id], maxTime: 30000 }
            );
        };
    }
}
