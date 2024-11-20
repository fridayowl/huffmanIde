import {
    Brain, FileCode, Heart, Target, Battery,
    Workflow, Coffee, Flame, LucideIcon
} from 'lucide-react';

interface Metric {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    description: string;
    impact: string;
    tips: string[];
    calculation: {
        formula: string;
        factors: string[];
        frequency: string;
    };
    bgColor: string;
    category: string;
    animation?: string;
}

export const healthMetrics: Metric[] = [
    {
        title: "Flow State",
        value: "92%",
        change: "In the Zone",
        icon: Brain,
        category: "Mental State",
        description: "You're in deep focus, with minimal context switching and optimal coding rhythm.",
        impact: "Flow state is your peak performance zone where coding feels effortless and time flies. It's when you produce your highest quality work with maximum efficiency.",
        calculation: {
            formula: "flowScore = (focusTime * 0.4) + (typingConsistency * 0.3) + (codeQuality * 0.3)",
            factors: [
                "Duration of uninterrupted coding",
                "Consistency in typing patterns",
                "Code complexity changes",
                "Frequency of context switches",
                "Time between commits"
            ],
            frequency: "Updated in real-time"
        },
        tips: [
            "Block notifications during deep work sessions",
            "Use noise-canceling headphones with ambient sounds",
            "Break large tasks into 25-minute focused sprints"
        ],
        bgColor: "bg-gradient-to-br from-indigo-950 to-indigo-900",
        animation: "animate-pulse"
    },
    {
        title: "Code Quality",
        value: "A+",
        change: "Excelling",
        icon: FileCode,
        category: "Performance",
        description: "Your code is well-structured, maintainable, and following best practices.",
        impact: "High-quality code reduces future debugging time, makes collaboration easier, and builds your reputation as a reliable developer.",
        calculation: {
            formula: "qualityScore = (complexity * 0.3) + (consistency * 0.3) + (testCoverage * 0.4)",
            factors: [
                "Cyclomatic complexity",
                "Code consistency metrics",
                "Test coverage percentage",
                "Documentation completeness",
                "Code review feedback"
            ],
            frequency: "Updated after each commit"
        },
        tips: [
            "Review your code before commits",
            "Write tests for critical functions",
            "Maintain consistent code style",
            "Document complex logic"
        ],
        bgColor: "bg-gradient-to-br from-emerald-950 to-emerald-900"
    },
    {
        title: "Stress Level",
        value: "Low",
        change: "Balanced",
        icon: Heart,
        category: "Health",
        description: "Your coding patterns show calm, methodical problem-solving.",
        impact: "Low stress levels improve decision-making, reduce bugs, and prevent burnout. It's essential for sustainable long-term performance.",
        calculation: {
            formula: "stressScore = 100 - (deletionRate * 0.3 + errorRate * 0.4 + contextSwitches * 0.3)",
            factors: [
                "Deletion frequency",
                "Error rate in code",
                "Context switching frequency",
                "Break pattern adherence",
                "Typing rhythm consistency"
            ],
            frequency: "Updated every 5 minutes"
        },
        tips: [
            "Take regular micro-breaks",
            "Practice deep breathing when stuck",
            "Break complex problems into smaller tasks",
            "Celebrate small wins"
        ],
        bgColor: "bg-gradient-to-br from-rose-950 to-rose-900"
    },
    {
        title: "Focus Score",
        value: "85%",
        change: "Peak Performance",
        icon: Target,
        category: "Productivity",
        description: "Deep, uninterrupted coding sessions with high engagement.",
        impact: "Strong focus leads to faster problem-solving, fewer bugs, and more efficient code writing. It's the foundation of productive development.",
        calculation: {
            formula: "focusScore = (activeTime * 0.4) + (sessionLength * 0.3) + (contextRetention * 0.3)",
            factors: [
                "Time spent actively coding",
                "Length of uninterrupted sessions",
                "Context retention between sessions",
                "Task completion rate",
                "Code complexity handling"
            ],
            frequency: "Updated every minute"
        },
        tips: [
            "Use the Pomodoro Technique (25min focus/5min break)",
            "Create a dedicated coding environment",
            "Keep a coding journal for difficult problems",
            "Schedule focused coding blocks"
        ],
        bgColor: "bg-gradient-to-br from-blue-950 to-blue-900"
    },
    {
        title: "Energy Level",
        value: "High",
        change: "Optimal",
        icon: Battery,
        category: "Health",
        description: "You're maintaining consistent productivity without burning out.",
        impact: "High energy levels ensure sustained coding quality and creativity throughout your day. It's crucial for tackling complex problems.",
        calculation: {
            formula: "energyScore = (activityLevel * 0.3) + (breakAdherence * 0.4) + (workPattern * 0.3)",
            factors: [
                "Coding activity patterns",
                "Break schedule adherence",
                "Work session distribution",
                "Task complexity variation",
                "Daily productivity curve"
            ],
            frequency: "Updated every 15 minutes"
        },
        tips: [
            "Stay hydrated during coding sessions",
            "Take short walks between tasks",
            "Maintain good posture",
            "Keep healthy snacks nearby"
        ],
        bgColor: "bg-gradient-to-br from-amber-950 to-amber-900"
    },
    {
        title: "Coding Rhythm",
        value: "75 WPM",
        change: "Smooth Flow",
        icon: Workflow,
        category: "Performance",
        description: "Your typing speed and code flow indicate natural, efficient development.",
        impact: "Good coding rhythm means you're translating thoughts to code efficiently, reducing the gap between planning and implementation.",
        calculation: {
            formula: "rhythmScore = (typingSpeed * 0.3) + (consistency * 0.4) + (errorRate * 0.3)",
            factors: [
                "Typing speed (WPM)",
                "Consistency in coding patterns",
                "Error correction speed",
                "Code completion rate",
                "IDE command usage"
            ],
            frequency: "Updated in real-time"
        },
        tips: [
            "Practice touch typing regularly",
            "Learn keyboard shortcuts",
            "Use code snippets for common patterns",
            "Master your IDE's features"
        ],
        bgColor: "bg-gradient-to-br from-cyan-950 to-cyan-900"
    },
   {
        title: "Break Balance",
        value: "45m",
        change: "Well-Rested",
        icon: Coffee,
        category: "Health",
        description: "You're taking adequate breaks to maintain mental freshness.",
        impact: "Strategic breaks prevent mental fatigue, reduce errors, and help maintain high performance throughout the day.",
        calculation: {
            formula: "breakScore = (frequency * 0.4) + (duration * 0.3) + (timing * 0.3)",
            factors: [
                "Break frequency",
                "Break duration",
                "Time between breaks",
                "Activity during breaks",
                "Return to work transition time"
            ],
            frequency: "Updated after each break"
        },
        tips: [
            "Follow the 20-20-20 rule for eye strain",
            "Do quick stretches during breaks",
            "Step away from screens regularly",
            "Practice mindful breathing"
        ],
        bgColor: "bg-gradient-to-br from-purple-950 to-purple-900"
    },
    {
        title: "Coding Streak",
        value: "2h 15m",
        change: "Personal Best",
        icon: Flame,
        category: "Achievement",
        description: "Your longest continuous productive coding session today.",
        impact: "Long, focused coding streaks show deep engagement and are often when breakthrough solutions happen.",
        calculation: {
            formula: "streakScore = (duration * 0.4) + (productivity * 0.3) + (quality * 0.3)",
            factors: [
                "Continuous coding time",
                "Code quality during streak",
                "Problem-solving efficiency",
                "Break timing optimization",
                "Focus maintenance"
            ],
            frequency: "Updated continuously during active sessions"
        },
        tips: [
            "Build up streak length gradually",
            "Prepare your environment before long sessions",
            "Keep water and snacks handy",
            "Document insights during breakthroughs"
        ],
        bgColor: "bg-gradient-to-br from-pink-950 to-pink-900",
        animation: "animate-pulse"
    },
    {
        title: "Cognitive Load",
        value: "Moderate",
        change: "Optimal",
        icon: Brain,
        category: "Mental State",
        description: "Your current mental workload and information processing capacity.",
        impact: "Maintaining optimal cognitive load helps prevent mental fatigue and ensures high-quality code production.",
        calculation: {
            formula: "cognitiveScore = 100 - (complexity * 0.4 + context * 0.3 + fatigue * 0.3)",
            factors: [
                "Code complexity level",
                "Number of active contexts",
                "Time since last break",
                "Error frequency",
                "Task switching rate"
            ],
            frequency: "Updated every 2 minutes"
        },
        tips: [
            "Break complex tasks into smaller chunks",
            "Use visual diagrams for complex logic",
            "Take notes during planning phase",
            "Limit simultaneous tasks"
        ],
        bgColor: "bg-gradient-to-br from-violet-950 to-violet-900"
    },
    {
        title: "Learning Rate",
        value: "High",
        change: "+15%",
        icon: Target,
        category: "Growth",
        description: "Your pattern of acquiring and applying new development knowledge.",
        impact: "A high learning rate accelerates skill development and keeps you current with evolving technologies.",
        calculation: {
            formula: "learningScore = (newPatterns * 0.4) + (implementation * 0.3) + (retention * 0.3)",
            factors: [
                "New pattern adoption rate",
                "Implementation success",
                "Knowledge retention",
                "Documentation creation",
                "Peer learning engagement"
            ],
            frequency: "Updated daily"
        },
        tips: [
            "Document new learnings immediately",
            "Implement new concepts in side projects",
            "Share knowledge with team members",
            "Review learning notes weekly"
        ],
        bgColor: "bg-gradient-to-br from-teal-950 to-teal-900"
    }
];

