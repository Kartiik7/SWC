import React, { useState } from 'react';
import { Bell, Eye, ShieldCheck, Moon } from 'lucide-react';

const UserSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    privacy: false,
    twoFactor: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      key: 'notifications',
      title: 'Push Notifications',
      description: 'Receive alerts when booking starts, and reminders of upcoming shows.',
      icon: Bell
    },
    {
      key: 'darkMode',
      title: 'Dark Mode Theme',
      description: 'Switch application color palette between light and dark mode.',
      icon: Moon
    },
    {
      key: 'privacy',
      title: 'Privacy Sharing',
      description: 'Allow sharing of watch history and rating analytics on reviews.',
      icon: Eye
    },
    {
      key: 'twoFactor',
      title: 'Enhanced Security (2FA)',
      description: 'Enforce two-factor passcode authentication during login credentials.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">Account Settings</h1>
        <p className="text-xs text-gray-500">Configure application toggles and privacy settings</p>
      </div>

      <div className="bg-brand-card border border-gray-800 rounded-2xl divide-y divide-gray-800">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = settings[sec.key];

          return (
            <div key={sec.key} className="p-6 flex items-center justify-between gap-6 hover:bg-gray-800/10 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-gray-900 border border-gray-800 text-brand-accent rounded-lg flex-shrink-0 mt-0.5">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white leading-normal">{sec.title}</h3>
                  <p className="text-xs text-gray-500 leading-normal max-w-md">{sec.description}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(sec.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-brand-accent' : 'bg-gray-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSettings;
