class Building {
    baseCost: bigint;
    cps: number;

    constructor(baseCost: bigint | number, cps: number) {
        if (typeof baseCost === "number") {
            this.baseCost = BigInt(baseCost);
        } else if (typeof baseCost === "bigint") {
            this.baseCost = baseCost;
        }
        this.cps = cps;
    }
}

export default class ClickerReference {
    public static COST_MULTIPLIER = 1.15;
    public static CPS_MULTIPLIER = 1;
    // cursor
    public static cursor = new Building(15, 0.5); //TEMPORARY FIX: MAKE THIS 0.1 AGAIN LATER
    // grandma
    public static grandma = new Building(100, 1);
    // farm
    public static farm = new Building(1100, 8);
    // mine
    public static mine = new Building(12000, 47);
    // factory
    public static factory = new Building(130000, 260);
    // bank
    public static bank = new Building(1400000, 1400);
    // TEMPLE
    public static temple = new Building(20000000, 7800);
    // WIZARD_TOWER
    public static wizardTower = new Building(330000000, 44000);
    // SHIPMENT
    public static shipment = new Building(5100000000, 260000);
    // ALCHEMY_LAB
    public static alchemyLab = new Building(75000000000, 1600000);
    // PORTAL
    public static portal = new Building(1000000000000, 10000000);
    // TIME_MACHINE
    public static timeMachine = new Building(14000000000000, 65000000);
    // ANTIMATTER_CONDENSER
    public static antimatterCondenser = new Building(170000000000000, 430000000);
    // PRISM
    public static prism = new Building(2100000000000000, 2900000000);
    // CHANCEMAKER
    public static chancemaker = new Building(26000000000000000n, 21000000000);
    // FRACTAL_ENGINE
    public static fractalEngine = new Building(310000000000000000n, 150000000000);

    public static javascriptConsoles = new Building(71000000000000000000n, 1100000000000);

    public static idleverse = new Building(12000000000000000000000n, 8300000000000);
}
