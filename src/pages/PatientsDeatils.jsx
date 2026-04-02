import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { AlertTriangle, Activity, Thermometer, Droplets, HeartPulse, ArrowLeft } from 'lucide-react';

const mockChartData = [
  { time: '00:00', risk: 12 },
  { time: '02:00', risk: 15 },
  { time: '04:00', risk: 18 },
  { time: '06:00', risk: 25 },
  { time: '08:00', risk: 45 },
  { time: '10:00', risk: 68 },
  { time: '12:00', risk: 85 },
];

export default function PatientsDetailsPage() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
          <p className="text-gray-500 mt-1">Age: 45 | Gender: Male | ID: #PT-84729</p>
        </div>
        <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold border border-red-200 shadow-sm animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <span>Status: Risk increasing rapidly</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Score Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200 flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Sepsis Risk Score</h2>
          <div className="text-7xl font-extrabold text-red-600 mb-2">85<span className="text-3xl">%</span></div>
          <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-1.5 rounded-full mt-2">
            Critical Warning
          </span>
        </div>

        {/* Vitals Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" /> Current Vitals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
                <HeartPulse className="w-4 h-4 mr-2 text-red-500" /> Heart Rate
              </p>
              <p className="text-3xl font-bold text-red-600">
                115 <span className="text-base font-normal text-gray-500">bpm</span>
              </p>
            </div>
            <div className="p-5 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
                <Activity className="w-4 h-4 mr-2 text-blue-500" /> Blood Pressure
              </p>
              <p className="text-3xl font-bold text-red-600">
                85/50 <span className="text-base font-normal text-gray-500">mmHg</span>
              </p>
            </div>
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
                <Thermometer className="w-4 h-4 mr-2 text-orange-500" /> Temperature
              </p>
              <p className="text-3xl font-bold text-gray-900">
                38.5 <span className="text-base font-normal text-gray-500">°C</span>
              </p>
            </div>
          </div>
        </div>

        {/* Lab Results Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-purple-500" /> Lab Results
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-gray-700 font-medium tracking-wide">WBC</span>
              <div className="text-right">
                <span className="text-xl font-bold text-red-600">15.2</span>
                <span className="text-xs text-gray-500 ml-1">x10³/µL</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-gray-700 font-medium tracking-wide">Lactate</span>
              <div className="text-right">
                <span className="text-xl font-bold text-red-600">4.1</span>
                <span className="text-xs text-gray-500 ml-1">mmol/L</span>
              </div>
            </div>

            {/* 🔥 RESULT BUTTON */}
            <button
              // onClick={() => navigate("/result", { state: patient })}
              onClick={() => navigate("/result")}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 rounded-xl text-white text-lg mt-10 hover:scale-105 transition"
            >
              View Result
            </button>
          </div>
        </div>

        {/* Risk Timeline Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Risk Timeline (Last 12 Hours)</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Updated just now</span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value}%`, 'Risk Score']}
                />
                <ReferenceLine 
                  y={80} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3" 
                  label={{ position: 'top', value: 'High Risk Threshold', fill: '#ef4444', fontSize: 12 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
