import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle,
  Cpu,
  Droplets,
  HeartPulse,
  ShieldAlert,
  Thermometer,
  Wind,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { waitForAuth } from "../Auth/firebase";
import { addPatient } from "../store/doctor";
import { normalizeEmail } from "../store/firestoreUtils";
import { getPrediction } from "../store/aiSlice";
import { updateUserProfile } from "../store/user";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const SkeletonLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-6xl mx-auto space-y-8"
  >
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-800/70 animate-pulse"></div>
        <div className="h-8 w-56 rounded-xl bg-slate-800/70 animate-pulse"></div>
      </div>
      <div className="h-10 w-40 rounded-full bg-slate-800/70 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
      <div className="h-[26rem] rounded-[2rem] bg-slate-800/60 animate-pulse"></div>
      <div className="grid grid-cols-1 gap-6">
        <div className="h-44 rounded-[2rem] bg-slate-800/60 animate-pulse"></div>
        <div className="h-44 rounded-[2rem] bg-slate-800/60 animate-pulse"></div>
        <div className="h-44 rounded-[2rem] bg-slate-800/60 animate-pulse"></div>
      </div>
    </div>
  </motion.div>
);

const getNumericValue = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const parseBloodPressure = (bloodPressure = "") => {
  const [systolic = 0, diastolic = 0] = String(bloodPressure).split("/");

  return {
    systolic: getNumericValue(systolic),
    diastolic: getNumericValue(diastolic),
  };
};

const formatPrediction = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return value ?? "--";
  }

  const normalizedValue =
    numericValue >= 0 && numericValue <= 1 ? numericValue * 100 : numericValue;

  return Number(normalizedValue.toFixed(normalizedValue % 1 === 0 ? 0 : 1));
};

const getRiskConfig = (riskLevel = "") => {
  switch (String(riskLevel).toLowerCase()) {
    case "high":
      return {
        accent: "text-red-400",
        badge: "bg-red-500/15 border-red-500/30 text-red-300",
        card: "border-red-500/30 bg-red-500/10",
        glow: "bg-red-500/20",
        icon: AlertTriangle,
        label: "High Risk",
        scoreStroke: "#ef4444",
        summaryTitle: "Immediate clinical escalation recommended",
        summaryText:
          "AI detected a high probability of sepsis from the submitted vitals. Rapid physician review and close monitoring are advised.",
      };
    case "medium":
      return {
        accent: "text-amber-300",
        badge: "bg-amber-500/15 border-amber-500/30 text-amber-200",
        card: "border-amber-500/30 bg-amber-500/10",
        glow: "bg-amber-500/20",
        icon: ShieldAlert,
        label: "Medium Risk",
        scoreStroke: "#f59e0b",
        summaryTitle: "Elevated sepsis risk detected",
        summaryText:
          "AI found concerning signals in the submitted vitals. Repeat assessments and targeted monitoring should continue until values stabilize.",
      };
    default:
      return {
        accent: "text-emerald-300",
        badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-200",
        card: "border-emerald-500/30 bg-emerald-500/10",
        glow: "bg-emerald-500/20",
        icon: CheckCircle,
        label: "Low Risk",
        scoreStroke: "#10b981",
        summaryTitle: "Lower sepsis risk based on current vitals",
        summaryText:
          "AI returned a lower probability of sepsis for the submitted values. Continue routine observation and reassess if symptoms or vitals change.",
      };
  }
};

const getFactorTone = (status) => {
  if (status === "critical") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  if (status === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }

  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
};

const getTrendIcon = (trend) => (trend === "up" ? ArrowUp : ArrowDown);

