export class LiquidIntakeTracker {
    private static readonly STORAGE_KEY = 'liquid_intake_metrics';
    private static readonly CAFFEINE_CONTENT = {
        coffee: 95,  // mg per cup
        tea: 26,     // mg per cup
        energyDrink: 80  // mg per can
    };

    private static readonly DAILY_LIMITS = {
        water: 3000,     // ml
        caffeine: 400,   // mg
    };

    private metrics: {
        water: number;
        coffee: number;
        tea: number;
        energyDrinks: number;
        totalCaffeine: number;
        lastIntakeTime: number;
    };

    constructor() {
        this.metrics = this.loadMetrics();
    }

    private loadMetrics() {
        const defaultMetrics = {
            water: 0,
            coffee: 0,
            tea: 0,
            energyDrinks: 0,
            totalCaffeine: 0,
            lastIntakeTime: Date.now()
        };

        try {
            const stored = localStorage.getItem(LiquidIntakeTracker.STORAGE_KEY);
            if (!stored) return defaultMetrics;

            const parsed = JSON.parse(stored);
            // Reset if it's a new day
            if (!this.isSameDay(new Date(parsed.lastIntakeTime))) {
                return defaultMetrics;
            }
            return parsed;
        } catch (error) {
            console.error('Error loading liquid intake metrics:', error);
            return defaultMetrics;
        }
    }

    private saveMetrics() {
        try {
            localStorage.setItem(
                LiquidIntakeTracker.STORAGE_KEY,
                JSON.stringify(this.metrics)
            );
        } catch (error) {
            console.error('Error saving liquid intake metrics:', error);
        }
    }

    private isSameDay(date: Date): boolean {
        const now = new Date();
        return date.getDate() === now.getDate() &&
               date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    }

    public addWater(amount: number) {
        if (this.metrics.water + amount <= LiquidIntakeTracker.DAILY_LIMITS.water) {
            this.metrics.water += amount;
            this.metrics.lastIntakeTime = Date.now();
            this.saveMetrics();
        }
    }

    public addCoffee(cups: number = 1) {
        const additionalCaffeine = cups * LiquidIntakeTracker.CAFFEINE_CONTENT.coffee;
        if (this.metrics.totalCaffeine + additionalCaffeine <= LiquidIntakeTracker.DAILY_LIMITS.caffeine) {
            this.metrics.coffee += cups;
            this.metrics.totalCaffeine += additionalCaffeine;
            this.metrics.lastIntakeTime = Date.now();
            this.saveMetrics();
        }
    }

    public addTea(cups: number = 1) {
        const additionalCaffeine = cups * LiquidIntakeTracker.CAFFEINE_CONTENT.tea;
        if (this.metrics.totalCaffeine + additionalCaffeine <= LiquidIntakeTracker.DAILY_LIMITS.caffeine) {
            this.metrics.tea += cups;
            this.metrics.totalCaffeine += additionalCaffeine;
            this.metrics.lastIntakeTime = Date.now();
            this.saveMetrics();
        }
    }

    public addEnergyDrink(cans: number = 1) {
        const additionalCaffeine = cans * LiquidIntakeTracker.CAFFEINE_CONTENT.energyDrink;
        if (this.metrics.totalCaffeine + additionalCaffeine <= LiquidIntakeTracker.DAILY_LIMITS.caffeine) {
            this.metrics.energyDrinks += cans;
            this.metrics.totalCaffeine += additionalCaffeine;
            this.metrics.lastIntakeTime = Date.now();
            this.saveMetrics();
        }
    }

    public getMetrics() {
        return { ...this.metrics };
    }

    public getWaterProgress(): number {
        return (this.metrics.water / LiquidIntakeTracker.DAILY_LIMITS.water) * 100;
    }

    public getCaffeineProgress(): number {
        return (this.metrics.totalCaffeine / LiquidIntakeTracker.DAILY_LIMITS.caffeine) * 100;
    }

    public getTimeSinceLastIntake(): number {
        return Date.now() - this.metrics.lastIntakeTime;
    }

    public needsHydration(): boolean {
        // Suggest water if it's been more than 2 hours since last intake
        return this.getTimeSinceLastIntake() > 2 * 60 * 60 * 1000;
    }

    public getCaffeineWarningLevel(): 'safe' | 'moderate' | 'high' {
        const percentage = this.getCaffeineProgress();
        if (percentage < 50) return 'safe';
        if (percentage < 80) return 'moderate';
        return 'high';
    }

    public static getDailyRecommendations() {
        return {
            water: LiquidIntakeTracker.DAILY_LIMITS.water,
            caffeine: LiquidIntakeTracker.DAILY_LIMITS.caffeine
        };
    }
}