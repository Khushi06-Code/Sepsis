import React, { useState } from 'react';
import { Mail, Lock, HeartPulse, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


import { useDispatch } from "react-redux";
import { postLogin } from "../store/auth";
import { getUserData } from "../store/user";
import { normalizeEmail } from "../store/firestoreUtils";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const resultAction = await dispatch(
        postLogin({
          email: normalizeEmail(formData.email),
          password: formData.password,
        })
      );

      if (postLogin.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        await dispatch(getUserData({ userId: user.id }));

        if (user.role === "Doctor") {
          navigate("/");
        } else {
          navigate("/userdashboard");
        }
      } else {
        setError(resultAction.payload);
      }

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-red-500/30">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 transition-all duration-300 hover:shadow-[0_0_50px_rgba(239,68,68,0.15)]">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 mb-4 animate-pulse">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            SepsisAI
          </h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to your dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-red-400 transition-colors duration-300" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="admin@hospital.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-black/20 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 shadow-inner"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <a href="#" className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
                Forgot Password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-red-400 transition-colors duration-300" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-black/20 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 shadow-inner"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-white hover:text-red-400 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
        
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 font-medium tracking-widest uppercase">
        Early Sepsis Risk Prediction System • Restricted Access
      </div>
    </div>
  );
}