const buildVitalsFactors = (vitals) => {
  const { systolic, diastolic } = parseBloodPressure(vitals?.bloodPressure);
  const heartRate = getNumericValue(vitals?.heartRate);
  const temperature = getNumericValue(vitals?.temperature);
  const oxygen = getNumericValue(vitals?.oxygen);
  const respiratoryRate = getNumericValue(vitals?.respiratoryRate);
  const wbc = getNumericValue(vitals?.wbc);
  const glucose = getNumericValue(vitals?.glucose);

  return [
    {
      name: "Heart Rate",
      value: `${heartRate} bpm`,
      description: "Tachycardia above 100 bpm increases sepsis concern.",
      icon: HeartPulse,
      status:
        heartRate > 120 || heartRate < 50
          ? "critical"
          : heartRate > 100 || heartRate < 60
            ? "warning"
            : "normal",
      trend: heartRate > 100 ? "up" : "down",
    },
    {
      name: "Temperature",
      value: `${temperature} C`,
      description: "Fever or hypothermia can indicate systemic infection.",
      icon: Thermometer,
      status:
        temperature >= 39 || temperature <= 35.5
          ? "critical"
          : temperature >= 38 || temperature <= 36
            ? "warning"
            : "normal",
      trend: temperature >= 38 ? "up" : "down",
    },
    {
      name: "Oxygen Saturation",
      value: `${oxygen}%`,
      description: "Low oxygen saturation may suggest respiratory compromise.",
      icon: Wind,
      status: oxygen < 90 ? "critical" : oxygen < 95 ? "warning" : "normal",
      trend: oxygen < 95 ? "down" : "up",
    },
    {
      name: "Blood Pressure",
      value: `${systolic}/${diastolic} mmHg`,
      description: "Hypotension is a major marker in septic deterioration.",
      icon: Activity,
      status:
        systolic < 90 || diastolic < 60
          ? "critical"
          : systolic < 100 || diastolic < 65
            ? "warning"
            : "normal",
      trend: systolic < 100 || diastolic < 65 ? "down" : "up",
    },
    {
      name: "Respiratory Rate",
      value: `${respiratoryRate} bpm`,
      description: "Elevated respiratory rate can reflect systemic stress.",
      icon: Cpu,
      status:
        respiratoryRate >= 26 || respiratoryRate <= 8
          ? "critical"
          : respiratoryRate > 20
            ? "warning"
            : "normal",
      trend: respiratoryRate > 20 ? "up" : "down",
    },
    {
      name: "WBC Count",
      value: `${wbc}`,
      description: "Abnormal WBC values may indicate infection or inflammation.",
      icon: Droplets,
      status: wbc > 15 || wbc < 3 ? "critical" : wbc > 12 || wbc < 4 ? "warning" : "normal",
      trend: wbc > 12 ? "up" : "down",
    },
    {
      name: "Glucose",
      value: `${glucose} mg/dL`,
      description: "Marked glucose deviation can worsen acute systemic risk.",
      icon: Cpu,
      status:
        glucose > 220 || glucose < 60
          ? "critical"
          : glucose > 180 || glucose < 70
            ? "warning"
            : "normal",
      trend: glucose > 180 ? "up" : "down",
    },
  ];
};

const getSaveStatusConfig = (status) => {
  if (status === "saving") {
    return {
      className: "border-blue-500/30 bg-blue-500/10 text-blue-200",
      label: "Saving to Firestore",
    };
  }

  if (status === "saved") {
    return {
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
      label: "Saved to Firestore",
    };
  }

  if (status === "error") {
    return {
      className: "border-red-500/30 bg-red-500/10 text-red-200",
      label: "Save failed",
    };
  }

  return {
    className: "border-white/10 bg-white/5 text-slate-300",
    label: "Preparing result",
  };
};

