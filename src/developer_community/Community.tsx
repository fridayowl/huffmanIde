import React from 'react';
import NavBarMinimal from '../NavBar';
import LiveUsersMap from './LiveUsersMap';

export default function Community() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <NavBarMinimal />

            {/* Welcome Banner */}
            <div className="container mx-auto px-6 py-8">
                <div className="text-center space-y-4">
                    <div className="inline-block px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                        <span className="text-indigo-400 text-sm font-medium">Global Developer Community</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white">
                        Connect with Developers Worldwide
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Join our thriving community of developers. Collaborate, share knowledge, and build together.
                    </p>
                </div>
            </div>

            {/* Live Users Map */}
            <div className="container mx-auto px-6 pb-12">
                <LiveUsersMap />
            </div>
        </div>
    );
}