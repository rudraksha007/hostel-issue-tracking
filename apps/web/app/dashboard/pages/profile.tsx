"use client";
import React, { useEffect, useState } from "react";
import { Mail, Phone, User } from "lucide-react";
import { AuthAPI } from "../../../lib/api/auth";

export default function Profile() {
  // Keep only address as static fallback
  const seedUser = {
    address: "123 Hostel Road, Block A, Room 203",
  };

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  useEffect(() => {
    // fetch real session user and populate fields
    (async () => {
      const s = await AuthAPI.getSessionUser();
      if (s) {
        if (s.name) setName(s.name);
        if (s.email) setEmail(s.email);
        if (s.phone) setPhone(s.phone);
      }
    })();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function openModal() {
    setFormName(name || "");
    setFormEmail(email || "");
    setFormPhone(phone || "");
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setName(formName);
    setEmail(formEmail);
    setPhone(formPhone);
    setOpen(false);
  }

  return (
    <div id="profile-root" className="min-h-full p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl profile-card-themed border border-theme p-8 shadow-xl bg-theme-card">
          <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 bg-linear-to-r from-indigo-500 to-pink-500 rounded-full blur-3xl" />

          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-32 w-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10 bg-linear-to-br from-indigo-600 to-pink-500 flex items-center justify-center">
              <User size={48} className="text-white" aria-hidden />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-theme-primary">{name}</h2>

              <div className="mt-3 flex flex-col items-center gap-2 text-sm text-theme-secondary">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="opacity-80" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="opacity-80" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-theme-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10.5a9 9 0 1118 0v6.75A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V10.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                  </svg>
                  <div className="whitespace-pre-wrap">{seedUser.address}</div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center mt-4">
              <button onClick={openModal} type="button" className="px-4 py-2 rounded-full bg-white/6 text-sm text-theme-primary hover:bg-white/10 transition">Edit Profile</button>
            </div>
          </div>
        </div>

        <div className="mt-6" />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <form onSubmit={submit} className="relative z-10 w-full max-w-lg p-6 rounded-2xl bg-theme-card border border-theme shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary">Edit Profile</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-theme-secondary hover:text-theme-primary">Close</button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-theme-secondary">Name</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full p-2 rounded-md bg-white/5 border border-white/6 text-theme-primary" />

              <label className="block text-sm text-theme-secondary">Email</label>
              <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full p-2 rounded-md bg-white/5 border border-white/6 text-theme-primary" />

              <label className="block text-sm text-theme-secondary">Phone</label>
              <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} className="w-full p-2 rounded-md bg-white/5 border border-white/6 text-theme-primary" />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md btn-cancel-themed">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-linear-to-r from-indigo-600 to-teal-500 text-white">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
