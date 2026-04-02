import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TestTube,
  Activity,
  Thermometer,
  HeartPulse,
  Droplets,
  User,
  Calendar,
  PlusCircle,
  ArrowLeft,
  Wind,
} from "lucide-react";
import { useSelector } from "react-redux";

const initialForm = {
  name: "",
  age: "",
  gender: "Male",
  email: "",
  heartRate: "",
  dia_bloodPressure: "",
  temperature: "",
  wbc: "",
  Sys_bloodPressure: "",
  Resp_Rate: "",
  Oxygen: "",
  glucose: "",
};

const buildVitals = (formData) => ({
  heartRate: Number(formData.heartRate) || 0,
  bloodPressure: `${formData.Sys_bloodPressure}/${formData.dia_bloodPressure}`,
  temperature: Number(formData.temperature) || 0,
  wbc: Number(formData.wbc) || 0,
  oxygen: Number(formData.Oxygen) || 0,
  glucose: Number(formData.glucose) || 0,
  respiratoryRate: Number(formData.Resp_Rate) || 0,
});

export default function AddPatient() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const profileUser = useSelector((state) => state.user.profile);
  const currentUser = profileUser || authUser;
  const currentRole = profileUser?.role || authUser?.role || "User";
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const vitals = buildVitals(formData);

    navigate("/predict", {
      state: {
        formData: {
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
        },
        vitals,
        role: currentRole,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-5 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 p-7 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <Link
            to={currentRole === "Doctor" ? "/" : "/userdashboard"}
            className="absolute top-6 left-6 inline-flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors z-20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center justify-center relative z-10 pt-0.5">
            <PlusCircle className="w-8 h-8 mr-3" />
            Add Patient
          </h1>
          <p className="text-blue-100 mt-2 opacity-90 relative z-10 font-medium">
            Enter patient vitals to predict sepsis risk
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-500" /> Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Age</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      placeholder="45"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none text-gray-700"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {currentUser?.role === "Doctor" ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      placeholder="abc@gmail.com"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mt-8 mb-5 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-rose-500" /> Vitals & Lab Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Heart Rate (bpm)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HeartPulse className="h-4 w-4 text-rose-400 group-focus-within:text-rose-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="number"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all outline-none"
                    placeholder="85"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Dia Blood Pressure (mmHg)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Activity className="h-4 w-4 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="number"
                    name="dia_bloodPressure"
                    value={formData.dia_bloodPressure}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Temperature (C)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Thermometer className="h-4 w-4 text-orange-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all outline-none"
                    placeholder="37.2"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">WBC (x10^3/uL)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Droplets className="h-4 w-4 text-purple-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="wbc"
                    value={formData.wbc}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all outline-none"
                    placeholder="7.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Sys Blood Pressure (mmHg)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Wind className="h-4 w-4 text-red-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="number"
                    step="1"
                    name="Sys_bloodPressure"
                    value={formData.Sys_bloodPressure}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all outline-none"
                    placeholder="120"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Oxygen</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Wind className="h-4 w-4 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="number"
                    step="1"
                    name="Oxygen"
                    value={formData.Oxygen}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="98"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Glucose</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <TestTube className="h-4 w-4 text-cyan-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="number"
                    step="1"
                    name="glucose"
                    value={formData.glucose}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all outline-none"
                    placeholder="140"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Respiratory Rate</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Activity className="h-4 w-4 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="number"
                    step="1"
                    name="Resp_Rate"
                    value={formData.Resp_Rate}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50/50 border p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                    placeholder="18"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full relative group overflow-hidden rounded-xl p-[1px] transition-all hover:scale-[1.01] active:scale-95 shadow-md hover:shadow-xl hover:shadow-indigo-500/30"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 bg-[length:200%_auto] animate-gradient"></span>
                <div className="relative flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg tracking-wide transition-all group-hover:bg-opacity-0">
                  Predict Risk
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
