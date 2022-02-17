import Eris from "eris";
import { DataTypes, Model, where } from "sequelize";
import global from "./global";
import ref from "./utils/ClickerReference";

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

    public getCPS(): bigint {
        let totalCps: bigint = 0n;
        totalCps += BigInt(Math.round(this.cursors * ref.cursor.cps));
        totalCps += BigInt(this.grandmas * ref.grandma.cps);
        totalCps += BigInt(this.farms * ref.farm.cps);
        totalCps += BigInt(this.mines * ref.mine.cps);
        totalCps += BigInt(this.factories * ref.factory.cps);
        totalCps += BigInt(this.banks * ref.bank.cps);
        totalCps += BigInt(this.temples * ref.temple.cps);
        totalCps += BigInt(this.wizardTowers * ref.wizardTower.cps);
        totalCps += BigInt(this.shipments * ref.shipment.cps);
        totalCps += BigInt(this.alchemyLabs * ref.alchemyLab.cps);
        totalCps += BigInt(this.portals * ref.portal.cps);
        totalCps += BigInt(this.timeMachines * ref.timeMachine.cps);
        totalCps += BigInt(this.antimatterCondensers * ref.antimatterCondenser.cps);
        totalCps += BigInt(this.prisms * ref.prism.cps);
        totalCps += BigInt(this.chancemakers * ref.chancemaker.cps);
        totalCps += BigInt(this.fractalEngines * ref.fractalEngine.cps);
        totalCps += BigInt(this.javascriptConsoles * ref.javascriptConsoles.cps);
        totalCps += BigInt(this.idleverses * ref.idleverse.cps);
        return totalCps;
    }

    /**
     * Updates the cookies. REMEMBER TO CALL SAVE!!!
     */
    public updateCookies() {
        let now = new Date(Date.now());
        let secsSinceLastUpdate = Math.round((now.getTime() - this.lastCpsUpdate.getTime()) / 1000);

        console.log(secsSinceLastUpdate);
        console.log(this.getCPS());

        this.lastCpsUpdate = now;

        this.cookies += BigInt(secsSinceLastUpdate) * this.getCPS();
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
        it.cookies = BigInt(it.cookies);
        return it;
    }
}
