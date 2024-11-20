import { TimeMetricsTracker } from './timeMetricsTracker';
import { CodingMentalHealthTracker } from './codingMentalHealthTracker';

export interface HealthMetricResult {
    value: string | number;
    change: string;
    trend?: 'up' | 'down' | 'stable';
    raw?: number;
    details?: Record<string, number>;
}

export class HealthMetricsService {
    private static readonly METRICS_STORAGE_KEY = 'health_metrics_history';
    private static readonly UPDATE_INTERVAL = 60000; // 1 minute

    private static calculateFlowState(): HealthMetricResult {
        const mentalMetrics = CodingMentalHealthTracker.getDailyMetrics();
        const timeMetrics = TimeMetricsTracker.getDailyMetrics();

        if (!mentalMetrics || !timeMetrics) {
            return { value: "N/A", change: "No Data" };
        }

        // Calculate flow score based on mental metrics and coding patterns
        const flowFactors = {
            focusTime: timeMetrics.totalCodingTime / (timeMetrics.totalCodingTime + timeMetrics.totalBreakTime),
            typingConsistency: mentalMetrics.metrics.reduce((acc, m) =>
                acc + (m.patterns.typingSpeed / Math.max(...mentalMetrics.metrics.map(x => x.patterns.typingSpeed))), 0
            ) / mentalMetrics.metrics.length,
            errorRate: 1 - (mentalMetrics.metrics.reduce((acc, m) => acc + m.patterns.errorRate, 0) / mentalMetrics.metrics.length)
        };

        const flowScore = (
            (flowFactors.focusTime * 0.4) +
            (flowFactors.typingConsistency * 0.3) +
            (flowFactors.errorRate * 0.3)
        ) * 100;

        const previousFlow = this.getPreviousMetricValue('flowState');

        return {
            value: `${flowScore.toFixed(1)}%`,
            change: this.calculateChange(flowScore, previousFlow),
            trend: this.calculateTrend(flowScore, previousFlow),
            raw: flowScore,
            details: flowFactors
        };
    }

    private static calculateCodeQuality(): HealthMetricResult {
        const mentalMetrics = CodingMentalHealthTracker.getDailyMetrics();

        if (!mentalMetrics) {
            return { value: "N/A", change: "No Data" };
        }

        // Calculate code quality based on complexity and error patterns
        const qualityFactors = {
            complexity: mentalMetrics.metrics.reduce((acc, m) =>
                acc + (1 - (m.patterns.codeComplexity / 10)), 0) / mentalMetrics.metrics.length,
            errorRate: 1 - (mentalMetrics.metrics.reduce((acc, m) =>
                acc + m.patterns.errorRate, 0) / mentalMetrics.metrics.length),
            consistentPatterns: mentalMetrics.metrics.reduce((acc, m) =>
                acc + (m.patterns.typingSpeed > 30 ? 1 : 0), 0) / mentalMetrics.metrics.length
        };

        const qualityScore = (
            (qualityFactors.complexity * 0.4) +
            (qualityFactors.errorRate * 0.4) +
            (qualityFactors.consistentPatterns * 0.2)
        ) * 100;

        const grade = this.calculateGrade(qualityScore);
        const previousQuality = this.getPreviousMetricValue('codeQuality');

        return {
            value: grade,
            change: this.calculateChange(qualityScore, previousQuality),
            trend: this.calculateTrend(qualityScore, previousQuality),
            raw: qualityScore,
            details: qualityFactors
        };
    }

    private static calculateFocusScore(): HealthMetricResult {
        const timeMetrics = TimeMetricsTracker.getDailyMetrics();
        const mentalMetrics = CodingMentalHealthTracker.getDailyMetrics();

        if (!timeMetrics || !mentalMetrics) {
            return { value: "N/A", change: "No Data" };
        }

        const focusFactors = {
            sessionLength: Math.min(timeMetrics.averageCodingStreak / (30 * 60 * 1000), 1), // normalized to 30-minute sessions
            continuousWork: timeMetrics.totalCodingTime / (timeMetrics.totalCodingTime + timeMetrics.totalBreakTime),
            mentalClarity: mentalMetrics.metrics.reduce((acc, m) =>
                acc + (1 - m.patterns.pauseFrequency), 0) / mentalMetrics.metrics.length
        };

        const focusScore = (
            (focusFactors.sessionLength * 0.3) +
            (focusFactors.continuousWork * 0.4) +
            (focusFactors.mentalClarity * 0.3)
        ) * 100;

        const previousFocus = this.getPreviousMetricValue('focusScore');

        return {
            value: `${focusScore.toFixed(1)}%`,
            change: this.calculateChange(focusScore, previousFocus),
            trend: this.calculateTrend(focusScore, previousFocus),
            raw: focusScore,
            details: focusFactors
        };
    }

