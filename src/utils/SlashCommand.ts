/* eslint-disable @typescript-eslint/no-unused-vars */
import Eris from "eris";

export default class SlashCommand {
    /**
     * The name of the command.
     */
    name: string;
    /**
     * The description for the command
     */
    description: string;
    /**
     * 	whether the command is enabled by default when the app is added to a guild
     */
    defaultPermission: boolean = true;
    /**
     * the parameters for the command, max 25
     */
    options: Eris.ApplicationCommandOptions[];
    /**
     * function to run when the command is recieved
     * @param  {Eris.CommandInteraction} interaction
     */
    onRun: (interaction: Eris.CommandInteraction) => void;
    /**
     * Whether or not the command should be deleted from discord
     */
    toDelete: boolean = false;
}
