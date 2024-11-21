import { useState, useEffect } from 'react';
import { TimeMetricsTracker } from './timeMetricsTracker';

export interface SessionMetric {
    time: string;
    duration: number;
    activeTime: number;
}

export const useSessionMetrics = () => {
    const [sessionData, setSessionData] = useState<SessionMetric[]>([]);

    useEffect(() => {
        const metrics = TimeMetricsTracker.getDailyMetrics();
        if (!metrics) return;

        const formattedData = metrics.metrics.map(session => ({
            time: new Date(session.sessionStart).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
            }),
            duration: Math.round(session.sessionEnd ? 
                (session.sessionEnd - session.sessionStart) / (1000 * 60) : 0),
            activeTime: Math.round(session.activeEditingTime / (1000 * 60))
        }));

        setSessionData(formattedData);
    }, []);

    return sessionData;
};