import React from 'react';
import { Loader2 } from 'lucide-react';
import { PersonalInfo } from './profile-types';

export const LoadingScreen: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="mt-4 text-gray-400">Loading your profile...</p>
        </div>
    </div>
);

interface NavigationHeaderProps {
    sections: {
        id: string;
        label: string;
        icon: React.ElementType;
    }[];
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
    sections,
    activeSection,
    onSectionChange
}) => (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => onSectionChange(section.id)}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                                ${activeSection === section.id
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            <section.icon className="w-4 h-4 mr-2" />
                            {section.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </nav>
);

interface SaveBarProps {
    onSave: () => void;
    isSaving: boolean;
}

export const SaveBar: React.FC<SaveBarProps> = ({ onSave, isSaving }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    You have unsaved changes
                </p>
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${isSaving
                            ? 'bg-indigo-500/50 text-indigo-300'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                >
                    {isSaving ? (
                        <span className="flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </span>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </div>
    </div>
);

interface PersonalInformationProps {
    data: PersonalInfo;
    onUpdate: (data: PersonalInfo) => void;
}

export const PersonalInformation: React.FC<PersonalInformationProps> = ({
    data,
    onUpdate
}) => {
    const handleChange = (field: keyof PersonalInfo, value: any) => {
        onUpdate({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                    Personal Information
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Bio
                        </label>
                        <textarea
                            value={data.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-md text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">
                    Experience
                </h3>
                {data.experience.map((exp, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-white font-medium">{exp.title}</h4>
                                <p className="text-gray-400">{exp.company}</p>
                            </div>
                            <span className="text-sm text-gray-400">{exp.duration}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};