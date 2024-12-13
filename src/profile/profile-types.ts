// Basic user information types
interface BasicInfo {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    joinDate: string;
}

// Character type definitions
export interface Character {
    type: 'Developer' | 'Mentor' | 'Learner' | 'TeamLead' | 'CodeReviewer' | 'HealthGuardian';
    level: number;
    progress: number;
    experience: number;
    badges: string[];
    specializations: string[];
    activeTime: 'Day' | 'Night' | 'Flexible';
    strengths: string[];
    currentGoals: string[];
}

// Personal information types
export interface PersonalInfo {
    name: string;
    email: string;
    phone?: string;
    location: string;
    timezone: string;
    bio: string;
    skills: string[];
    availability: {
        weekdays: boolean;
        weekends: boolean;
        preferredHours: string[];
    };
    experience: {
        title: string;
        company: string;
        duration: string;
        highlights: string[];
    }[];
    education: {
        degree: string;
        institution: string;
        year: string;
        field: string;
    }[];
    certifications: {
        name: string;
        issuer: string;
        year: string;
        url?: string;
    }[];
    languages: {
        language: string;
        proficiency: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
    }[];
    socialLinks: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
        stackoverflow?: string;
    };
}

// Verification status types
export interface VerificationStatus {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isIdentityVerified: boolean;
    isCommunityVerified: boolean;
    verificationDate?: string;
    verificationLevel: 'None' | 'Basic' | 'Advanced' | 'Complete';
    lastVerificationUpdate: string;
    verifiedBadges: string[];
}

// Matching preferences types
export interface MatchingPreferences {
    preferredCharacters: string[];
    skillsInterest: string[];
    collaborationTypes: string[];
    timeOverlap: number;
    mentorshipType: 'mentor' | 'mentee' | 'both' | 'none';
    roles: string[];
    skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    availability: {
        timezone: string;
        preferredHours: string[];
        timeCommitment: 'Casual' | 'Part-time' | 'Full-time';
    };
    interests: string[];
    projectTypes: string[];
    teamSize: number;
    remotePreference: 'Remote' | 'Hybrid' | 'Local' | 'Any';
    communicationPreference: {
        primaryLanguage: string;
        platforms: string[];
        responseTime: 'Immediate' | 'SameDay' | 'Within48Hours';
    };
    learningGoals: string[];
}

// Community statistics types
export interface CommunityStats {
    reputation: number;
    contributions: number;
    connections: number;
    projectsCompleted: number;
    mentorshipHours: number;
    helpScore: number;
    reviewScore: number;
    endorsements: {
        skill: string;
        count: number;
        endorsers: string[];
    }[];
    activity: {
        daily: number;
        weekly: number;
        monthly: number;
        streak: number;
    };
    impact: {
        peopleHelped: number;
        codeReviewed: number;
        projectsContributed: number;
    };
}

// Health metrics types
export interface HealthMetrics {
    workLifeBalance: number;
    stressLevel: number;
    productiveHours: string[];
    breakPatterns: {
        frequency: number;
        duration: number;
        lastBreak: string;
    };
    wellnessGoals: string[];
    activityLevel: 'Low' | 'Moderate' | 'High';
}

// Combined profile data interface
export interface ProfileData {
    basic: BasicInfo;
    character: Character;
    personal: PersonalInfo;
    verification: VerificationStatus;
    matchingPreferences: MatchingPreferences;
    communityStats: CommunityStats;
    healthMetrics: HealthMetrics;
    settings: {
        notifications: boolean;
        emailPreferences: string[];
        privacyLevel: 'Public' | 'Private' | 'Community';
        twoFactorEnabled: boolean;
    };
}

