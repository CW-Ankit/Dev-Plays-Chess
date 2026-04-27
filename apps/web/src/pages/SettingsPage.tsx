import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Save, Palette, Layout } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    name: user?.name || '',
    theme: user?.theme || 'classic',
    preferredColor: user?.preferredColor || 'random',
  });
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Settings className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Account Settings</h2>
      </div>

      <div className="grid gap-6">
        <div className="bg-[#161b22] border border-[#30363D] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-6">
            <User className="w-4 h-4" /> Profile Information
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-xs text-[#8B949E]">Display Name</label>
              <input 
                type="text" 
                value={settings.name}
                onChange={(e) => setSettings({...settings, name: e.target.value})}
                className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363D] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-6">
            <Palette className="w-4 h-4" /> Game Preferences
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <label className="text-xs text-[#8B949E]">Preferred Side</label>
              <select 
                value={settings.preferredColor}
                onChange={(e) => setSettings({...settings, preferredColor: e.target.value})}
                className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="random">Random</option>
                <option value="white">White</option>
                <option value="black">Black</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-[#8B949E]">Visual Theme</label>
              <select 
                value={settings.theme}
                onChange={(e) => setSettings({...settings, theme: e.target.value})}
                className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="classic">Classic Grey</option>
                <option value="wood">Traditional Wood</option>
                <option value="dark">Cyber Dark</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className={`text-sm ${message.includes('Error') ? 'text-rose-400' : 'text-emerald-400'}`}>
            {message}
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-emerald-600/20"
          >
            {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
