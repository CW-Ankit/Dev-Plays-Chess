"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Cpu, Globe, Zap, ChevronRight, Layout } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent selection:text-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight">DevPlays <span className="text-accent">Chess</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-text-secondary hover:text-text-primary">
                Authenticate
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-accent text-background hover:bg-accent/90 font-semibold">
                Init Repository
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              v1.0.0-stable deployed
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-text-secondary">
              Deploy Your <span className="text-accent">Strategy.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              The ultimate grandmaster challenge for developers. Where Elo is your latency and checkmate is a production outage. Master the board, optimize your moves, and scale your dominance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button className="h-12 px-8 text-lg bg-accent text-background hover:bg-accent/90 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  Initialize Profile <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="h-12 px-8 text-lg text-text-secondary hover:text-text-primary">
                  Access Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">System Specifications</h2>
            <p className="text-text-secondary">High-performance chess engineered for the modern developer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />} 
              title="Low-Latency Execution" 
              description="Real-time synchronization powered by high-performance websockets. Zero lag between move and execution."
            />
            <FeatureCard 
              icon={<Cpu className="w-6 h-6" />} 
              title="Optimal Load Balancing" 
              description="Smart matchmaking algorithms that pair you with opponents of similar skill levels across the global cluster."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6" />} 
              title="Production Grade Elo" 
              description="Advanced rating systems to track your growth from a junior scripter to a senior architect of the board."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-secondary to-background border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to merge your first victory?</h2>
          <p className="text-text-secondary mb-10 relative z-10">Join thousands of developers competing for the top spot on the global production stack.</p>
          <Link href="/register" className="relative z-10">
            <Button className="bg-accent text-background hover:bg-accent/90 font-bold h-12 px-8">
              Init Repository Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
              <Terminal className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold">DevPlays Chess</span>
          </div>
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} DevPlays Chess. All rights reserved. Built with Next.js & Convex.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="#" className="hover:text-text-primary">Terms</Link>
            <Link href="#" className="hover:text-text-primary">Privacy</Link>
            <Link href="#" className="hover:text-text-primary">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-secondary border border-border hover:border-accent/50 transition-colors group"
    >
      <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-background transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}
