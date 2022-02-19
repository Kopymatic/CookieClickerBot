import Eris from "eris";
import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import { ButtonPaginator } from "../utils/ButtonPaginator";
import ref from "../utils/ClickerReference";

export default class Shop extends SlashCommand {
    constructor() {
        super();
        this.name = "Shop";
        this.description = "Look at what there is to buy!";
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

            let embeds: Eris.Embed[] = [];
            const buildings = ref.buildings;

            for (let i = 0; i < buildings.length; i++) {
                embeds.push(this.makeEmbed(clickerUser, i));
            }

            interaction.createFollowup({ embeds: [{ title: "Loading..." }] });

            new ButtonPaginator(global.bot, await interaction.getOriginalMessage(), {
                startingPage: 0,
                allowedUsers: [user.id],
                maxTime: 30000,
                pages: embeds,
            });
        };
    }
    makeEmbed(clickerUser: ClickerUser, index: number): Eris.Embed {
        let canAfford = clickerUser.cookies >= clickerUser.getCost(index);
        let afford: string;
        if (canAfford) {
            afford = "can";
        } else {
            afford = "can't";
        }
        return {
            title: this.capitalizeFirstLetter(ref.buildings[index].internalName),
            description: `This costs ${clickerUser
                .getCost(index)
                .toLocaleString(
                    "en-US"
                )} cookies. \nYou **${afford}** afford this with your ${clickerUser.cookies.toLocaleString(
                "en-US"
            )} cookies.`,
            color: global.defaultColor,
            type: "rich",
        };
    }

    capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
