import SlashCommand from "../utils/SlashCommand";

export default class Ping extends SlashCommand {
    constructor() {
        super();
        this.name = "Ping";
        this.description = "Pong!";
        this.onRun = (interaction) => {
            interaction.createMessage("Pong!");
        };
    }
}
