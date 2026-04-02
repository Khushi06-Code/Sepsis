import { Link } from 'react-router-dom';
import { Network, Activity, HeartPulse, Droplets, Thermometer, Info, BrainCircuit, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const features = [
  {
    id: 1,
    name: 'Heart Rate',
    value: 35,
    icon: HeartPulse,
    color: 'from-rose-500 to-red-500',
    fill: '#ef4444',
    description: 'Elevated heart rate detected',
  },
  {
    id: 2,
    name: 'Temperature',
    value: 20,
    icon: Thermometer,
    color: 'from-orange-400 to-amber-500',
    fill: '#f97316',
    description: 'Fever detected',
  },
  {
    id: 3,
    name: 'WBC Count',
    value: 15,
    icon: Activity,
    color: 'from-blue-400 to-cyan-500',
    fill: '#06b6d4',
    description: 'Elevated WBC indicates infection',
  },
  {
    id: 4,
    name: 'Blood Pressure',
    value: 10,
    icon: Activity,
    color: 'from-emerald-400 to-teal-500',
    fill: '#14b8a6',
    description: 'Low blood pressure detected',
  },
  {
    id: 5,
    name: 'Oxygen',
    value: 10,
    icon: Droplets,
    color: 'from-purple-400 to-indigo-500',
    fill: '#8b5cf6',
    description: 'Oxygen saturation is low',
  },
  {
    id: 6,
    name: 'Respiratory Rate',
    value: 5,
    icon: Activity,
    color: 'from-cyan-400 to-blue-500',
    fill: '#3b82f6',
    description: 'Abnormal breathing rate',
  },
  {
    id: 7,
    name: 'Glucose',
    value: 5,
    icon: Activity,
    color: 'from-yellow-400 to-orange-500',
    fill: '#f59e0b',
    description: 'Glucose imbalance',
  },
];

const topFeature = features.reduce((highest, feature) => {
  if (!highest || feature.value > highest.value) {
    return feature;
  }

  return highest;
}, null);

export default function ExplainAi() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 p-6 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
              <BrainCircuit className="w-8 h-8 text-indigo-500 mr-3" />
              Machine Learning Insight
            </h1>
            <p className="text-gray-400 mt-2 max-w-xl text-sm leading-relaxed">
              Transparent breakdown of the predictive model's decision, illustrating exactly which patient vitals drove the high-risk classification.
            </p>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-xl flex flex-col items-end shadow-lg relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-500/10 blur-xl rounded-full"></div>
            <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Overall Risk Score</span>
            <span className="text-4xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] tracking-tight">85%</span>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-[#111827] to-[#0f172a] border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-opacity duration-700 group-hover:opacity-100 opacity-50 pointer-events-none"></div>
          <div className="relative z-10 flex items-start gap-5">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0 border border-indigo-500/20 shadow-inner">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-2 tracking-wide">Key Finding</h2>
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                <span className="font-semibold text-rose-400 drop-shadow-sm">{topFeature?.name}</span> is the principal driving factor for this prediction, accounting for <span className="text-gray-100 font-medium tracking-wide">{topFeature?.value}%</span> of the risk score. The model suggests that combined abnormalities in vital signs indicate possible sepsis risk.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Feature Importance List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center tracking-wide">
              <Network className="w-5 h-5 mr-3 text-indigo-400" /> Factor Contribution %
            </h3>
            
            <div className="flex flex-col gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isTopFactor = feature.id === topFeature?.id;
                
                return (
                  <div 
                    key={feature.id} 
                    className={`p-5 rounded-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border
                      ${isTopFactor 
                        ? 'bg-gray-900/60 border-rose-500/30 shadow-[0_4px_30px_rgba(225,29,72,0.1)]' 
                        : 'bg-gray-900/30 border-gray-800/60 hover:border-gray-700/80 hover:bg-gray-900/50'
                      }`}
                  >
                    {isTopFactor && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                    )}
                    
                    <div className="flex justify-between items-center mb-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl bg-gray-950/50 text-gray-400 shadow-inner border border-gray-800/50 ${isTopFactor ? 'text-rose-400 border-rose-500/20 shadow-rose-900/20' : ''}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className={`text-base font-bold tracking-wide ${isTopFactor ? 'text-white' : 'text-gray-200'}`}>
                              {feature.name}
                            </h4>
                            {isTopFactor && (
                              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">
                                Top Risk Factor
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-500">{feature.description}</span>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold tracking-tighter ${isTopFactor ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'text-gray-300'}`}>
                        {feature.value}%
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-950 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${feature.color} relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]`}
                        style={{ width: `${feature.value}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="p-8 rounded-3xl bg-gray-900/30 backdrop-blur-2xl border border-gray-800/60 flex flex-col items-center justify-center relative shadow-2xl">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
             
             <h3 className="text-lg font-semibold text-gray-200 mb-6 w-full text-center tracking-wide">Model Weights Distribution</h3>
             
             <div className="w-full aspect-square max-h-80 relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={features}
                     cx="50%"
                     cy="50%"
                     innerRadius={85}
                     outerRadius={115}
                     paddingAngle={6}
                     dataKey="value"
                     stroke="none"
                     cornerRadius={4}
                   >
                     {features.map((entry, index) => (
                       <Cell 
                         key={`cell-${index}`} 
                         fill={entry.fill} 
                         className="hover:opacity-80 transition-opacity duration-300 cursor-pointer outline-none drop-shadow-md"
                       />
                     ))}
                   </Pie>
                   <RechartsTooltip 
                     contentStyle={{
                       backgroundColor: 'rgba(17, 24, 39, 0.95)',
                       border: '1px solid rgba(75, 85, 99, 0.4)',
                       borderRadius: '16px',
                       boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                       color: '#f3f4f6',
                       padding: '12px 16px'
                     }}
                     itemStyle={{ color: '#e5e7eb', fontWeight: 600, fontSize: '14px' }}
                     formatter={(value) => [`${value}% Contribution`, '']}
                   />
                   <Legend 
                     verticalAlign="bottom" 
                     height={40} 
                     iconType="circle"
                     wrapperStyle={{ paddingTop: '30px', fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               
               {/* Center label for donut chart */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-sm font-semibold text-gray-500 tracking-widest uppercase">Total</span>
                 <span className="text-3xl font-bold text-gray-200 mt-1">100%</span>
               </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
