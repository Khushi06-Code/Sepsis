import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Bot, Send, ShieldAlert, Stethoscope } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";

const INITIAL_MESSAGE = "Hello 👋 I'm your Sepsis Assistant. Tell me your symptoms.";

const buildAvatar = (name, from = "#ef4444", to = "#ec4899") => {
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
        <linearGradient id="chat-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="40" fill="url(#chat-bg)" />
      <circle cx="80" cy="58" r="24" fill="rgba(255,255,255,0.18)" />
      <path d="M40 130c4-22 22-36 40-36s36 14 40 36" fill="rgba(255,255,255,0.18)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">
        ${initials || "DR"}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const DEFAULT_DOCTOR = {
  id: "default-sepsis-doctor",
  name: "On-Call Specialist",
  experience: "24/7 availability",
  avatar: buildAvatar("On-Call Specialist"),
};

const getBotReply = (message) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("fever")) {
    return "Fever can be an early sign of sepsis. Monitor temperature closely.";
  }

  if (normalizedMessage.includes("heart")) {
    return "Abnormal heart rate may indicate sepsis risk.";
  }

  if (normalizedMessage.includes("oxygen")) {
    return "Low oxygen level is critical. Please seek immediate care.";
  }

  if (normalizedMessage.includes("infection")) {
    return "Infection can lead to sepsis if untreated.";
  }

  if (normalizedMessage.includes("blood pressure") || normalizedMessage.includes("bp")) {
    return "Low blood pressure is a serious sign of sepsis.";
  }

  if (normalizedMessage.includes("sepsis")) {
    return "Sepsis is life-threatening. Immediate medical attention required.";
  }

  return "I'm here to help with sepsis-related symptoms. Please describe clearly.";
};

const formatDoctorName = (name) => (name?.startsWith("Dr.") ? name : `Dr. ${name}`);

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const endOfMessagesRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "initial-bot-message",
      sender: "bot",
      text: INITIAL_MESSAGE,
    },
  ]);

  const doctor = useMemo(() => {
    if (location.state && typeof location.state === "object" && "name" in location.state) {
      return {
        ...DEFAULT_DOCTOR,
        ...location.state,
        avatar: location.state.avatar || buildAvatar(location.state.name),
      };
    }

    return DEFAULT_DOCTOR;
  }, [location.state]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmedMessage,
    };

    const botMessage = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: getBotReply(trimmedMessage),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage, botMessage]);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/doctor-consultant"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to consultants
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Consulting {formatDoctorName(doctor.name)!=="Dr. On-Call Specialist"?formatDoctorName(doctor.name):"Dr."}
            </h1>
            <p className="mt-2 text-slate-600">
              Sepsis-only assistant support for symptom discussion, escalation prompts, and clinical urgency cues.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/doctor-consultant")}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-600"
          >
            View Doctors
          </button>
        </div>

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="h-16 w-16 rounded-2xl object-cover ring-4 ring-rose-50"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">{formatDoctorName(doctor.name)!=="Dr. On-Call Specialist"?formatDoctorName(doctor.name):"Dr."}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {formatDoctorName(doctor.name)!=="Dr. On-Call Specialist"?"Sepsis Specialist":""}
                      
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{doctor.experience}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Stethoscope className="h-4 w-4 text-rose-500" />
                  Sepsis consultation active
                </div>
                <p className="mt-1 text-xs text-slate-500">Share symptoms clearly for focused guidance.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
            <div className="flex min-h-[560px] flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-6 py-6">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    doctorName={formatDoctorName(doctor.name)!=="Dr. On-Call Specialist"?formatDoctorName(doctor.name):"Dr."}
                  />
                ))}
                <div ref={endOfMessagesRef} />
              </div>

              <div className="border-t border-slate-100 bg-white px-6 py-5">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label htmlFor="chat-message" className="sr-only">
                      Type your symptom message
                    </label>
                    <textarea
                      id="chat-message"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={2}
                      placeholder="Describe sepsis-related symptoms, vitals, or concerns..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="inline-flex h-12 w-12 mb-4 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm shadow-rose-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <aside className="border-t border-slate-100 bg-white px-6 py-6 lg:border-l lg:border-t-0">
              <div className="rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 p-5 text-white shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                  <Bot className="h-4 w-4" />
                  Sepsis Assistant
                </div>
                <p className="mt-3 text-lg font-semibold">High-risk symptoms should be escalated immediately.</p>
                <p className="mt-2 text-sm leading-6 text-white/85">
                  Low oxygen, low blood pressure, confirmed infection, and worsening fever can all signal urgent sepsis risk.
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Quick prompts</p>
                <div className="mt-4 space-y-2">
                  {["I have fever and infection", "My heart rate is high", "Low oxygen with sepsis concern"].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5   text-left text-sm text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
