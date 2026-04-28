"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Shield, Zap, Award, Mail, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="relative h-48 rounded-3xl bg-gradient-to-r from-secondary to-background border border-border overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-accent) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute bottom-0 left-0 p-8 flex items-end gap-6">
          <div className="w-32 h-32 rounded-3xl bg-background border-4 border-secondary shadow-xl flex items-center justify-center text-4xl font-bold text-accent">
            DM
          </div>
          <div className="mb-2">
            <h1 className="text-4xl font-bold">DevMaster_01</h1>
            <p className="text-text-secondary flex items-center gap-2">
              <Shield className="w-4 h-4" /> Verified Architect • ID: 0x4f2a99
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-secondary border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              System Metadata
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Email</span>
                <span className="font-medium">dev@example.com</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Joined</span>
                <span className="font-medium">2026-01-15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Timezone</span>
                <span className="font-medium">UTC-5 (EST)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Location</span>
                <span className="font-medium">Cluster-01 (NA)</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-secondary border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Active Perks
            </h3>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-background border border-border text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" /> High Priority Matchmaking
              </div>
              <div className="p-2 rounded-lg bg-background border border-border text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" /> Advanced Analytics
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-secondary border border-border">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievement Registry
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { title: "First Merge", desc: "First win achieved", icon: "🏆" },
                { title: "Bug Hunter", desc: "Force a stalemate", icon: "🐛" },
                { title: "Quick Deploy", desc: "Win in < 10 moves", icon: "⚡" },
                { title: "Legacy Code", desc: "Play 100 games", icon: "📜" },
                { title: "Root Access", desc: "Top 100 Global", icon: "🔑" },
                { title: "Clean Build", desc: "Win without losing a piece", icon: "✨" },
              ].map((ach) => (
                <div key={ach.title} className="p-4 rounded-2xl bg-background border border-border text-center group hover:border-accent/50 transition-colors">
                  <div className="text-2xl mb-2">{ach.icon}</div>
                  <div className="text-sm font-bold mb-1">{ach.title}</div>
                  <div className="text-xs text-text-secondary">{ach.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-secondary border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-accent" />
              Developer Bio
            </h3>
            <p className="text-text-secondary leading-relaxed">
              Specializing in distributed systems and tactical board optimization. 
              Current goal: Reach Architect status in the Production Stack. 
              I believe every game is just a series of commits until the final merge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