// Function to generate dummy profile data
export const getDummyData = (): ProfileData => ({
    basic: {
        id: 'usr_123456',
        username: 'techdev123',
        email: 'dev@example.com',
        avatar: '/default-avatar.png',
        joinDate: '2024-01-01'
    },
    character: {
        type: 'Developer',
        level: 3,
        progress: 75,
        experience: 2500,
        badges: ['Code Quality', 'Team Player', 'Quick Learner'],
        specializations: ['Frontend', 'React', 'TypeScript'],
        activeTime: 'Day',
        strengths: ['Problem Solving', 'UI Design', 'Code Organization'],
        currentGoals: ['Master React', 'Learn GraphQL', 'Contribute to Open Source']
    },
    personal: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
        bio: 'Full-stack developer passionate about creating clean, efficient code.',
        skills: ['React', 'TypeScript', 'Node.js', 'Python'],
        availability: {
            weekdays: true,
            weekends: false,
            preferredHours: ['9:00-17:00']
        },
        experience: [{
            title: 'Senior Developer',
            company: 'Tech Corp',
            duration: '2020-Present',
            highlights: ['Led team of 5', 'Improved performance by 40%']
        }],
        education: [{
            degree: 'BS Computer Science',
            institution: 'Tech University',
            year: '2019',
            field: 'Software Engineering'
        }],
        certifications: [{
            name: 'AWS Certified Developer',
            issuer: 'Amazon',
            year: '2023'
        }],
        languages: [{
            language: 'English',
            proficiency: 'Native'
        }],
        socialLinks: {
            github: 'github.com/johndoe',
            linkedin: 'linkedin.com/in/johndoe'
        }
    },
    verification: {
        isEmailVerified: true,
        isPhoneVerified: false,
        isIdentityVerified: true,
        isCommunityVerified: true,
        verificationDate: '2024-01-15',
        verificationLevel: 'Advanced',
        lastVerificationUpdate: '2024-01-15',
        verifiedBadges: ['Email', 'Identity']
    },
    matchingPreferences: {
        preferredCharacters: ['Developer', 'Mentor'],
        skillsInterest: ['React', 'TypeScript', 'Node.js'],
        collaborationTypes: ['pair', 'mentor'],
        timeOverlap: 4,
        mentorshipType: 'both',
        roles: ['Frontend Developer', 'Full-stack Developer'],
        skillLevel: 'Advanced',
        availability: {
            timezone: 'America/Los_Angeles',
            preferredHours: ['9:00-17:00'],
            timeCommitment: 'Full-time'
        },
        interests: ['Web Development', 'UI/UX', 'Performance Optimization'],
        projectTypes: ['Web Applications', 'Mobile Apps'],
        teamSize: 5,
        remotePreference: 'Remote',
        communicationPreference: {
            primaryLanguage: 'English',
            platforms: ['Slack', 'Discord', 'Email'],
            responseTime: 'SameDay'
        },
        learningGoals: ['Advanced React Patterns', 'System Design', 'Team Leadership']
    },
    communityStats: {
        reputation: 850,
        contributions: 123,
        connections: 45,
        projectsCompleted: 12,
        mentorshipHours: 25,
        helpScore: 92,
        reviewScore: 88,
        endorsements: [{
            skill: 'React',
            count: 15,
            endorsers: ['user1', 'user2', 'user3']
        }],
        activity: {
            daily: 5,
            weekly: 25,
            monthly: 100,
            streak: 7
        },
        impact: {
            peopleHelped: 50,
            codeReviewed: 100,
            projectsContributed: 15
        }
    },
    healthMetrics: {
        workLifeBalance: 85,
        stressLevel: 45,
        productiveHours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        breakPatterns: {
            frequency: 4,
            duration: 15,
            lastBreak: '2024-01-20T12:00:00Z'
        },
        wellnessGoals: ['Regular Breaks', 'Stress Management', 'Better Posture'],
        activityLevel: 'Moderate'
    },
    settings: {
        notifications: true,
        emailPreferences: ['matches', 'messages', 'updates'],
        privacyLevel: 'Community',
        twoFactorEnabled: true
    }
});