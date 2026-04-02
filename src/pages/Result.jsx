import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, AlertTriangle, Activity, Thermometer, 
  Wind, ArrowUp, ArrowDown, ShieldAlert, Cpu, CheckCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Mock data for the chart
const mockChartData = [
  { time: '10:00', heartRate: 85, temp: 37.2 },
  { time: '11:00', heartRate: 90, temp: 37.5 },
  { time: '12:00', heartRate: 98, temp: 37.8 },
  { time: '13:00', heartRate: 105, temp: 38.2 },
  { time: '14:00', heartRate: 115, temp: 38.9 },
  { time: '15:00', heartRate: 128, temp: 39.5 },
];

const SkeletonLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="w-full max-w-5xl mx-auto space-y-8"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="w-10 h-10 bg-slate-800 rounded-full animate-pulse"></div>
      <div className="w-48 h-8 bg-slate-800 rounded-md animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse md:col-span-1"></div>
      <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse md:col-span-2"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-80 bg-slate-800/50 rounded-2xl animate-pulse"></div>
      <div className="h-80 bg-slate-800/50 rounded-2xl animate-pulse"></div>
    </div>
  </motion.div>
);

export default function Result() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const patient = location.state;
  const factors = [
    {
      name: "Heart Rate",
      value: `${patient?.vitals?.heartRate} bpm`,
      icon: Activity,
      status: patient?.vitals?.heartRate > 100 ? "critical" : "normal",
      trend: patient?.vitals?.heartRate > 100 ? "up" : "down",
      description: "Heart rate status"
    },
    {
      name: "Temperature",
      value: `${patient?.vitals?.temperature} °C`,
      icon: Thermometer,
      status: patient?.vitals?.temperature > 38 ? "high" : "normal",
      trend: patient?.vitals?.temperature > 38 ? "up" : "down",
      description: "Body temperature"
    },
    {
      name: "Oxygen Level",
      value: `${patient?.vitals?.oxygen}%`,
      icon: Wind,
      status: patient?.vitals?.oxygen < 95 ? "low" : "normal",
      trend: patient?.vitals?.oxygen < 95 ? "down" : "up",
      description: "Oxygen saturation"
    }
  ];
  // Simulate AI processing time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 md:p-8 font-sans selection:bg-red-500/30">
      
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <SkeletonLoader key="skeleton" />
          ) : (
            <motion.div 
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full space-y-8"
            >
              
              {/* Header */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="p-2 bg-white/5 rounded-full mr-3 group-hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                  <span className="font-medium tracking-wide">Back to Patient Details</span>
                </button>
                <div className="flex items-center bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full backdrop-blur-md">
                  <Cpu className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">AI Prediction Result</span>
                </div>
              </motion.div>

              {/* Top Row: Scores & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Main Risk Score Card */}
                <motion.div variants={itemVariants} className="md:col-span-1 relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse z-0"></div>
                  <div className="h-full relative z-10 bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(239,68,68,0.15)] overflow-hidden">
                    
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                    
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-500/20 text-red-400 font-bold text-sm tracking-widest uppercase mb-6 border border-red-500/20 animate-pulse">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      High Risk
                    </div>
                    
                    <div className="relative">
                      <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                        <motion.circle 
                          initial={{ strokeDashoffset: 553 }}
                          animate={{ strokeDashoffset: 553 - (553 * 0.82) }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                          cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" 
                          strokeDasharray="553" 
                          className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" 
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
                        <span className="text-6xl font-black text-white drop-shadow-md tracking-tighter">{patient.prediction}<span className="text-3xl text-slate-400 ml-2">%</span></span>
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-semibold text-slate-300 mt-6 tracking-wide">Sepsis Probability</h2>
                  </div>
                </motion.div>

                {/* Right Side: Action & Details */}
                <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col gap-6">
                  
                  {/* Action Banner */}
                  <div className="bg-gradient-to-br from-red-600/90 to-red-900/90 backdrop-blur-md rounded-2xl p-6 border border-red-500/50 shadow-xl flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-xl shadow-inner mt-1">
                      <ShieldAlert className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-red-100 text-sm font-bold uppercase tracking-wider mb-2">Suggested Action</h3>
                      <p className="text-2xl font-bold text-white leading-snug">Immediate ICU Monitoring Recommended</p>
                      <p className="text-red-200 mt-2 font-medium">Initiate broad-spectrum antibiotics and draw blood cultures immediately.</p>
                    </div>
                  </div>

                  {/* Secondary Stats */}
                  <div className="grid grid-cols-2 gap-6 flex-1">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                      <div className="flex items-center text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
                        <Cpu className="w-4 h-4 mr-2" />
                        AI Confidence Score
                      </div>
                      <div className="text-4xl font-black text-emerald-400">92<span className="text-2xl text-slate-500">%</span></div>
                      <p className="text-sm text-slate-500 mt-2">Based on analysis of 45+ clinical parameters</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                      <div className="flex items-center text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
                        <Activity className="w-4 h-4 mr-2" />
                        Progression Rate
                      </div>
                      <div className="text-4xl font-black text-orange-400 flex items-center">
                        Rapid <ArrowUp className="w-8 h-8 ml-2" />
                      </div>
                      <p className="text-sm text-slate-500 mt-2">Risk increased by 40% in last 4 hours</p>
                    </div>
                  </div>

                </motion.div>
              </div>

              {/* Bottom Row: Explanation & Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Contributing Factors */}
                <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                  
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    Key Contributing Factors
                  </h3>
                  
                  <div className="space-y-4 relative z-10">
                    {factors.map((factor, index) => {
                      const Icon = factor.icon;
                      const isCritical = factor.status === 'critical';
                      
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center p-4 rounded-2xl transition-all duration-300 border ${
                            isCritical ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className={`p-3 rounded-xl mr-4 shadow-inner ${
                            isCritical ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-slate-300'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`text-base font-bold ${isCritical ? 'text-white' : 'text-slate-200'}`}>{factor.name}</h4>
                            <p className="text-sm text-slate-400">{factor.description}</p>
                          </div>
                          
                          <div className="text-right flex flex-col items-end">
                            <span className={`text-lg font-bold flex items-center ${
                              isCritical ? 'text-red-400' : factor.status === 'high' ? 'text-orange-400' : 'text-blue-400'
                            }`}>
                              {factor.value}
                              {factor.trend === 'up' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />}
                            </span>
                            {isCritical && (
                              <span className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">Primary Driver</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Patient Vitals Chart */}
                <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Vitals Trend (Last 6 Hours)</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Heart Rate</span>
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> Temp</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full min-h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                          dy={10} 
                        />
                        <YAxis 
                          yAxisId="left"
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                          domain={[60, 140]}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                          domain={[36, 40]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            color: '#fff'
                          }}
                          itemStyle={{ fontWeight: 600 }}
                        />
                        <Area 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="heartRate" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorHr)" 
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
                        />
                        <Area 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="temp" 
                          stroke="#f97316" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorTemp)" 
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
