import Eris from "eris";

export default class InteractionUtils {
    /**
     * Get the user or member, guaranteed not null or undefined.
     */
    public static getUser(interaction: Eris.CommandInteraction): Eris.Member | Eris.User {
        let user: Eris.Member | Eris.User;
        if (interaction.member == undefined || interaction.member == null) {
            user = interaction.user;
        } else {
            user = interaction.member;
        }
        return user;
    }

    /**
     * Get the options with type any for easy value getting
     */
    public static getOptions(interaction: Eris.CommandInteraction): any {
        let options: any = interaction.data.options;
        return options;
    }
}
