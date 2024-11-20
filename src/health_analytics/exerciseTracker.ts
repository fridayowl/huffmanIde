export type ExerciseType = 'microbreak' | 'stretch' | 'walk' | 'eye' | 'hand';

export interface Exercise {
    type: ExerciseType;
    duration: number;
    timestamp: number;
}

export interface ExerciseProgress {
    microbreaks: number;
    stretching: number;
    walking: number;
    eyeExercises: number;
    handExercises: number;
}

export interface ExerciseMetrics {
    progress: ExerciseProgress;
    lastExercises: Record<ExerciseType, number>;
    totalExercises: number;
    exerciseDistribution: Record<ExerciseType, number>;
}

interface ExerciseTargets {
    microbreaks: number;
    stretching: number;
    walking: number;
    eyeExercises: number;
    handExercises: number;
}

interface StoredMetrics {
    exercises: Exercise[];
    lastExercise: Record<ExerciseType, number>;
    dailyGoals: ExerciseTargets;
    lastUpdate: number;
}

export class ExerciseTracker {
    private static readonly STORAGE_KEY = 'exercise_metrics';
    private static readonly EXERCISE_TARGETS: ExerciseTargets = {
        microbreaks: 6,    // per day
        stretching: 15,    // minutes per day
        walking: 30,       // minutes per day
        eyeExercises: 8,   // per day
        handExercises: 4   // per day
    };

    private static readonly EXERCISE_INTERVALS: Record<ExerciseType, number> = {
        microbreak: 60 * 60 * 1000, // 1 hour
        stretch: 2 * 60 * 60 * 1000, // 2 hours
        walk: 3 * 60 * 60 * 1000, // 3 hours
        eye: 30 * 60 * 1000, // 30 minutes
        hand: 90 * 60 * 1000 // 1.5 hours
    };

    private metrics: StoredMetrics;

    constructor() {
        this.metrics = this.loadMetrics();
    }

    private loadMetrics(): StoredMetrics {
        const defaultMetrics: StoredMetrics = {
            exercises: [],
            lastExercise: {
                microbreak: 0,
                stretch: 0,
                walk: 0,
                eye: 0,
                hand: 0
            },
            dailyGoals: { ...ExerciseTracker.EXERCISE_TARGETS },
            lastUpdate: Date.now()
        };

        try {
            const stored = localStorage.getItem(ExerciseTracker.STORAGE_KEY);
            if (!stored) return defaultMetrics;

            const parsed = JSON.parse(stored);
            if (!this.isSameDay(new Date(parsed.lastUpdate))) {
                return defaultMetrics;
            }
            return parsed;
        } catch (error) {
            console.error('Error loading exercise metrics:', error);
            return defaultMetrics;
        }
    }

    private saveMetrics(): void {
        try {
            localStorage.setItem(
                ExerciseTracker.STORAGE_KEY,
                JSON.stringify(this.metrics)
            );
        } catch (error) {
            console.error('Error saving exercise metrics:', error);
        }
    }

    private isSameDay(date: Date): boolean {
        const now = new Date();
        return date.getDate() === now.getDate() &&
               date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    }

    public logExercise(type: ExerciseType, duration: number): void {
        const exercise: Exercise = {
            type,
            duration,
            timestamp: Date.now()
        };

        this.metrics.exercises.push(exercise);
        this.metrics.lastExercise[type] = Date.now();
        this.metrics.lastUpdate = Date.now();
        this.saveMetrics();
    }

    public getDailyProgress(): ExerciseProgress {
        const progress: ExerciseProgress = {
            microbreaks: 0,
            stretching: 0,
            walking: 0,
            eyeExercises: 0,
            handExercises: 0
        };

        this.metrics.exercises.forEach(exercise => {
            switch (exercise.type) {
                case 'microbreak':
                    progress.microbreaks++;
                    break;
                case 'stretch':
                    progress.stretching += exercise.duration;
                    break;
                case 'walk':
                    progress.walking += exercise.duration;
                    break;
                case 'eye':
                    progress.eyeExercises++;
                    break;
                case 'hand':
                    progress.handExercises++;
                    break;
            }
        });

        return {
            microbreaks: (progress.microbreaks / this.metrics.dailyGoals.microbreaks) * 100,
            stretching: (progress.stretching / this.metrics.dailyGoals.stretching) * 100,
            walking: (progress.walking / this.metrics.dailyGoals.walking) * 100,
            eyeExercises: (progress.eyeExercises / this.metrics.dailyGoals.eyeExercises) * 100,
            handExercises: (progress.handExercises / this.metrics.dailyGoals.handExercises) * 100
        };
    }

    public getTimeSinceLastExercise(type: ExerciseType): number {
        return Date.now() - this.metrics.lastExercise[type];
    }

    public needsExercise(type: ExerciseType): boolean {
        return this.getTimeSinceLastExercise(type) > ExerciseTracker.EXERCISE_INTERVALS[type];
    }

    private getExerciseDistribution(): Record<ExerciseType, number> {
        const distribution: Record<ExerciseType, number> = {
            microbreak: 0,
            stretch: 0,
            walk: 0,
            eye: 0,
            hand: 0
        };

        this.metrics.exercises.forEach(exercise => {
            distribution[exercise.type]++;
        });

        return distribution;
    }

    public getMetrics(): ExerciseMetrics & { needsExercise: (type: ExerciseType) => boolean } {
        return {
            progress: this.getDailyProgress(),
            lastExercises: { ...this.metrics.lastExercise },
            totalExercises: this.metrics.exercises.length,
            exerciseDistribution: this.getExerciseDistribution(),
            needsExercise: this.needsExercise.bind(this)
        };
    }

    public static getRecommendations(): ExerciseTargets {
        return { ...ExerciseTracker.EXERCISE_TARGETS };
    }

    public getExerciseHistory(): Exercise[] {
        return [...this.metrics.exercises];
    }

    public getExerciseStreak(type: ExerciseType): number {
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = this.metrics.exercises.length - 1; i >= 0; i--) {
            const exercise = this.metrics.exercises[i];
            const exerciseDate = new Date(exercise.timestamp);
            exerciseDate.setHours(0, 0, 0, 0);

            if (exercise.type === type && 
                exerciseDate.getTime() === today.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    public clearMetrics(): void {
        this.metrics = {
            exercises: [],
            lastExercise: {
                microbreak: 0,
                stretch: 0,
                walk: 0,
                eye: 0,
                hand: 0
            },
            dailyGoals: { ...ExerciseTracker.EXERCISE_TARGETS },
            lastUpdate: Date.now()
        };
        this.saveMetrics();
    }

    public setCustomGoal(type: keyof ExerciseTargets, value: number): void {
        if (value > 0) {
            this.metrics.dailyGoals[type] = value;
            this.saveMetrics();
        }
    }

    public getCurrentGoals(): ExerciseTargets {
        return { ...this.metrics.dailyGoals };
    }
}