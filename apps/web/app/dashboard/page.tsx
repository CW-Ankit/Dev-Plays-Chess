"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, TrendingUp, User, Award, Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const user = useQuery(api.auth.getCurrentUser);
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Console Home</h1>
          <p className="text-text-secondary">Welcome back, {user?.name || "Architect"}. Your environment is operational and ready for deployment.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="h-14 px-6 border-border text-text-secondary hover:text-text-primary hover:bg-secondary rounded-2xl transition-all flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
          <Button className="h-14 px-8 bg-accent text-background hover:bg-accent/90 font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2">
            <Play className="w-6 h-6 fill-current" />
            Deploy Match
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />} 
          label="Current Elo" 
          value="1,240" 
          trend="+12 this session" 
          color="text-accent"
        />
        <StatCard 
          icon={<Award className="w-6 h-6" />} 
          label="Global Rank" 
          value="#4,201" 
          trend="Top 15% of cluster" 
          color="text-blue-400"
        />
        <StatCard 
          icon={<Zap className="w-6 h-6" />} 
          label="Win Rate" 
          value="54.2%" 
          trend="Optimization in progress" 
          color="text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-secondary border border-border"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            Player Profile
          </h3>
          <div className="space-y-4">
            <ProfileItem label="Username" value={user?.name || "Guest"} />
            <ProfileItem label="Email" value={user?.email || "N/A"} />
            <ProfileItem label="Preferred Side" value="White" />
            <ProfileItem label="Account Level" value="Senior Engineer" />
            <ProfileItem label="Total Matches" value="142" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-secondary border border-border"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Recent Commits (Games)
          </h3>
          <div className="space-y-4">
            <GameLog 
              opponent="ByteSlayer" 
              result="Victory" 
              status="merged" 
              time="2h ago" 
            />
            <GameLog 
              opponent="NullPointer" 
              result="Defeat" 
              status="conflict" 
              time="5h ago" 
            />
            <GameLog 
              opponent="AsyncAwaiter" 
              result="Draw" 
              status="stable" 
              time="1d ago" 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: { icon: React.ReactNode; label: string; value: string; trend: string; color: string }) {
  return (
    <div className="p-6 rounded-3xl bg-secondary border border-border hover:border-accent/30 transition-colors">
      <div className={`w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
      <h4 className="text-3xl font-bold mb-2">{value}</h4>
      <p className="text-xs text-text-secondary">{trend}</p>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function GameLog({ opponent, result, status, time }: { opponent: string; result: string; status: "merged" | "conflict" | "stable"; time: string }) {
  const statusColors = {
    merged: "text-accent bg-accent/10",
    conflict: "text-red-400 bg-red-400/10",
    stable: "text-blue-400 bg-blue-400/10",
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border hover:border-accent/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
          {opponent[0]}
        </div>
        <div>
          <p className="font-medium">{opponent}</p>
          <p className="text-xs text-text-secondary">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs px-2 py-1 rounded-md font-medium ${statusColors[status]}`}>
          {status}
        </span>
        <span className="font-bold text-sm">{result}</span>
      </div>
    </div>
  );
}
