import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, MessageCircle } from 'lucide-react';
import L from 'leaflet';

interface User {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        country: string;
    };
    isOnline: boolean;
    message?: string;
    lastSeen?: string;
}

// Custom marker icon for online users
const onlineIcon = L.divIcon({
    className: 'custom-marker',
    html: `
    <div class="relative">
      <div class="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute"></div>
      <div class="w-3 h-3 bg-emerald-500 rounded-full relative"></div>
    </div>
  `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

// Custom marker icon for offline users
const offlineIcon = L.divIcon({
    className: 'custom-marker',
    html: `
    <div class="w-3 h-3 bg-red-500 rounded-full relative"></div>
  `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const LiveUsersMap: React.FC = () => {
    const [users] = useState<User[]>([
        {
            id: "1",
            name: "John Doe",
            location: {
                lat: 40.7128,
                lng: -74.0060,
                country: "USA"
            },
            isOnline: true,
            message: "Working on new features",
            lastSeen: "Now"
        },
        {
            id: "2",
            name: "Jane Smith",
            location: {
                lat: 51.5074,
                lng: -0.1278,
                country: "UK"
            },
            isOnline: false,
            lastSeen: "2 hours ago"
        },
        {
            id: "3",
            name: "Dev Kumar",
            location: {
                lat: 28.6139,
                lng: 77.2090,
                country: "India"
            },
            isOnline: true,
            message: "Code review in progress",
            lastSeen: "Now"
        },
        {
            id: "4",
            name: "Alice Chen",
            location: {
                lat: 31.2304,
                lng: 121.4737,
                country: "China"
            },
            isOnline: true,
            message: "Debugging production issue",
            lastSeen: "Now"
        },
        {
            id: "5",
            name: "Carlos Rodriguez",
            location: {
                lat: -33.8688,
                lng: 151.2093,
                country: "Australia"
            },
            isOnline: false,
            lastSeen: "1 hour ago"
        }
    ]);

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Stats Header */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {users.filter(u => u.isOnline).length} Developers Online
                        </h2>
                        <p className="text-gray-400">
                            Across {new Set(users.map(u => u.location.country)).size} Countries
                        </p>
                    </div>

                    {/* Status Legend */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-gray-300 text-sm">Online</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <span className="text-gray-300 text-sm">Offline</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="w-full h-[calc(100vh-160px)]">
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    className="w-full h-full"
                    zoomControl={false}
                    attributionControl={false}
                    style={{ background: '#1a202c' }}
                >
                    {/* Dark theme map tiles */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* User Markers */}
                    {users.map(user => (
                        <Marker
                            key={user.id}
                            position={[user.location.lat, user.location.lng]}
                            icon={user.isOnline ? onlineIcon : offlineIcon}
                        >
                            <Popup className="custom-popup">
                                <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700 min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                        <span className="font-medium">{user.name}</span>
                                    </div>

                                    <div className="space-y-1 text-sm">
                                        <p className="text-gray-300">📍 {user.location.country}</p>
                                        <p className="text-gray-400">
                                            🕒 {user.isOnline ? "Active now" : `Last seen ${user.lastSeen}`}
                                        </p>
                                        {user.message && (
                                            <div className="mt-2 flex items-center gap-2 text-gray-300">
                                                <MessageCircle size={12} />
                                                <p>{user.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Stats Footer */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 border-t border-gray-700">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <p className="text-white">
                        {users.filter(u => u.isOnline).length} / {users.length} Developers Active
                    </p>
                    <div className="flex gap-4">
                        {Array.from(new Set(users.map(u => u.location.country))).map(country => (
                            <div key={country} className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm">{country}</span>
                                <div className={`w-2 h-2 rounded-full ${users.some(u => u.location.country === country && u.isOnline)
                                        ? 'bg-emerald-500'
                                        : 'bg-red-500'
                                    }`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom styles for Leaflet */}
            <style>{`
        .leaflet-container {
          background-color: #1a202c;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
        }
        
        .custom-popup .leaflet-popup-tip {
          display: none;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        
        .custom-marker {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
        </div>
    );
};

export default LiveUsersMap;