import { ArrowLeft, BriefcaseMedical, MessageSquare, ShieldAlert, Stethoscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";

const buildAvatar = (name, from, to) => {
  const cleanedName = name.replace(/^Dr\.?\s*/i, "").trim();
  const initials = cleanedName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="40" fill="url(#card-bg)" />
      <circle cx="80" cy="58" r="24" fill="rgba(255,255,255,0.18)" />
      <path d="M40 130c4-22 22-36 40-36s36 14 40 36" fill="rgba(255,255,255,0.18)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">
        ${initials || "DR"}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Risham",
    experience: "10 years",
    avatar: buildAvatar("Dr. Risham", "#ef4444", "#ec4899"),
  },
  {
    id: 2,
    name: "Dr. Suryanwanshi",
    experience: "7 years",
    avatar: buildAvatar("Dr. Suryanwanshi", "#f97316", "#fb7185"),
  },
  {
    id: 3,
    name: "Dr. Vaishnavi",
    experience: "12 years",
    avatar: buildAvatar("Dr. Verma", "#dc2626", "#f43f5e"),
  },
  {
    id: 4,
    name: "Dr. Priyanshu",
    experience: "5 years",
    avatar: buildAvatar("Dr. Priyanshu", "#dc2626", "#f43f5e"),
  },
  {
    id: 5,
    name: "Dr. Sumit",
    experience: "4 years",
    avatar: buildAvatar("Dr. Sumit", "#dc2626", "#f43f5e"),
  },
  {
    id: 6,
    name: "Dr. Ansh",
    experience: "3 years",
    avatar: buildAvatar("Dr. Ansh", "#dc2626", "#f43f5e"),
  },
];

export default function DoctorConsultant() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/userdashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Doctor Consultant</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Connect with sepsis-focused specialists for fast guidance on symptoms, monitoring, and next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-rose-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-50 p-2 text-rose-500">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Specialty</p>
                  <p className="text-sm font-semibold text-slate-800">Sepsis Care</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-rose-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-50 p-2 text-rose-500">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Mode</p>
                  <p className="text-sm font-semibold text-slate-800">Instant Chat</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-rose-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-50 p-2 text-rose-500">
                  <BriefcaseMedical className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 pr-4">Availability</p>
                  <p className="text-sm font-semibold text-slate-800">On-call support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.35fr_0.85fr] md:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-1.5 text-sm font-semibold text-rose-700">
                <Stethoscope className="h-4 w-4" />
                Sepsis-Only Consultant Network
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900 md:text-3xl">
                Choose a specialist and start a focused sepsis consultation.
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Each consultant is configured for sepsis-related screening guidance, symptom discussion, and urgent-risk prompts.
              </p>
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                Start Quick Chat with bot
              </button>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-red-500 to-pink-500 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Sepsis Support</p>
              <h3 className="mt-3 text-2xl font-bold">Act early when symptoms escalate.</h3>
              <p className="mt-3 text-sm leading-6 text-white/85">
                Fever, infection, falling blood pressure, abnormal heart rate, and low oxygen can all require urgent clinical attention.
              </p>
              <div className="mt-6 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-white/80">Recommended action</p>
                <p className="mt-1 text-base font-semibold">Use chat for triage guidance, then seek immediate care for severe symptoms.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {DOCTORS.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onConsult={(selectedDoctor) => navigate("/chat", { state: selectedDoctor })}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
