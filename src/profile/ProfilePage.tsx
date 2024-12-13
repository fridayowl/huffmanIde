import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, Globe, Clock, Calendar, Check, AlertCircle,
    Briefcase, GraduationCap, User, MapPin, Github, Linkedin,
    Settings, Bell, Shield, Users
} from 'lucide-react';
import { getDummyData, type ProfileData } from './profile-types';
import CharacterSelection from './CharacterSelection';
import ProfileVerification from './ProfileVerification';
import MatchingPreferences from './MatchingPreferences';
import CommunityMetrics from './CommunityMetrics';
import { LoadingScreen, NavigationHeader, PersonalInformation, SaveBar } from './components';
import ProfileOverview from './ProfileOverview';
import NavBarMinimal from '../NavBar';
 
const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('character');
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Simulated data loading
        setTimeout(() => {
            setProfileData(getDummyData());
            setIsLoading(false);
        }, 1000);
    }, []);

    const sections = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'character', label: 'Character', icon: User },
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'verification', label: 'Verification', icon: Shield },
        { id: 'matching', label: 'Matching', icon: Globe },
        { id: 'community', label: 'Community', icon: Users }
    ];

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setHasChanges(false);
    };

    if (isLoading || !profileData) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-[#0D1117]">
            {/* Sticky NavBar */}
            <div className="sticky top-0 z-50 bg-[#0D1117] border-b border-gray-800">
                <NavBarMinimal />
            </div>

            {/* Sticky Section Navigation */}
            <div className="sticky top-16 z-40 bg-[#0D1117] border-b border-gray-800">
                <div className="container mx-auto">
                    <NavigationHeader
                        sections={sections}
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                    />
                </div>
            </div>

            <main className="container mx-auto px-4 py-6">
                <AnimatePresence mode="wait">
                    {activeSection === 'overview' && (
                        <ProfileOverview profileData={profileData} />
                    )}
                    {activeSection === 'character' && (
                        <CharacterSelection
                            character={profileData.character}
                            onUpdate={(char: any) => {
                                setProfileData(prev => ({ ...prev!, character: char }));
                                setHasChanges(true);
                            }}
                        />
                    )}

                    {activeSection === 'personal' && (
                        <PersonalInformation
                            data={profileData.personal}
                            onUpdate={(personal) => {
                                setProfileData(prev => ({ ...prev!, personal }));
                                setHasChanges(true);
                            }}
                        />
                    )}

                    {activeSection === 'verification' && (
                        <ProfileVerification
                            verification={profileData.verification}
                            personal={profileData.personal}
                        />
                    )}

                    {activeSection === 'matching' && (
                        <MatchingPreferences
                            preferences={profileData.matchingPreferences}
                            onUpdate={(prefs: any) => {
                                setProfileData(prev => ({
                                    ...prev!,
                                    matchingPreferences: prefs
                                }));
                                setHasChanges(true);
                            }}
                        />
                    )}

                    {activeSection === 'community' && (
                        <CommunityMetrics
                            stats={profileData.communityStats}
                            character={profileData.character}
                        />
                    )}
                </AnimatePresence>

                {hasChanges && (
                    <SaveBar
                        onSave={handleSave}
                        isSaving={isSaving}
                    />
                )}
            </main>
        </div>
    );
};

export default ProfilePage;