import { Bot, Stethoscope } from "lucide-react";

export default function ChatBubble({ message, doctorName }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}>
      <div className={`flex max-w-[85%] items-end gap-3 md:max-w-[70%] ${isBot ? "" : "flex-row-reverse"}`}>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            isBot
              ? "bg-gradient-to-br from-red-500 to-pink-500 text-white"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {isBot ? <Bot className="h-5 w-5" /> : <Stethoscope className="h-5 w-5" />}
        </div>

        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isBot
              ? "rounded-bl-md bg-white text-slate-700"
              : "rounded-br-md bg-gradient-to-r from-red-500 to-pink-500 text-white"
          }`}
        >
          <p className={`mb-1 text-xs font-semibold uppercase tracking-[0.16em] ${isBot ? "text-rose-500" : "text-white/80"}`}>
            {isBot ? doctorName : "You"}
          </p>
          <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
        </div>
      </div>
    </div>
  );
}
