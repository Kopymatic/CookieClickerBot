import SlashCommand from "../utils/SlashCommand";
import BuyCmd from "./BuyCmd";
import ClickCmd from "./ClickCmd";
import LeaderboardCmd from "./LeaderboardCmd";
import Ping from "./PingCmd";
import ResetCmd from "./ResetCmd";
import ShopCmd from "./ShopCmd";
import StatsCmd from "./StatsCmd";

const commands: SlashCommand[] = [
    new ResetCmd(),
    new Ping(),
    new StatsCmd(),
    //new TestCmd(),
    new ClickCmd(),
    new ShopCmd(),
    new BuyCmd(),
    new LeaderboardCmd(),
];

export default commands;
