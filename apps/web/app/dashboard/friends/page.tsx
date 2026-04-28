"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, UserPlus, MessageSquare, Circle, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FriendsPage() {
  const friends = [
    { id: 1, name: "Frontend_Wizard", status: "online", elo: 1450, lastSeen: "Active now" },
    { id: 2, name: "Backend_Beast", status: "idle", elo: 1620, lastSeen: "10m ago" },
    { id: 3, name: "DevOps_Dan", status: "offline", elo: 1300, lastSeen: "2h ago" },
    { id: 4, name: "Fullstack_Fiona", status: "online", elo: 1780, lastSeen: "Active now" },
    { id: 5, name: "Git_Guru", status: "online", elo: 1550, lastSeen: "Active now" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Peer Network</h1>
          <p className="text-text-secondary">Collaborate and compete with your trusted network of developers.</p>
        </div>
        <Button className="bg-accent text-background font-bold flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Peer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Filter network..." 
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-secondary border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {friends.map((friend, i) => (
              <motion.div 
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl bg-secondary border border-border flex items-center justify-between hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center font-bold">
                      {friend.name[0]}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-secondary ${
                      friend.status === 'online' ? 'bg-emerald-500' : friend.status === 'idle' ? 'bg-yellow-500' : 'bg-text-secondary'
                    }`} />
                  </div>
                  <div>
                    <p className="font-bold">{friend.name}</p>
                    <p className="text-xs text-text-secondary">{friend.lastSeen} • {friend.elo} Elo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="p-2 text-text-secondary hover:text-text-primary">
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                  <Button className="bg-accent text-background font-bold px-4 py-2 rounded-xl text-sm">
                    Challenge
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-secondary border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Circle className="w-4 h-4 text-accent fill-current" /> 
              Network Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Connected Peers</span>
                <span className="font-bold">{friends.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Online Now</span>
                <span className="font-bold text-emerald-500">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Pending Requests</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
