"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LeaderboardPage() {
  const rankings = [
    { rank: 1, user: "LinusTorvalds", elo: 2850, status: "Architect", trend: "stable" },
    { rank: 2, user: "AdaLovelace", elo: 2720, status: "Senior Lead", trend: "up" },
    { rank: 3, user: "AlanTuring", elo: 2680, status: "Senior Lead", trend: "down" },
    { rank: 4, user: "GraceHopper", elo: 2610, status: "Principal", trend: "up" },
    { rank: 5, user: "KenThompson", elo: 2590, status: "Principal", trend: "stable" },
    { rank: 6, user: "DennisRitchie", elo: 2540, status: "Principal", trend: "up" },
    { rank: 7, user: "BjarneStroustrup", elo: 2510, status: "Expert", trend: "down" },
    { rank: 8, user: "JamesGosling", elo: 2480, status: "Expert", trend: "stable" },
    { rank: 9, user: "BrendanEich", elo: 2410, status: "Expert", trend: "up" },
    { rank: 10, user: "GuidoVanRossum", elo: 2390, status: "Expert", trend: "down" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Production Stack</h1>
          <p className="text-text-secondary">Global ranking of the most optimized strategists in the cluster.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search user..." 
            className="pl-10 pr-4 py-2 rounded-xl bg-secondary border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 w-full md:w-64"
          />
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <PodiumCard rank={2} user={rankings[1]} color="text-blue-400" delay={0.1} />
        <PodiumCard rank={1} user={rankings[0]} color="text-accent" delay={0} />
        <PodiumCard rank={3} user={rankings[2]} color="text-yellow-500" delay={0.2} />
      </div>

      {/* Rankings Table */}
      <div className="bg-secondary border border-border rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-background/30">
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">Rank</th>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">User</th>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">Role</th>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary text-right">Elo Rating</th>
            </tr>
          </thead>
          <tbody>
            {rankings.slice(3).map((row, i) => (
              <motion.tr 
                key={row.user}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="border-b border-border last:border-0 hover:bg-background/20 transition-colors group"
              >
                <td className="px-6 py-4 font-mono text-text-secondary group-hover:text-text-primary">{row.rank}</td>
                <td className="px-6 py-4 font-bold">{row.user}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-background border border-border text-xs text-text-secondary">
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-accent">{row.elo}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PodiumCard({ rank, user, color, delay }: { rank: number; user: any; color: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-8 rounded-3xl bg-secondary border border-border text-center relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Crown className="w-12 h-12" />
      </div>
      <div className={`text-4xl font-black mb-2 ${color}`}>#{rank}</div>
      <div className="text-xl font-bold mb-1">{user.user}</div>
      <div className="text-sm text-text-secondary mb-4">{user.status}</div>
      <div className="text-2xl font-mono font-bold">{user.elo} <span className="text-xs text-text-secondary uppercase tracking-widest">Elo</span></div>
    </motion.div>
  );
}
