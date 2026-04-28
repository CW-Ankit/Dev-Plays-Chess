"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Palette, Moon, Sun, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactor: false,
    theme: "Cyber Dark",
    preferredColor: "White",
    latencyMode: "Low",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Config</h1>
        <p className="text-text-secondary">Optimize your system parameters and user preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-secondary border border-border space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-accent" />
              Security & Access
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Auth</p>
                <p className="text-xs text-text-secondary">Add an extra layer of security to your account.</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, twoFactor: !settings.twoFactor})}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.twoFactor ? 'bg-accent' : 'bg-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.twoFactor ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-xs text-text-secondary">Automatic termination after 24 hours of inactivity.</p>
              </div>
              <div className="text-sm font-mono text-text-secondary">Enabled</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-secondary border border-border space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Match Alerts</p>
                <p className="text-xs text-text-secondary">Notify me when a match is found.</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifications ? 'bg-accent' : 'bg-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-secondary border border-border space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-accent" />
              Visual Interface
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-widest">Board Theme</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                  className="w-full p-3 rounded-xl bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option>Cyber Dark</option>
                  <option>Classic Grey</option>
                  <option>Traditional Wood</option>
                  <option>Matrix Neon</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-widest">Preferred Side</label>
                <div className="grid grid-cols-3 gap-2">
                  {["White", "Black", "Random"].map((side) => (
                    <button 
                      key={side}
                      onClick={() => setSettings({...settings, preferredColor: side})}
                      className={`py-2 px-3 rounded-xl border text-sm transition-all ${
                        settings.preferredColor === side 
                          ? "bg-accent text-background border-accent font-bold" 
                          : "bg-background border-border text-text-secondary hover:border-accent/50"
                      }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-secondary border border-border space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              Performance
            </h3>
            <div className="space-y-4">
               <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-widest">Latency Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Low", "Balanced", "High"].map((mode) => (
                    <button 
                      key={mode}
                      onClick={() => setSettings({...settings, latencyMode: mode})}
                      className={`py-2 px-3 rounded-xl border text-sm transition-all ${
                        settings.latencyMode === mode 
                          ? "bg-accent text-background border-accent font-bold" 
                          : "bg-background border-border text-text-secondary hover:border-accent/50"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-accent text-background font-bold px-8 h-12 rounded-2xl flex items-center gap-2">
          <Save className="w-5 h-5" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}
