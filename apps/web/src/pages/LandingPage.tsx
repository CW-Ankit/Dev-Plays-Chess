import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Shield, Zap, Trophy, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0e1116] text-[#e8e9ea] font-sans">
      {/* Navbar */}
      <nav className="h-16 border-b border-[#2C313C] flex items-center justify-between px-6 bg-[#0e1116]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="font-bold text-black font-mono tracking-tighter text-lg leading-none">DPC</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">DevPlaysChess</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-[#8B949E] hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-1.5 rounded-md transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/30 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-6">
              <Zap className="w-3 h-3" /> The Next Gen Chess Engine
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Master the Game <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                In Real-Time
              </span>
            </h2>
            <p className="text-[#8B949E] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience seamless instance provisioning, advanced Elo tracking, and an ultra-responsive board designed for the modern strategist.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto group bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20">
                Deploy First Match <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="w-full sm:w-auto bg-[#161b22] hover:bg-[#21262d] text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all border border-[#30363D]">
                System Architecture
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">Engineered for Excellence</h3>
            <p className="text-[#8B949E]">Everything you need to climb the ranks of the global leaderboard.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Play className="w-6 h-6 text-emerald-400" />}
              title="Instance Provisioning"
              description="Our low-latency cluster connects you with an opponent of similar skill in seconds."
            />
            <FeatureCard 
              icon={<Trophy className="w-6 h-6 text-cyan-400" />}
              title="Elo Rating Metrics"
              description="Fair and accurate rating calculations based on the Glicko-2 standard to track your progress."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-purple-400" />}
              title="Secure Infrastructure"
              description="JWT-based sessions and protected API endpoints ensure your account and sessions are safe."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-8 rounded-2xl bg-[#161b22] border border-[#30363D] hover:border-emerald-500/50 transition-all group">
    <div className="w-12 h-12 rounded-lg bg-[#0d1117] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
    <p className="text-[#8B949E] leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
