import React, { useState } from 'react';
import { 
  Mail, Lock, User, HeartPulse, ArrowRight, Loader2, 
  AlertCircle, Eye, EyeOff, ShieldCheck, Stethoscope 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { postSignup } from "../store/auth";
import { getUserData } from "../store/user";
import { normalizeEmail } from "../store/firestoreUtils";
export default function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'User'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);

      const resultAction = await dispatch(
        postSignup({
          name: formData.fullName,
          email: normalizeEmail(formData.email),
          password: formData.password,
          role: formData.role,
        })
      );

      if (postSignup.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        await dispatch(getUserData({ userId: user.id }));
        navigate(user.role === "Doctor" ? "/" : "/userdashboard");
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

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

      {/* Signup Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 my-8 transition-all duration-300 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm mt-1">Join the SepsisAI network</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleRoleSelect('Doctor')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all duration-300 ${
              formData.role === 'Doctor' 
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                : 'bg-black/20 border-slate-700/50 text-slate-400 hover:bg-black/40 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span className="font-medium text-sm">Doctor</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleRoleSelect('User')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all duration-300 ${
              formData.role === 'User' 
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                : 'bg-black/20 border-slate-700/50 text-slate-400 hover:bg-black/40 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium text-sm">User</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder={formData.role === 'Doctor' ? "Dr. Sarah Chen" : "John Doe"}
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-black/20 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-inner"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="sarah.chen@hospital.org"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-black/20 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-inner"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-black/20 border border-slate-700/50 rounded-xl py-3 pl-11 pr-11 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-inner"
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full bg-black/20 border ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword 
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                    : 'border-slate-700/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                } rounded-xl py-3 pl-11 pr-11 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner`}
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-blue-400 transition-colors">
              Log in instead
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
