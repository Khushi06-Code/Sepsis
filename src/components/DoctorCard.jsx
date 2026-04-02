import { BriefcaseMedical, ShieldAlert } from "lucide-react";

const buildInitialsAvatar = (name, from = "#ef4444", to = "#ec4899") => {
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
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="40" fill="url(#bg)" />
      <circle cx="80" cy="60" r="26" fill="rgba(255,255,255,0.18)" />
      <path d="M38 132c5-24 24-38 42-38s37 14 42 38" fill="rgba(255,255,255,0.18)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">
        ${initials || "DR"}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function DoctorCard({ doctor, onConsult }) {
  const avatar = doctor.avatar || buildInitialsAvatar(doctor.name);

  return (
    <article className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.02]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={doctor.name}
            className="h-16 w-16 rounded-2xl object-cover ring-4 ring-rose-50"
          />
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{doctor.name}</h3>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Sepsis Specialist</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-slate-600">
        <BriefcaseMedical className="h-5 w-5 text-rose-500" />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Experience</p>
          <p className="text-sm font-semibold text-slate-800">{doctor.experience}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onConsult(doctor)}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
      >
        Consult Now
      </button>
    </article>
  );
}
