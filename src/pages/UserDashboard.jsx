import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  LayoutDashboard,
  BrainCircuit,
  Info,
  ArrowLeft,
  Droplets,
  ScanLine,
  HeartPulse,
  Thermometer,
  BriefcaseMedical,
  Bot
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import ProfileCard from "../components/UserCard";
import Logout from "./Logout";
import { selectUser } from "../store/user";

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/userdashboard" },
  { name: "Check Self", icon: ScanLine, path: "/add-patient" },
  { name: "Doctor Consultant", icon: BriefcaseMedical, path: "/doctor-consultant" },
  { name: "Explain AI", icon: BrainCircuit, path: "/explain-ai" },
  { name: "About", icon: Info, path: "/about" },
];

export default function UserDashboard() {
  const user = useSelector((state) => selectUser(state) || state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const chartData = useMemo(() => {
    const prediction = Number(user?.prediction ?? 0);
    const points = [Math.max(prediction - 25, 0), Math.max(prediction - 15, 0), Math.max(prediction - 5, 0), prediction];

    return ["6h", "4h", "2h", "Now"].map((label, index) => ({
      time: label,
      risk: points[index],
    }));
  }, [user?.prediction]);

  const riskTone = user?.riskLevel === "High" ? "red" : user?.riskLevel === "Medium" ? "orange" : "emerald";

  return (
    <div className="relative flex gap-8">
      <button
        type="button"
        onClick={() => navigate("/chat")}
        className="absolute bottom-8 right-5 z-20 flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-sm shadow-rose-200 transition duration-300 hover:-translate-y-1 hover:scale-105"
        aria-label="Open sepsis assistant chat"
      >
        <Bot className="h-8 w-8" />
      </button>

      <aside className="w-96 bg-gray-50 flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-black">SepsisAI</span>
        </div>

        <nav className="flex-1 px-4 py-10 space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-blue-600/10 border border-blue-500/20 text-blue-400" : "text-black hover:text-white hover:bg-gradient-to-r from-red-500 to-pink-500 "}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-2xl">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <Logout />
      </aside>

      <div className="p-6 max-w-full space-y-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/add-patient" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Check latest vitals
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{user?.name || "No Name"}</h1>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold border shadow-sm ${riskTone === "red" ? "bg-red-100 text-red-700 border-red-200" : riskTone === "orange" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}>
            <AlertTriangle className="w-5 h-5" />
            <span>Status: {user?.riskLevel || "No assessment yet"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Sepsis Risk Score</h2>
            <div className="text-7xl font-extrabold text-red-600 mb-2">{Number(user?.prediction ?? 0)}<span className="text-3xl">%</span></div>
            <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-1.5 rounded-full mt-2">
              {user?.riskLevel || "Pending"}
            </span>
          </div>

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
                  {user?.vitals?.heartRate || 0}<span className="text-base font-normal text-gray-500">bpm</span>
                </p>
              </div>
              <div className="p-5 bg-red-50 rounded-xl border border-red-100">
                <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
                  <Activity className="w-4 h-4 mr-2 text-blue-500" /> Blood Pressure
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {user?.vitals?.bloodPressure || 0} <span className="text-base font-normal text-gray-500">mmHg</span>
                </p>
              </div>
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
                  <Thermometer className="w-4 h-4 mr-2 text-orange-500" /> Temperature
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user?.vitals?.temperature || 0} <span className="text-base font-normal text-gray-500">°C</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-purple-500" /> Lab Results
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-gray-700 font-medium tracking-wide">WBC</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-600">{user?.vitals?.wbc || 0}</span>
                  <span className="text-xs text-gray-500 ml-1">x10³/µL</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-gray-700 font-medium tracking-wide">Oxygen</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-600">{user?.vitals?.oxygen || 0}</span>
                  <span className="text-xs text-gray-500 ml-1">%</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/result", { state: user })}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 rounded-xl text-white text-lg mt-10 hover:scale-105 transition"
              >
                View Result
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Risk Timeline</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Updated from your latest record</span>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} formatter={(value) => [`${value}%`, "Risk Score"]} />
                  <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ position: "top", value: "High Risk Threshold", fill: "#ef4444", fontSize: 12 }} />
                  <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 pr-16 flex justify-center">
        <div className="w-96 ml-16 mt-40 ">
          <ProfileCard user={user}/>
        </div>
      </div>
    </div>
  );
}
