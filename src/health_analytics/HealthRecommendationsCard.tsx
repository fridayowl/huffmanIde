import React, { useState, useEffect } from 'react';
import { Brain, Activity, Heart, Clock, AlignCenter, Loader2 } from 'lucide-react';

interface WorkPatterns {
    averageDailyHours: number;
    breaksFrequency: number;
    nightWorkFrequency: number;
    weekendWorkHours: number;
    longestStretch: number;
}

interface HealthRisks {
    eyeStrain: number;
    repetitiveStrain: number;
    stressLevel: number;
    sleepQuality: number;
    posturalIssues: number;
}

interface Preferences {
    exerciseType: string[];
    timePreference: 'morning' | 'afternoon' | 'evening';
    intensityPreference: string;
    existingConditions: string[];
    dietaryRestrictions: string[];
}

interface FormData {
    workPatterns: WorkPatterns;
    healthRisks: HealthRisks;
    preferences: Preferences;
}

interface Recommendations {
    [key: string]: string[] | string;
}

const defaultRecommendations: Recommendations = {
    immediate_actions: [
        "Take a 5-minute break every hour",
        "Do eye exercises to reduce strain",
        "Stretch your wrists and shoulders",
        "Adjust your monitor height and distance"
    ],
    exercise_recommendations: [
        "Start with 10 minutes of desk stretches",
        "Take short walking breaks between tasks",
        "Try standing desk intervals",
        "Practice simple yoga poses during breaks"
    ],
    ergonomic_adjustments: [
        "Ensure screen is at eye level",
        "Keep wrists straight while typing",
        "Maintain proper posture with back support",
        "Position keyboard and mouse at elbow height"
    ],
    lifestyle_modifications: [
        "Stay hydrated throughout the day",
        "Follow the 20-20-20 rule for eye care",
        "Take regular micro-breaks",
        "Maintain consistent sleep schedule"
    ]
};

const HealthRecommendationsCard = () => {
    const [recommendations, setRecommendations] = useState<Recommendations | null>(defaultRecommendations);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        workPatterns: {
            averageDailyHours: 8,
            breaksFrequency: 4,
            nightWorkFrequency: 2,
            weekendWorkHours: 4,
            longestStretch: 3
        },
        healthRisks: {
            eyeStrain: 50,
            repetitiveStrain: 50,
            stressLevel: 50,
            sleepQuality: 50,
            posturalIssues: 50
        },
        preferences: {
            exerciseType: ['stretching', 'walking'],
            timePreference: "morning",
            intensityPreference: "moderate",
            existingConditions: [],
            dietaryRestrictions: []
        }
    });

    useEffect(() => {
        const initializeFromMetrics = async () => {
            try {
                await fetchRecommendations();
            } catch (error) {
                console.error("Error initializing metrics:", error);
                setError("Unable to fetch personalized recommendations. Showing default suggestions.");
                setRecommendations(defaultRecommendations);
            }
        };

        initializeFromMetrics();
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "https://us-central1-fine-mile-444406-h9.cloudfunctions.net/generate_health_recommendations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ healthData: formData }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setRecommendations(data.recommendations);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setError("Unable to update recommendations. Showing previous suggestions.");
            setRecommendations(prev => prev || defaultRecommendations);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (category: keyof FormData, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleArrayInputChange = (category: keyof FormData, field: string, value: string) => {
        const values = value.split(',').map(v => v.trim()).filter(v => v);
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: values
            }
        }));
    };

    const getIcon = (category: string) => {
        switch (category) {
            case 'immediate_actions':
                return <Clock className="w-4 h-4" />;
            case 'exercise_recommendations':
                return <Activity className="w-4 h-4" />;
            case 'ergonomic_adjustments':
                return <AlignCenter className="w-4 h-4" />;
            case 'lifestyle_modifications':
                return <Heart className="w-4 h-4" />;
            default:
                return <Brain className="w-4 h-4" />;
        }
    };

    const formatCategory = (category: string): string => {
        return category
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="rounded-xl overflow-hidden bg-gradient-to-br from-purple-950 to-purple-900 shadow-lg">
            <div className="p-6 border-b border-white/10">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Brain className="w-6 h-6 text-purple-400" />
                            <h2 className="text-xl font-semibold text-white">Health Recommendations</h2>
                        </div>
                        {!loading && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="px-3 py-1.5 text-sm text-white rounded-lg transition-colors bg-white/10 hover:bg-white/20"
                            >
                                {showForm ? 'Hide Preferences' : 'Customize'}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Powered by</span>
                        <span className="text-xs font-medium text-purple-400">Gemini 1.5 Pro</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-2">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                        <p className="text-sm text-gray-400">Generating recommendations...</p>
                    </div>
                ) : showForm ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-purple-300">Additional Preferences</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Exercise Types (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.preferences.exerciseType.join(', ')}
                                        onChange={(e) => handleArrayInputChange('preferences', 'exerciseType', e.target.value)}
                                        className="w-full px-2 py-1 text-sm bg-white/10 rounded border border-white/20 text-white"
                                        placeholder="yoga, walking, stretching"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Time Preference</label>
                                    <select
                                        value={formData.preferences.timePreference}
                                        onChange={(e) => handleInputChange('preferences', 'timePreference', e.target.value)}
                                        className="w-full px-2 py-1 text-sm bg-white/10 rounded border border-white/20 text-white"
                                    >
                                        <option value="morning">Morning</option>
                                        <option value="afternoon">Afternoon</option>
                                        <option value="evening">Evening</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Existing Conditions (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.preferences.existingConditions.join(', ')}
                                        onChange={(e) => handleArrayInputChange('preferences', 'existingConditions', e.target.value)}
                                        className="w-full px-2 py-1 text-sm bg-white/10 rounded border border-white/20 text-white"
                                        placeholder="back pain, wrist strain"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={fetchRecommendations}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            Update Recommendations
                        </button>
                    </div>
                ) : recommendations ? (
                    <div className="space-y-4">
                        {error && (
                            <div className="text-yellow-400 text-sm mb-4 bg-yellow-400/10 p-2 rounded">
                                {error}
                            </div>
                        )}
                        {Object.entries(recommendations).map(([category, items]) => (
                            <div key={category} className="space-y-2">
                                <h3 className="text-sm font-medium text-purple-300 flex items-center gap-2">
                                    {getIcon(category)}
                                    {formatCategory(category)}
                                </h3>
                                <ul className="space-y-1">
                                    {Array.isArray(items) ? (
                                        items.map((item, index) => (
                                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                                <span className="text-purple-400">•</span>
                                                {item}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-300">{items}</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-4">
                            Based on your current health metrics. Click 'Customize' to add personal preferences.
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default HealthRecommendationsCard;