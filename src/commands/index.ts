import SlashCommand from "../utils/SlashCommand";
import BuyCmd from "./BuyCmd";
import ClickCmd from "./ClickCmd";
import Ping from "./PingCmd";
import ShopCmd from "./ShopCmd";
import StatsCmd from "./StatsCmd";
import TestCmd from "./TestCmd";

const commands: SlashCommand[] = [
    new Ping(),
    new StatsCmd(),
    //new TestCmd(),
    new ClickCmd(),
    new ShopCmd(),
    new BuyCmd(),
];

export default commands;
