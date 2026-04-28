"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Filter, Download, Clock, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MatchesPage() {
  const matches = [
    { id: "m1", opponent: "LinusT", result: "Victory", eloChange: "+15", duration: "12:45", date: "2026-04-27", status: "merged" },
    { id: "m2", opponent: "AdaL", result: "Defeat", eloChange: "-12", duration: "08:20", date: "2026-04-26", status: "conflict" },
    { id: "m3", opponent: "AlanT", result: "Draw", eloChange: "0", duration: "25:10", date: "2026-04-25", status: "stable" },
    { id: "m4", opponent: "GraceH", result: "Victory", eloChange: "+18", duration: "15:30", date: "2026-04-24", status: "merged" },
    { id: "m5", opponent: "KenT", result: "Defeat", eloChange: "-10", duration: "05:12", date: "2026-04-23", status: "conflict" },
    { id: "m6", opponent: "BjarneS", result: "Victory", eloChange: "+12", duration: "18:40", date: "2026-04-22", status: "merged" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Version History</h1>
          <p className="text-text-secondary">Comprehensive audit log of all your game commits.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border text-text-secondary">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" className="border-border text-text-secondary">
            <Download className="w-4 h-4 mr-2" /> Export PGN
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {matches.map((match, i) => (
          <motion.div 
            key={match.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl bg-secondary border border-border flex items-center justify-between group hover:border-accent/50 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-background border border-border text-text-secondary font-mono text-sm">
                {match.date.split("-").slice(1).join("/")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">vs {match.opponent}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                    match.status === 'merged' ? 'text-accent bg-accent/10' : 
                    match.status === 'conflict' ? 'text-red-400 bg-red-400/10' : 
                    'text-blue-400 bg-blue-400/10'
                  }`}>
                    {match.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {match.duration}</span>
                  <span className="font-mono">{match.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className={`font-bold text-lg ${match.result === 'Victory' ? 'text-accent' : match.result === 'Defeat' ? 'text-red-400' : 'text-blue-400'}`}>
                  {match.result}
                </div>
                <div className={`text-xs font-mono ${match.eloChange.startsWith('+') ? 'text-accent' : 'text-red-400'}`}>
                  {match.eloChange} Elo
                </div>
              </div>
              <Button variant="ghost" className="p-2 text-text-secondary hover:text-text-primary rounded-xl">
                <History className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
