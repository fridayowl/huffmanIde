import { CodingMentalHealthTracker } from "./codingMentalHealthTracker";
import { TimeMetricsTracker } from "./timeMetricsTracker";

export interface StressMetrics {
    typingSpeed: number;
    errorRate: number;
    codeComplexity: number;
    timeWithoutBreaks: number;
    keystrokes: number;
    mouseMovement: number;
}

export interface StressAnalysis {
    stressLevel: 'low' | 'moderate' | 'high';
    stressScore: number;
    metrics: {
        cognitiveLoad: number;
        physicalStrain: number;
        contributingFactors: string[];
    };
    recommendations: string[];
    timestamp: string;
}

export class StressPatternService {
    private static readonly STORAGE_KEY = 'stress_pattern_analysis';
    private static readonly API_URL = 'https://us-central1-fine-mile-444406-h9.cloudfunctions.net/analyze_stress';

    private static calculateAverageMetric<T>(
        metrics: T[] | undefined, 
        getter: (m: T) => number
    ): number {
        if (!metrics || metrics.length === 0) return 0;
        return metrics.reduce((acc, m) => acc + getter(m), 0) / metrics.length;
    }

    private static gatherCurrentMetrics(): StressMetrics {
        const mentalMetrics = CodingMentalHealthTracker.getDailyMetrics();
        const timeMetrics = TimeMetricsTracker.getDailyMetrics();

        // Calculate metrics using type-safe generic method
        const typingSpeed = this.calculateAverageMetric(
            mentalMetrics?.metrics,
            m => m.patterns.typingSpeed ?? 0
        );

        const errorRate = this.calculateAverageMetric(
            mentalMetrics?.metrics,
            m => m.patterns.errorRate ?? 0
        ) * 100;

        const codeComplexity = this.calculateAverageMetric(
            mentalMetrics?.metrics,
            m => m.patterns.codeComplexity ?? 0
        ) * 100;

        // Calculate time without breaks in minutes
        const timeWithoutBreaks = timeMetrics ? 
            Math.max(0, timeMetrics.longestCodingStreak / (60 * 1000)) : 0;

        // Estimate keystrokes based on typing speed and time
        const keystrokes = Math.round(typingSpeed * (timeMetrics?.totalCodingTime || 0) / (60 * 1000));

        // Calculate mouse movement (using a generic approach to avoid type conflicts)
        const mouseMovement = this.calculateAverageMetric(
            mentalMetrics?.metrics,
            m => {
                const patterns = m.patterns as any;
                return patterns.mouseActivity ?? patterns.mouseMovement ?? patterns.mouseIntensity ?? 0;
            }
        ) * 100;

        return {
            typingSpeed,
            errorRate,
            codeComplexity,
            timeWithoutBreaks,
            keystrokes,
            mouseMovement
        };
    }

    public static async analyzeStressPatterns(): Promise<StressAnalysis> {
        try {
            const metrics = this.gatherCurrentMetrics();
            
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    developerMetrics: metrics
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analysis = await response.json();
            this.saveAnalysis(analysis);
            return analysis;
        } catch (error) {
            console.error('Error analyzing stress patterns:', error);
            throw error;
        }
    }

    public static saveAnalysis(analysis: StressAnalysis): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analysis));
        } catch (error) {
            console.error('Error saving stress analysis:', error);
        }
    }

    public static getLastAnalysis(): StressAnalysis | null {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error loading stress analysis:', error);
            return null;
        }
    }
}