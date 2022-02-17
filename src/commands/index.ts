import SlashCommand from "../utils/SlashCommand";
import ClickCmd from "./ClickCmd";
import Ping from "./PingCmd";
import StatsCmd from "./StatsCmd";
import TestCmd from "./TestCmd";

const commands: SlashCommand[] = [new Ping(), new StatsCmd(), new TestCmd(), new ClickCmd()];

export default commands;
