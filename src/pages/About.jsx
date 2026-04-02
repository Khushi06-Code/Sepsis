import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, ShieldAlert, Cpu, HeartPulse, 
  Users, Code, BrainCircuit, Clock, CheckCircle2,
  AlertTriangle, Stethoscope, ArrowLeft
} from 'lucide-react';

export default function About() {
  // Animation variants setup
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const teamMembers = [
    { name: 'Risham Soni', role: 'REACT Eng.', initials: 'RS', color: 'bg-blue-500' },
    { name: 'Khushi Suryawanshi', role: 'AIML Eng.', initials: 'SS', color: 'bg-emerald-500' },
    { name: 'Vaishnavi Kumari', role: 'AIML Eng.', initials: 'VK', color: 'bg-indigo-500' },
    // { name: 'Priyanshu Raj', role: 'AIML Eng.', initials: 'PR', color: 'bg-rose-500' },
    { name: 'Sumit Kumar', role: 'REACT Eng.', initials: 'SK', color: 'bg-yellow-500' },
  ];

  const techStack = [
    { name: 'React', category: 'Frontend', color: 'text-cyan-400' },
    { name: 'Tailwind CSS', category: 'Styling', color: 'text-teal-400' },
    { name: 'Node.js', category: 'Backend', color: 'text-green-500' },
    { name: 'Express', category: 'Server', color: 'text-gray-300' },
    { name: 'Python', category: 'Machine Learning', color: 'text-yellow-400' },
    { name: 'Scikit-Learn', category: 'ML Model', color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 py-12 px-6 md:px-12 font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Background ambient glows */}
      <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto relative z-10 space-y-16"
      >
        
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4 pt-10 relative">
          <Link to="/" className="absolute top-0 left-0 inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] mt-8 sm:mt-0">
            <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight leading-tight">
            Early Sepsis Risk<br className="hidden sm:block" /> Prediction System
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-light">
            An advanced AI-driven healthcare dashboard designed to proactively detect and explain sepsis risk, saving lives through timely medical intervention.
          </p>
        </motion.div>

        {/* Section 1 & 2: What & Why (Grid) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card: What is Sepsis */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:bg-slate-800/60 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0 pointer-events-none"></div>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 mr-4 shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">What is Sepsis?</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              Sepsis is a life-threatening medical emergency caused by the body's extreme, overactive response to an infection. It rapidly damages tissues and organs, making it one of the leading causes of death in hospitals worldwide if not diagnosed immediately.
            </p>
          </div>

          {/* Card: Why Early Prediction */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:bg-slate-800/60 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0 pointer-events-none"></div>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mr-4 shadow-inner">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Why Early Prediction?</h2>
            </div>
            <ul className="space-y-4">
              {[
                { text: 'Prevent irreversible multiple organ failure', icon: ShieldAlert, color: 'text-amber-400' },
                { text: 'Drastically reduce hospital mortality rates', icon: Activity, color: 'text-rose-400' },
                { text: 'Enable timely, life-saving antibiotic treatment', icon: Stethoscope, color: 'text-blue-400' }
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <item.icon className={`w-5 h-5 mr-3 mt-1 shrink-0 ${item.color}`} />
                  <span className="text-slate-300 text-lg font-light leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></motion.div>

        {/* Section 3 & 4: How AI Works & Key Features (Grid) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card: How AI Works */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 shadow-lg shadow-indigo-500/5 relative overflow-hidden">
            <div className="flex items-center mb-8 pb-4 border-b border-white/5">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 mr-4 shadow-inner">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">How AI Works Here</h2>
            </div>
            
            <div className="relative border-l-2 border-indigo-500/30 pl-6 space-y-8 ml-3">
              <div className="relative">
                <span className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#0a0f1c] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                <h3 className="text-white font-semibold text-lg">1. Data Ingestion</h3>
                <p className="text-slate-400 mt-1 font-light leading-relaxed">Continuously analyzes patient vital signs, demographic data, and recent laboratory test results in real-time.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#0a0f1c] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                <h3 className="text-white font-semibold text-lg">2. Machine Learning Analysis</h3>
                <p className="text-slate-400 mt-1 font-light leading-relaxed">A trained LightGBM/XGBoost model evaluates complex physiological patterns invisible to the naked eye.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#0a0f1c] shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
                <h3 className="text-white font-semibold text-lg">3. Risk Scoring & Explanation</h3>
                <p className="text-slate-400 mt-1 font-light leading-relaxed">Outputs a definitive risk probability score alongside an Explainable AI breakdown showing exactly which factors drove the prediction.</p>
              </div>
            </div>
          </div>

          {/* Card: Key Features */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
            <div className="flex items-center mb-8">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mr-4 shadow-inner">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Key Features</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Early Prediction', desc: 'Forecasts sepsis onset 6–12 hours before clinical recognition.', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                { title: 'Real-time Monitoring', desc: 'Live dashboard updating seamlessly with new patient vitals.', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                { title: 'Explainable Insights', desc: 'SHAP/LIME-based insights for complete clinical transparency.', icon: BrainCircuit, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                { title: 'Actionable Alerts', desc: 'Smart notification system cutting through alarm fatigue.', icon: ShieldAlert, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
              ].map((feature, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <feature.icon className={`w-6 h-6 mb-3 ${feature.color}`} />
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></motion.div>

        {/* Section 5 & 6: Stack & Team */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          
          {/* Card: Team Members */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center mb-8">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mr-4 shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Project Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map((member, i) => (
                <div key={i} className="flex items-center p-3 rounded-2xl hover:bg-slate-700/30 transition-colors">
                  <div className={`w-12 h-12 rounded-full ${member.color} text-white flex items-center justify-center font-bold text-lg shadow-md mr-4 shrink-0`}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{member.name}</h3>
                    <p className="text-slate-400 text-sm">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Tech Stack */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center mb-8">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mr-4 shadow-inner">
                <Code className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Technology Stack</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech, i) => (
                <div key={i} className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-center">
                  <span className={`font-bold ${tech.color}`}>{tech.name}</span>
                  <span className="text-slate-500 text-xs mt-0.5 uppercase tracking-wider">{tech.category}</span>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

      </motion.div>
    </div>
  );
}
