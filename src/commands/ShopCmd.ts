import Eris from "eris";
import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import { ButtonPaginator } from "../utils/ButtonPaginator";
import ref from "../utils/ClickerReference";

export default class ShopCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Shop";
        this.description = "Look at what there is to buy!";
        this.onRun = async (interaction) => {
            if (InteractionUtils.isInDm(interaction)) {
                interaction.createFollowup({ content: "This command is not allowed in dms!" });
                return;
            }

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

        let name = this.capitalizeFirstLetter(ref.buildings[index].internalName);
        let cost = clickerUser.getCost(index).toLocaleString("en-US");
        let cps = ref.buildings[index].cps.toLocaleString("en-US");
        let amount = clickerUser.getBuildingAmount(index).toLocaleString("en-US");
        let cookies = clickerUser.cookies.toLocaleString("en-US");

        return {
            title: name,
            description: `This costs ${cost} cookies.\nIt makes ${cps} cookies per second.\nYou have ${amount} ${name}.\nYou **${afford}** afford this with your ${cookies} cookies.\n\nUse /buy to buy a building!`,
            color: global.defaultColor,
            type: "rich",
        };
    }

    capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
