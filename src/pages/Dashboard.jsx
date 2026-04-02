import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  Search,
  Bell,
  LayoutDashboard,
  UserPlus,
  BrainCircuit,
  ShieldAlert,
  ChevronRight,
  HeartPulse,
  Thermometer,
  Clock,
  Info,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getAllPatients, getHighRiskPatients } from "../store/doctor";
import Logout from "./Logout";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Add Patient", icon: UserPlus, path: "/add-patient" },
  { name: "Alerts", icon: ShieldAlert, path: "/alerts" },
  { name: "History", icon: Clock, path: "/history" },
  { name: "Explain AI", icon: BrainCircuit, path: "/explain-ai" },
  { name: "About", icon: Info, path: "/about" },
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const chartRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { patients, highRiskPatients, loading } = useSelector((state) => state.doctor);
  const currentUser = useSelector((state) => state.user.profile || state.auth.user);

  useEffect(() => {
    dispatch(getAllPatients());
    dispatch(getHighRiskPatients());
  }, [dispatch]);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return patients;
    }

    return patients.filter((patient) => {
      const name = (patient.patientName || "").toLowerCase();
      const email = (patient.email || "").toLowerCase();
      return name.includes(term) || email.includes(term) || patient.id.toLowerCase().includes(term);
    });
  }, [patients, searchTerm]);

  const stats = useMemo(() => {
    const high = patients.filter((patient) => patient.riskLevel === "High").length;
    const medium = patients.filter((patient) => patient.riskLevel === "Medium").length;
    const safe = patients.filter((patient) => patient.riskLevel === "Safe").length;

    return [
      { title: "Total Patients", value: patients.length, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
      { title: "High Risk", value: high, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/50" },
      { title: "Medium Risk", value: medium, icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
      { title: "Safe", value: safe, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    ];
  }, [patients]);

  const chartData = useMemo(() => {
    const recent = [...patients]
      .sort((a, b) => new Date(a.updatedAt || a.createdAt || 0) - new Date(b.updatedAt || b.createdAt || 0))
      .slice(-7);

    return {
      labels: recent.map((patient) =>
        new Date(patient.updatedAt || patient.createdAt || Date.now()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ),
      datasets: [
        {
          label: "Sepsis Risk Trend",
          data: recent.map((patient) => Number(patient.prediction ?? 0) / 100),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#1e293b",
          pointBorderColor: "#3b82f6",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [patients]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex">
      <header className="w-64 border-r border-slate-800 bg-slate-900 flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">SepsisAI</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-blue-600/10 border border-blue-500/20 text-blue-400" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <Logout />
      </header>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name or email..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              {highRiskPatients.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />}
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{currentUser?.name || "Doctor"}</p>
                <p className="text-xs text-slate-400">{currentUser?.email || "Doctor access"}</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-semibold">
                {(currentUser?.name || "D").charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div>
              <h1 className="text-3xl font-bold text-white">Ward Overview</h1>
              <p className="text-slate-400 mt-1">Real-time sepsis risk monitoring and prediction.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                      {loading ? <div className="h-8 w-16 bg-slate-700 rounded animate-pulse mt-2" /> : <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>}
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} border ${stat.border} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Active Patients</h2>
                  <button onClick={() => navigate("/history")} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 text-sm">
                        <th className="pb-4 font-medium px-4">Patient</th>
                        <th className="pb-4 font-medium px-4">Age</th>
                        <th className="pb-4 font-medium px-4">Heart Rate</th>
                        <th className="pb-4 font-medium px-4">Temp (°C)</th>
                        <th className="pb-4 font-medium px-4">Risk Score</th>
                        <th className="pb-4 font-medium px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b border-slate-800">
                            <td className="py-4 px-4"><div className="h-4 w-24 bg-slate-700 rounded animate-pulse" /></td>
                            <td className="py-4 px-4"><div className="h-4 w-8 bg-slate-700 rounded animate-pulse" /></td>
                            <td className="py-4 px-4"><div className="h-4 w-12 bg-slate-700 rounded animate-pulse" /></td>
                            <td className="py-4 px-4"><div className="h-4 w-12 bg-slate-700 rounded animate-pulse" /></td>
                            <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-700 rounded animate-pulse" /></td>
                            <td className="py-4 px-4"><div className="h-6 w-20 bg-slate-700 rounded-full animate-pulse" /></td>
                          </tr>
                        ))
                      ) : filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => {
                          const risk = Number(patient.prediction ?? 0) / 100;
                          return (
                            <tr key={patient.id} onClick={() => navigate(`/patient/${patient.id}`)} className="border-b border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer">
                              <td className="py-4 px-4">
                                <p className="font-semibold text-white">{patient.patientName}</p>
                                <p className="text-xs text-slate-500">{patient.email}</p>
                              </td>
                              <td className="py-4 px-4 text-slate-300">{patient.age}</td>
                              <td className="py-4 px-4 text-slate-300 flex items-center gap-2">
                                <HeartPulse className="w-4 h-4 text-red-400" /> {patient.vitals?.heartRate || 0}
                              </td>
                              <td className="py-4 px-4 text-slate-300 flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-amber-400" /> {patient.vitals?.temperature || 0}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`font-mono ${risk > 0.8 ? "text-red-400 font-bold" : risk > 0.4 ? "text-amber-400" : "text-emerald-400"}`}>
                                  {Number(patient.prediction ?? 0)}%
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${patient.riskLevel === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" : patient.riskLevel === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                                  {patient.riskLevel}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-10 px-4 text-center text-slate-400">No patients found for this doctor.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="space-y-8 flex flex-col">
                <Card className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold text-white mb-6">Risk Trend</h2>
                  <div className="relative w-full h-[220px] flex-1">
                    {loading ? (
                      <div className="w-full h-full bg-slate-800 rounded-xl animate-pulse" />
                    ) : (
                      <Line
                        ref={chartRef}
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 1,
                              grid: { color: "#334155" },
                              ticks: { color: "#94a3b8" },
                            },
                            x: {
                              grid: { display: false },
                              ticks: { color: "#94a3b8" },
                            },
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: "#1e293b",
                              titleColor: "#f8fafc",
                              bodyColor: "#f8fafc",
                              borderColor: "#334155",
                              borderWidth: 1,
                            },
                          },
                        }}
                      />
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <h2 className="text-xl font-semibold text-white">Critical Alerts</h2>
                  </div>

                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)
                    ) : highRiskPatients.length > 0 ? (
                      highRiskPatients.map((patient) => (
                        <div key={patient.id} className="p-4 rounded-xl bg-slate-800 border fill-transparent border-red-500/30 flex justify-between items-start">
                          <div>
                            <p className="font-bold text-red-400">{patient.patientName}</p>
                            <p className="text-sm text-slate-300 mt-1">Immediate ICU Monitoring Required</p>
                          </div>
                          <div className="bg-red-500/10 px-2 py-1 rounded text-xs font-bold text-red-400">
                            {Number(patient.prediction ?? 0)}% RISK
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No high-risk patients right now.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `,
        }}
      />
    </div>
  );
}