// Helper functions for metric calculations
export const calculateFlowState = (
    focusTime: number,
    typingConsistency: number,
    codeQuality: number
): number => {
    return (focusTime * 0.4) + (typingConsistency * 0.3) + (codeQuality * 0.3);
};

export const calculateStressLevel = (
    deletionRate: number,
    errorRate: number,
    contextSwitches: number
): number => {
    return 100 - (deletionRate * 0.3 + errorRate * 0.4 + contextSwitches * 0.3);
};

export const calculateCodingRhythm = (
    typingSpeed: number,
    consistency: number,
    errorRate: number
): number => {
    return (typingSpeed * 0.3) + (consistency * 0.4) + (errorRate * 0.3);
};

export const getMetricHistory = (metricTitle: string, days: number = 7) => {
    // Implement metric history retrieval logic here
    // This would typically fetch from your metrics storage
    return [];
};

export const getMetricInsights = (metricTitle: string) => {
    // Implement insights generation logic here
    // This would analyze patterns and provide recommendations
    return {
        trends: [],
        recommendations: [],
        warnings: []
    };
};

// Types for metric updates
export interface MetricUpdate {
    timestamp: number;
    value: number;
    factors: Record<string, number>;
}

export interface MetricHistory {
    title: string;
    updates: MetricUpdate[];
    averages: {
        daily: number;
        weekly: number;
        monthly: number;
    };
}

// Function to update metric values
export const updateMetricValue = (
    title: string,
    newValue: number,
    factors: Record<string, number>
) => {
    const update: MetricUpdate = {
        timestamp: Date.now(),
        value: newValue,
        factors
    };
    
    // Implement storage and notification logic here
    return update;
};

export default healthMetrics;