import Eris, { CommandInteraction } from "eris";
import global from "./global";
import commands from "./commands";
import * as pg from "pg";
import { Sequelize } from "sequelize";
import { CommandTypes } from "./utils/CommandUtils";
import { CommandStats, setUpModels } from "./models";

console.log("Loading...");
//Log the configuration so when i run it i know whats going on
console.log(
    `Configuration:
       experimental: ${global.experimental}
       version: ${global.version}
       name: ${global.name}`
);

//Connect to the database
global.database = new Sequelize(
    `postgres://${global.databaseUsername}:${global.databasePassword}@localhost:5432/CookieClicker`,
    {
        logging: false,
        dialectModule: pg,
    }
);
global.database.authenticate();
console.log("Database connection successful!");
setUpModels();

//Create the bot client
const bot = new Eris.Client(global.token, {
    intents: ["guildEmojis"],
    allowedMentions: { everyone: false }, //No pingy everyone
    maxShards: "auto",
    restMode: true,
});
global.bot = bot;

//This is the first time its ready
let firstReady = true;
bot.on("ready", async () => {
    //When bot is ready, log ready
    console.log("Ready!");
    if (firstReady) {
        //Go over all the CommandStats and set recent uses to zero
        let all = await CommandStats.findAll();
        all.forEach((index) => {
            //Clear recent uses
            index.recentUses = 0;
            index.save();
        });

        if (global.experimental) {
            //Loop over all commands and send them to discord as GUILD commands
            commands.forEach(async (index) => {
                let newCommand = await bot.createGuildCommand(global.devServerId, {
                    name: index.name,
                    description: index.description,
                    defaultPermission: index.defaultPermission,
                    options: index.options,
                    type: CommandTypes.SLASH,
                });
                console.log(
                    `Guild command ${index.name} created with id ${newCommand.id} in guild ${newCommand.guild_id}`
                );

                //If the command is marked as to be deleted, delete it
                if (index.toDelete) {
                    bot.deleteGuildCommand(newCommand.guild_id, newCommand.id);
                    console.log(`Command ${index.name} deleted`);
                }
            });
        } else {
            //Loop over all commands and send them to discord as GLOBAL commands
            commands.forEach(async (index) => {
                let newCommand = await bot.createCommand({
                    name: index.name,
                    description: index.description,
                    defaultPermission: index.defaultPermission,
                    options: index.options,
                    type: CommandTypes.SLASH,
                });
                console.log(`Global command ${index.name} created with id ${newCommand.id}`);

                //If the command is marked as to be deleted, delete it
                if (index.toDelete) {
                    bot.deleteCommand(newCommand.id);
                    console.log(`Command ${index.name} deleted`);
                }
            });
        }

        //Set the absolute start time to now
        global.absoluteStartTime = Date.now();

        //Create a log in a configured logging channel that the bot is online
        bot.createMessage(global.loggingChannelId, {
            embeds: [
                {
                    title: `${global.name} Version ${global.version} is now online!`,
                    color: global.green,
                },
            ],
        });

        //Set firstReady to false so we dont do all this again
        firstReady = false;
    }
});

//Whenever a shard is ready, set the status on that shard. This is done so the shard id can be in the status.
bot.on("shardReady", (id) => {
    bot.shards.get(id).editStatus("online", {
        name: `Version ${global.version} | Shard ${id}`,
        type: 3,
    });
});

//If the bot encounters an error, log it in a configured logging channel.
bot.on("error", (err) => {
    console.error(err);
    try {
        bot.createMessage(global.loggingChannelId, {
            embeds: [
                {
                    title: `${global.name} encountered an error!`,
                    description: `\`\`\`${err.name}\n${err.message}\n${err.stack}\`\`\``,
                    color: global.red,
                },
            ],
        });
    } catch (error) {
        console.error(error);
    }
});

//Executed when we recieve an interaction, such as a slash command or button press
bot.on("interactionCreate", (interaction) => {
    //If the recieved interaction is a slash command, loop over all the commands to find which we recieved
    if (interaction instanceof Eris.CommandInteraction) {
        commands.forEach(async (command) => {
            if (command.name.toLowerCase() == interaction.data.name) {
                //Once we figure out what command we recieved, acknowledge it and run its onRun function.
                //interaction.acknowledge();
                command.onRun(interaction);

                //Do statistic tracking stuff
                let commandStats = await CommandStats.findOrCreate({
                    where: {
                        commandName: command.name,
                    },
                });
                commandStats[0].allTimeUses++;
                commandStats[0].recentUses++;
                commandStats[0].save();
            }
        });
    }
});

//Set the status while loading
bot.editStatus("idle", { name: `Loading...`, type: 3 });

//Finally, connect the bot.
bot.connect();
