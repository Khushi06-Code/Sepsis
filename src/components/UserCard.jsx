import React from "react";

export default function ProfileCard({ user }) {
    console.log(user)
  return (
    <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 text-center relative group transition-all duration-300 hover:shadow-md">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-tr-[2rem] rounded-bl-full blur-3xl -mr-4 -mt-4 opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none"></div>
      
      {/* PROFILE IMAGE */}
      <div className="flex justify-center relative z-10">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-16 bg-slate-100 ring-1 ring-slate-200">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random&size=150`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* NAME */}
      <h2 className="text-2xl font-black text-slate-900 mt-6 tracking-tight">
        {user?.name || "No Name Provided"}
      </h2>

      {/* ROLE / TAG */}
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-8 bg-blue-50 inline-block px-3 py-1 rounded-full">
        {user?.role || "Patient"} Profile
      </p>

      {/* DETAILS */}
      <div className="space-y-3 text-sm relative z-10">
        <div className="flex justify-between items-center bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl transition-colors hover:bg-white hover:border-slate-200 group/item">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
          <span className="font-bold text-slate-800 truncate max-w-[180px]">{user?.email || "N/A"}</span>
        </div>

        <div className="flex justify-between items-center bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl transition-colors hover:bg-white hover:border-slate-200 group/item">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User ID</span>
          <span className="font-bold text-slate-600 font-mono text-[11px]">#{user?.id?.substring(0, 8) || "N/A"}</span>
        </div>

        <div className="flex justify-between items-center bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl transition-colors hover:bg-white hover:border-slate-200 group/item">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</span>
          <span className="font-bold text-slate-800">{user?.age || "Not Set"}</span>
        </div>

        <div className="flex justify-between items-center bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl transition-colors hover:bg-white hover:border-slate-200 group/item">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
          <span className="font-bold text-slate-800">{user?.gender || "Not Set"}</span>
        </div>
      </div>
      
      {/* Decorative pulse element */}
      <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
    </div>
  );
}