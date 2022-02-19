import Eris from "eris";
import { DataTypes, Model, Sequelize, where } from "sequelize";
import global from "./global";
import ref, { Building, Buildings } from "./utils/ClickerReference";

export function setUpModels() {
    const database = global.database;

    //Initialize all the database models

    CommandStats.init(
        {
            commandName: {
                type: DataTypes.TEXT,
                allowNull: false,
                primaryKey: true,
            },
            allTimeUses: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            recentUses: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
        },
        { sequelize: database }
    );

    ClickerUser.init(
        {
            guildID: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userID: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            lastKnownUsername: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            cookies: {
                type: DataTypes.DECIMAL(0),
                defaultValue: 0,
                allowNull: false,
            },
            cursors: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            grandmas: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            farms: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            mines: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            factories: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            banks: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            temples: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            wizardTowers: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            shipments: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            alchemyLabs: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            portals: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            timeMachines: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            antimatterCondensers: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            prisms: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            chancemakers: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            fractalEngines: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            javascriptConsoles: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            idleverses: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            upgrages: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                defaultValue: [""],
                allowNull: false,
            },
            lastCpsUpdate: {
                type: DataTypes.DATE,
                defaultValue: Date.now(),
                allowNull: false,
            },
        },
        { sequelize: database }
    );

    CommandStats.sync().then(
        () => console.log("CommandStats model success!"),
        (err) => console.error("CommandStats model error!", err)
    );

    ClickerUser.sync().then(
        () => console.log("ClickerUser model success!"),
        (err) => console.error("ClickerUser model error!", err)
    );
}

export class CommandStats extends Model {
    // Specifying data types on the class itself so the compiler doesnt complain
    public commandName: string;
    public allTimeUses: number;
    public recentUses: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class ClickerUser extends Model {
    // Specifying data types on the class itself so the compiler doesnt complain
    [index: string]: any;
    public id: number;
    public guildID: string;
    public userID: string;
    public lastKnownUsername: string;
    public cookies: bigint;
    public cursors: number;
    public grandmas: number;
    public farms: number;
    public mines: number;
    public factories: number;
    public banks: number;
    public temples: number;
    public wizardTowers: number;
    public shipments: number;
    public alchemyLabs: number;
    public portals: number;
    public timeMachines: number;
    public antimatterCondensers: number;
    public prisms: number;
    public chancemakers: number;
    public fractalEngines: number;
    public javascriptConsoles: number;
    public idleverses: number;
    public upgrades: Array<string>;

    public lastCpsUpdate: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getCPS(): number {
        let totalCps: number = 0;
        totalCps += this.cursors * ref.cursors.cps;
        totalCps += this.grandmas * ref.grandmas.cps;
        totalCps += this.farms * ref.farms.cps;
        totalCps += this.mines * ref.mines.cps;
        totalCps += this.factories * ref.factories.cps;
        totalCps += this.banks * ref.banks.cps;
        totalCps += this.temples * ref.temples.cps;
        totalCps += this.wizardTowers * ref.wizardTowers.cps;
        totalCps += this.shipments * ref.shipments.cps;
        totalCps += this.alchemyLabs * ref.alchemyLabs.cps;
        totalCps += this.portals * ref.portals.cps;
        totalCps += this.timeMachines * ref.timeMachines.cps;
        totalCps += this.antimatterCondensers * ref.antimatterCondensers.cps;
        totalCps += this.prisms * ref.prisms.cps;
        totalCps += this.chancemakers * ref.chancemakers.cps;
        totalCps += this.fractalEngines * ref.fractalEngines.cps;
        totalCps += this.javascriptConsoles * ref.javascriptConsoles.cps;
        totalCps += this.idleverses * ref.idleverses.cps;
        return totalCps;
    }

    /**
     * Updates the cookies. REMEMBER TO CALL SAVE!!!
     */
    public updateCookies() {
        let now = new Date(Date.now());
        let secsSinceLastUpdate = Math.round((now.getTime() - this.lastCpsUpdate.getTime()) / 1000);

        this.lastCpsUpdate = now;

        this.cookies += BigInt(Math.round(secsSinceLastUpdate * this.getCPS()));
    }

    public getBuildingAmount(building: number): number {
        let found = ref.buildings[building];
        if (found !== null || found !== undefined) {
            return this[found.internalName];
        } else {
            throw new Error("you did a fucky wucky");
        }
    }

    public getCost(building: number): bigint {
        let amount = this.getBuildingAmount(building);

        let attempted = ref.buildings[building];

        if (attempted instanceof Building) {
            return attempted.baseCost * BigInt(Math.pow(ref.COST_MULTIPLIER, amount));
        } else {
            throw new Error("Uh oh! A bad happened");
        }
    }

    public static async findUser(
        user: Eris.User | Eris.Member,
        guildID: string
    ): Promise<ClickerUser> {
        let it = (
            await ClickerUser.findOrCreate({
                where: { userID: user.id, guildID: guildID, lastKnownUsername: user.username },
            })
        )[0];
        it.cookies = BigInt(it.cookies); //Sequelize puts this in as a string instead of a bigint
        return it;
    }
}
