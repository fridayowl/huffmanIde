import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SessionMetric } from './useSessionMetrics';

interface SessionGraphProps {
    data: SessionMetric[];
}

export const SessionGraph: React.FC<SessionGraphProps> = ({ data }) => {
    if (!data.length) return null;

    return (
        <div className="mt-4 h-32">
            <div className="text-xs text-gray-400 mb-2">Today's Coding Sessions</div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis
                        dataKey="time"
                        stroke="#6B7280"
                        fontSize={10}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#6B7280"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        label={{
                            value: 'Minutes',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fill: '#6B7280', fontSize: 10 }
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '0.375rem',
                            fontSize: '12px'
                        }}
                        labelStyle={{ color: '#9CA3AF' }}
                        formatter={(value: number) => [`${value} min`, 'Duration']}
                    />
                    <Line
                        type="monotone"
                        dataKey="activeTime"
                        stroke="#EC4899"
                        strokeWidth={2}
                        dot={{ fill: '#EC4899', strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};