    private static calculateCodingRhythm(): HealthMetricResult {
        const mentalMetrics = CodingMentalHealthTracker.getDailyMetrics();

        if (!mentalMetrics) {
            return { value: "N/A", change: "No Data" };
        }

        // Calculate average WPM from typing speed patterns
        const typingSpeeds = mentalMetrics.metrics.map(m => m.patterns.typingSpeed);
        const averageWPM = typingSpeeds.reduce((acc, speed) => acc + speed, 0) / typingSpeeds.length;

        const previousWPM = this.getPreviousMetricValue('codingRhythm');

        return {
            value: `${Math.round(averageWPM)} WPM`,
            change: this.calculateChange(averageWPM, previousWPM),
            trend: this.calculateTrend(averageWPM, previousWPM),
            raw: averageWPM,
            details: {
                consistency: typingSpeeds.reduce((acc, speed) =>
                    acc + (Math.abs(speed - averageWPM) < 10 ? 1 : 0), 0) / typingSpeeds.length
            }
        };
    }

    private static calculateCodingStreak(): HealthMetricResult {
        const timeMetrics = TimeMetricsTracker.getDailyMetrics();

        if (!timeMetrics) {
            return { value: "N/A", change: "No Data" };
        }

        const longestStreak = timeMetrics.longestCodingStreak;
        const previousStreak = this.getPreviousMetricValue('codingStreak');

        return {
            value: this.formatDuration(longestStreak),
            change: this.calculateChange(longestStreak, previousStreak),
            trend: this.calculateTrend(longestStreak, previousStreak),
            raw: longestStreak,
            details: {
                averageStreak: timeMetrics.averageCodingStreak,
                totalSessions: timeMetrics.totalSessions
            }
        };
    }

    // Utility methods
    private static calculateGrade(score: number): string {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B+';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        return 'D';
    }

    private static formatDuration(ms: number): string {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    private static calculateChange(current: number, previous: number | null): string {
        if (previous === null) return 'No Previous Data';

        const difference = current - previous;
        const percentChange = (difference / previous) * 100;

        if (Math.abs(percentChange) < 1) return 'Stable';

        const sign = percentChange > 0 ? '+' : '';
        return `${sign}${percentChange.toFixed(1)}%`;
    }

    private static calculateTrend(current: number, previous: number | null): 'up' | 'down' | 'stable' {
        if (previous === null) return 'stable';
        if (current > previous * 1.05) return 'up';
        if (current < previous * 0.95) return 'down';
        return 'stable';
    }

    private static getPreviousMetricValue(metricName: string): number | null {
        try {
            const history = localStorage.getItem(this.METRICS_STORAGE_KEY);
            if (!history) return null;

            const metrics = JSON.parse(history);
            const previousDay = new Date();
            previousDay.setDate(previousDay.getDate() - 1);
            const previousDayKey = previousDay.toISOString().split('T')[0];

            return metrics[previousDayKey]?.[metricName]?.raw ?? null;
        } catch (error) {
            console.error('Error getting previous metric value:', error);
            return null;
        }
    }

    private static saveMetricHistory(metrics: Record<string, HealthMetricResult>): void {
        try {
            const history = localStorage.getItem(this.METRICS_STORAGE_KEY);
            const metricsHistory = history ? JSON.parse(history) : {};

            const today = new Date().toISOString().split('T')[0];
            metricsHistory[today] = metrics;

            localStorage.setItem(this.METRICS_STORAGE_KEY, JSON.stringify(metricsHistory));
        } catch (error) {
            console.error('Error saving metric history:', error);
        }
    }

    public static calculateAllMetrics(): Record<string, HealthMetricResult> {
        const metrics = {
            flowState: this.calculateFlowState(),
            codeQuality: this.calculateCodeQuality(),
            focusScore: this.calculateFocusScore(),
            codingRhythm: this.calculateCodingRhythm(),
            codingStreak: this.calculateCodingStreak()
        };

        this.saveMetricHistory(metrics);
        return metrics;
    }
}