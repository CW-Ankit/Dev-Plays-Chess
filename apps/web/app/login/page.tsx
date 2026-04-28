"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/authClient";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message || "Authentication failed. Check your credentials.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Unexpected system failure. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-secondary border border-border p-8 rounded-3xl backdrop-blur-sm shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <Terminal className="w-6 h-6 text-background" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Authenticate</h1>
            <p className="text-text-secondary">Enter your credentials to access your environment.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
              <input 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                placeholder="dev@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Secure Password</label>
              <input 
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              disabled={loading}
              className="w-full h-12 bg-accent text-background hover:bg-accent/90 font-bold rounded-xl transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Execute Login"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent hover:underline font-medium">
                Initialize Profile
              </Link>
            </p>
          </div>
        </motion.div>
        
        <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Landing
        </Link>
      </div>
    </div>
  );
}
