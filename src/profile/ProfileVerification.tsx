import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Mail, Phone, Github, Check,
    AlertCircle, Loader2, ExternalLink,
    Users, Star
} from 'lucide-react';

interface VerificationStatus {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isIdentityVerified: boolean;
    isCommunityVerified: boolean;
    verificationDate?: string;
}

interface PersonalInfo {
    name: string;
    email: string;
    phone?: string;
    location: string;
    timezone: string;
    bio: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        website?: string;
    };
}

interface ProfileVerificationProps {
    verification: VerificationStatus;
    personal: PersonalInfo;
}

type VerificationType = 'email' | 'phone' | 'github';

const ProfileVerification: React.FC<ProfileVerificationProps> = ({ verification, personal }) => {
    const [isVerifying, setIsVerifying] = useState<Record<VerificationType, boolean>>({
        email: false,
        phone: false,
        github: false
    });

    const handleVerification = async (type: VerificationType) => {
        setIsVerifying(prev => ({ ...prev, [type]: true }));
        // Simulate verification process
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsVerifying(prev => ({ ...prev, [type]: false }));
        alert('Verification feature will be available in the full version');
    };

    const getVerificationStatus = (type: VerificationType): boolean => {
        switch (type) {
            case 'email':
                return verification.isEmailVerified;
            case 'phone':
                return verification.isPhoneVerified;
            case 'github':
                return verification.isIdentityVerified; // Using identity verified for GitHub
            default:
                return false;
        }
    };

    const getValue = (type: VerificationType): string | undefined => {
        switch (type) {
            case 'email':
                return personal.email;
            case 'phone':
                return personal.phone;
            case 'github':
                return personal.socialLinks.github;
            default:
                return undefined;
        }
    };

    const VerificationCard: React.FC<{
        type: VerificationType;
        title: string;
        icon: React.ReactNode;
        iconColor: string;
        buttonColor: string;
    }> = ({ type, title, icon, iconColor, buttonColor }) => {
        const value = getValue(type);
        const isVerified = getVerificationStatus(type);

        return (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`text-${iconColor}`}>{icon}</div>
                        <div>
                            <h3 className="text-lg font-medium text-white">{title}</h3>
                            <p className="text-gray-400">{value || 'Not provided'}</p>
                        </div>
                    </div>
                    {isVerified ? (
                        <div className="flex items-center gap-2 text-green-400">
                            <Check className="w-5 h-5" />
                            <span>Verified</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleVerification(type)}
                            disabled={isVerifying[type] || !value}
                            className={`px-4 py-2 rounded-lg bg-${buttonColor}-500/20 text-${buttonColor}-400 
                                hover:bg-${buttonColor}-500/30 disabled:opacity-50 disabled:cursor-not-allowed 
                                flex items-center gap-2`}
                        >
                            {isVerifying[type] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                `Verify ${title}`
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const BenefitCard: React.FC<{
        icon: React.ReactNode;
        iconColor: string;
        title: string;
        description: string;
    }> = ({ icon, iconColor, title, description }) => (
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className={`w-6 h-6 ${iconColor} mb-2`}>{icon}</div>
            <h4 className="font-medium text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-lg bg-indigo-500/20">
                    <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Profile Verification</h2>
                    <p className="text-gray-400">Verify your account to unlock additional features</p>
                </div>
            </div>

            {/* Verification Cards */}
            <div className="grid gap-6">
                <VerificationCard
                    type="email"
                    title="Email Address"
                    icon={<Mail className="w-5 h-5" />}
                    iconColor="blue-400"
                    buttonColor="blue"
                />

                <VerificationCard
                    type="phone"
                    title="Phone Number"
                    icon={<Phone className="w-5 h-5" />}
                    iconColor="green-400"
                    buttonColor="green"
                />

                <VerificationCard
                    type="github"
                    title="GitHub Account"
                    icon={<Github className="w-5 h-5" />}
                    iconColor="purple-400"
                    buttonColor="purple"
                />
            </div>

            {/* Benefits Section */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-4">Verification Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <BenefitCard
                        icon={<Shield />}
                        iconColor="text-indigo-400"
                        title="Enhanced Trust"
                        description="Build trust within the community with verified credentials"
                    />
                    <BenefitCard
                        icon={<Users />}
                        iconColor="text-green-400"
                        title="Priority Matching"
                        description="Get matched with other verified members first"
                    />
                    <BenefitCard
                        icon={<Star />}
                        iconColor="text-amber-400"
                        title="Additional Features"
                        description="Unlock premium features and community perks"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileVerification;