export class Building {
    baseCost: bigint;
    cps: number;
    internalName: string;

    constructor(baseCost: bigint | number, cps: number, internalName: string) {
        if (typeof baseCost === "number") {
            this.baseCost = BigInt(baseCost);
        } else if (typeof baseCost === "bigint") {
            this.baseCost = baseCost;
        }
        this.cps = cps;
        this.internalName = internalName;
    }
}

export class Buildings {
    [index: number | string]: string;
    cursor = "cursors";
    grandma = "grandmas";
    farm = "farms";
    mine = "mines";
    factorie = "factories";
    bank = "banks";
    temple = "temples";
    wizardTower = "wizardTowers";
    shipment = "shipments";
    alchemyLab = "alchemyLabs";
    portal = "portals";
    timeMachine = "timeMachines";
    antimatterCondenser = "antimatterCondensers";
    prism = "prisms";
    chancemaker = "chancemakers";
    fractalEngine = "fractalEngines";
    javascriptConsole = "javascriptConsoles";
    idleverse = "idleverses";
}

export default class ClickerReference {
    [index: number | string]: Building | number;
    // cursor
    public static cursors = new Building(15, 0.1, "cursors");
    // grandma
    public static grandmas = new Building(100, 1, "grandmas");
    // farm
    public static farms = new Building(1100, 8, "farms");
    // mine
    public static mines = new Building(12000, 47, "mines");
    // factory
    public static factories = new Building(130000, 260, "factories");
    // bank
    public static banks = new Building(1400000, 1400, "banks");
    // TEMPLE
    public static temples = new Building(20000000, 7800, "temples");
    // WIZARD_TOWER
    public static wizardTowers = new Building(330000000, 44000, "wizardTowers");
    // SHIPMENT
    public static shipments = new Building(5100000000, 260000, "shipments");
    // ALCHEMY_LAB
    public static alchemyLabs = new Building(75000000000, 1600000, "alchemyLabs");
    // PORTAL
    public static portals = new Building(1000000000000, 10000000, "portals");
    // TIME_MACHINE
    public static timeMachines = new Building(14000000000000, 65000000, "timeMachines");
    // ANTIMATTER_CONDENSER
    public static antimatterCondensers = new Building(
        170000000000000,
        430000000,
        "antimatterCondensers"
    );
    // PRISM
    public static prisms = new Building(2100000000000000, 2900000000, "prisms");
    // CHANCEMAKER
    public static chancemakers = new Building(26000000000000000n, 21000000000, "chancemakers");
    // FRACTAL_ENGINE
    public static fractalEngines = new Building(
        310000000000000000n,
        150000000000,
        "fractalEngines"
    );

    public static javascriptConsoles = new Building(
        71000000000000000000n,
        1100000000000,
        "javascriptConsoles"
    );

    public static idleverses = new Building(12000000000000000000000n, 8300000000000, "idleverses");

    public static COST_MULTIPLIER = 1.15;
    public static CPS_MULTIPLIER = 1;

    public static buildings = [
        ClickerReference.cursors,
        ClickerReference.grandmas,
        ClickerReference.farms,
        ClickerReference.mines,
        ClickerReference.factories,
        ClickerReference.banks,
        ClickerReference.temples,
        ClickerReference.wizardTowers,
        ClickerReference.shipments,
        ClickerReference.alchemyLabs,
        ClickerReference.portals,
        ClickerReference.timeMachines,
        ClickerReference.antimatterCondensers,
        ClickerReference.prisms,
        ClickerReference.chancemakers,
        ClickerReference.fractalEngines,
        ClickerReference.javascriptConsoles,
        ClickerReference.idleverses,
    ];
}