export default function PredictedPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, vitals, role } = location.state || {};
  const { loading } = useSelector((state) => state.ai);
  const [predictionResult, setPredictionResult] = useState(null);
  const [pageError, setPageError] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const runPrediction = async () => {
      try {
        if (!formData || !vitals || !role) {
          throw new Error("Missing prediction data");
        }

        const aiResult = await dispatch(getPrediction(vitals));

        if (getPrediction.rejected.match(aiResult)) {
          throw new Error(aiResult.payload || "Prediction failed");
        }

        const predictionData = aiResult.payload;

        setPredictionResult(predictionData);
        setSaveStatus("saving");

        const firebaseUser = await waitForAuth();
        const email =
          role === "User"
            ? normalizeEmail(firebaseUser?.email || "")
            : normalizeEmail(formData.email);

        if (!email) {
          throw new Error("Email required");
        }

        if (role === "Doctor") {
          await dispatch(
            addPatient({
              patientName: formData.name,
              age: Number(formData.age) || 0,
              gender: formData.gender,
              email,
              vitals,
              prediction: predictionData.prediction,
              riskLevel: predictionData.riskLevel,
            })
          ).unwrap();
        } else if (role === "User") {
          await dispatch(
            updateUserProfile({
              updatedData: {
                name: formData.name,
                email,
                age: Number(formData.age) || 0,     // ✅ ADD
                gender: formData.gender,           // ✅ ADD
                vitals,
                prediction: predictionData.prediction,
                riskLevel: predictionData.riskLevel,
              },
            })
          ).unwrap();
        } else {
          throw new Error("Invalid role");
        }

        setSaveStatus("saved");
      } catch (error) {
        console.error(error);
        setSaveStatus("error");
        setPageError(error.message || "Prediction failed");
        alert(error.message || "Prediction failed");
      }
    };

    runPrediction();
  }, [dispatch, formData, role, vitals]);

  const predictionScore = formatPrediction(predictionResult?.prediction);
  const riskConfig = getRiskConfig(predictionResult?.riskLevel);
  const RiskIcon = riskConfig.icon;
  const saveStatusConfig = getSaveStatusConfig(saveStatus);
  const factors = buildVitalsFactors(vitals);
  const patientMeta = [
    {
      label: "Patient",
      value: formData?.name || "Unknown",
    },
    {
      label: "Age",
      value: formData?.age || "--",
    },
    {
      label: "Gender",
      value: formData?.gender || "--",
    },
    {
      label: "Role",
      value: role || "--",
    },
  ];

  if (pageError) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 md:p-8 font-sans">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[24rem] w-[46rem] rounded-full bg-red-600/10 blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto pt-16">
          <div className="rounded-[2rem] border border-red-500/30 bg-slate-900/80 p-8 shadow-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-200">
              <AlertTriangle className="h-5 w-5" />
              Prediction Failed
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">Unable to complete AI prediction</h1>
            <p className="mt-4 text-slate-300">{pageError}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => navigate("/add-patient", { replace: true })}
                className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400"
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !predictionResult) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 md:p-8 font-sans selection:bg-red-500/30">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[24rem] w-[46rem] rounded-full bg-red-600/10 blur-[120px] pointer-events-none"></div>
        <div className="relative z-10">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 md:p-8 font-sans selection:bg-red-500/30">
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 h-[24rem] w-[46rem] rounded-full blur-[120px] pointer-events-none ${riskConfig.glow}`}></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key="prediction-content"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <button
                type="button"
                onClick={() => navigate(-2)}
                className="group inline-flex items-center text-slate-400 transition-colors hover:text-white"
              >
                <span className="mr-3 rounded-full bg-white/5 p-2 transition-colors group-hover:bg-white/10">
                  <ArrowLeft className="h-5 w-5" />
                </span>
                <span className="font-medium tracking-wide">Back to Patient Details</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-300">
                  <Cpu className="mr-2 h-4 w-4" />
                  AI Prediction Result
                </div>
                <div className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] ${saveStatusConfig.className}`}>
                  {saveStatusConfig.label}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1.35fr]">
              <motion.div variants={itemVariants} className="relative">
                <div className={`absolute inset-0 rounded-[2rem] blur-2xl ${riskConfig.glow}`}></div>
                <div className={`relative overflow-hidden rounded-[2rem] border bg-slate-900/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${riskConfig.card}`}>
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                  <div className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] ${riskConfig.badge}`}>
                    <RiskIcon className="mr-2 h-4 w-4" />
                    {predictionResult?.riskLevel || riskConfig.label}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <div className="relative h-56 w-56">
                      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                        <circle
                          cx="110"
                          cy="110"
                          r="94"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          className="text-white/10"
                        />
                        <circle
                          cx="110"
                          cy="110"
                          r="94"
                          stroke={riskConfig.scoreStroke}
                          strokeWidth="12"
                          fill="transparent"
                          strokeLinecap="round"
                          strokeDasharray={590.6}
                          strokeDashoffset={590.6 - (590.6 * Math.min(getNumericValue(predictionScore), 100)) / 100}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-6xl font-black tracking-tight text-white">
                          {predictionScore}
                          <span className="text-2xl text-slate-400">%</span>
                        </div>
                        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                          Sepsis Probability
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {patientMeta.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          {item.label}
                        </div>
                        <div className="mt-2 text-lg font-bold text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-6">
                <motion.div
                  variants={itemVariants}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-2xl p-3 ${riskConfig.badge}`}>
                      <ShieldAlert className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                        Recommended Response
                      </div>
                      <h2 className={`mt-3 text-3xl font-bold ${riskConfig.accent}`}>
                        {riskConfig.summaryTitle}
                      </h2>
                      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                        {riskConfig.summaryText}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                        AI Output
                      </div>
                      <h3 className="mt-2 text-2xl font-bold text-white">
                        {predictionResult?.prediction}% probability with {predictionResult?.riskLevel} risk
                      </h3>
                    </div>
                    <div className={`rounded-2xl border px-4 py-3 text-right ${riskConfig.badge}`}>
                      <div className="text-xs font-bold uppercase tracking-[0.24em]">Risk Level</div>
                      <div className="mt-1 text-xl font-black">{predictionResult?.riskLevel}</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                        Record Status
                      </div>
                      <h3 className="mt-2 text-2xl font-bold text-white">Prediction stored after AI response</h3>
                    </div>
                    <div className={`rounded-2xl border px-4 py-3 text-sm font-bold uppercase tracking-[0.24em] ${saveStatusConfig.className}`}>
                      {saveStatusConfig.label}
                    </div>
                  </div>
                  <p className="mt-4 text-slate-300">
                    {role === "Doctor"
                      ? "This result is being saved under the authenticated doctor's patient collection."
                      : "This result is being saved under the authenticated user's profile document."}
                  </p>
                </motion.div>
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
            >
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  Submitted Vitals
                </div>
                <h3 className="mt-2 text-2xl font-bold text-white">Dynamic factors used for this prediction</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {factors.map((factor) => {
                  const Icon = factor.icon;
                  const TrendIcon = getTrendIcon(factor.trend);

                  return (
                    <div
                      key={factor.name}
                      className={`rounded-2xl border p-5 transition-colors ${getFactorTone(factor.status)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-2xl bg-black/15 p-3">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="inline-flex items-center text-sm font-bold capitalize">
                          <TrendIcon className="mr-1 h-4 w-4" />
                          {factor.status}
                        </div>
                      </div>
                      <div className="mt-5">
                        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300/80">
                          {factor.name}
                        </div>
                        <div className="mt-2 text-2xl font-black text-white">{factor.value}</div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{factor.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
