"use client";

import React, { useState, useRef } from "react";

const CATEGORY_MAP: Record<string, string[]> = {
  plumbing: ["Leak", "Clog", "No Water", "Low Pressure"],
  furniture: ["Bed", "Chair", "Table", "Wardrobe"],
  electrical: ["Power Out", "Fuse/Socket", "Light", "Appliance"],
  cleanliness: ["Cleaning Request", "Pests", "Garbage", "Sanitation"],
  internet: ["No Connection", "Slow", "Authentication", "Router"],
  mess: ["Food Quality", "Timing", "Hygiene", "Portion"],
  laundry: ["Delay", "Lost Item", "Damage", "Quality"],
};

const TIMESLOTS = [
  "08 AM-10 AM",
  "10 AM-12 PM",
  "12 PM-02 PM",
  "02 PM-04 PM",
  "04 PM-06 PM",
];

export default function ReportPage() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD for input[min]
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [block, setBlock] = useState("");
  const [otherHostel, setOtherHostel] = useState("");
  const [room, setRoom] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleCategoryChange = (v: string) => {
    setCategory(v);
    setSubcategory("");
  };

  const handleImage = (f?: FileList | null) => {
    const file = f?.[0] ?? null;
    const oldPreview = preview;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      if (oldPreview) URL.revokeObjectURL(oldPreview);
    } else {
      if (oldPreview) URL.revokeObjectURL(oldPreview);
      setPreview(null);
    }
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const resetForm = () => {
    setCategory("");
    setSubcategory("");
    setBlock("");
    setOtherHostel("");
    setRoom("");
    setContact("");
    setDate("");
    setTimeslot("");
    setDescription("");
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const saveForm = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Prevent selecting a past date
    if (date && date < today) {
      alert("Please select today or a future date.");
      return;
    }

    const finalBlock = block === "Other" ? otherHostel : block;
    const payload = {
      category,
      subcategory,
      block: finalBlock,
      room,
      contact,
      date,
      timeslot,
      description,
      hasImage: !!imageFile,
    };
    // TODO: replace with real save (API call)
    // For now, just log and alert success
    // eslint-disable-next-line no-console
    console.log("Report payload:", payload, imageFile);
    alert("Report saved (mock). Check console for payload.");
    resetForm();
  };

  const subcategories = category ? CATEGORY_MAP[category] ?? ["Other"] : [];

  return (
    <main className="max-w-4xl mx-auto px-5 py-8">
      <div className="bg-linear-to-b from-zinc-900/60 to-zinc-900/40 shadow-2xl ring-1 ring-white/5 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-4">Report an Issue</h1>
        <form onSubmit={saveForm} className="space-y-4">
          <div className="grid gap-4">
          <label className="block">
            <span className="text-sm text-zinc-400">Category</span>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
              className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">-- Select category --</option>
              {Object.keys(CATEGORY_MAP).map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Subcategory</span>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
              disabled={!category}
              className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">-- Select subcategory --</option>
              {subcategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block md:col-span-1">
              <span className="text-sm text-zinc-400">Block / Hostel</span>
              <select
                value={block}
                onChange={(e) => {
                  setBlock(e.target.value);
                  if (e.target.value !== "Other") setOtherHostel("");
                }}
                required
                className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">-- Select block / hostel --</option>
                <option value="Block A">Boys Hostel 1</option>
                <option value="Block B">Boys Hostel 2</option>
                <option value="Block C">Boys Hostel 3</option>
                <option value="North Wing">Girls Hostel 1</option>
                <option value="South Wing">Girls Hostel 2</option>
                <option value="South Wing">Girls Hostel 3</option>
              </select>

              {block === "Other" && (
                <input
                  type="text"
                  value={otherHostel}
                  onChange={(e) => setOtherHostel(e.target.value)}
                  placeholder="Enter block/hostel name"
                  required
                  className="mt-2 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            </label>

            <label className="block md:col-span-1">
              <span className="text-sm text-zinc-400">Room number</span>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. 204, A-12"
                required
                className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>

            <label className="block md:col-span-1">
              <span className="text-sm text-zinc-400">Contact number</span>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Student contact number"
                required
                className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-zinc-400">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
                className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>

            <label className="block">
              <span className="text-sm text-zinc-400">Time slot</span>
              <select
                value={timeslot}
                onChange={(e) => setTimeslot(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">-- Select time slot --</option>
                {TIMESLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-zinc-400">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail"
              required
              rows={5}
              className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </label>

          <div className="block">
            <span className="text-sm text-zinc-400">Image (optional)</span>
            <div className="mt-1 flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-md bg-zinc-800/30 border border-zinc-700 px-3 py-2">
                <div className="w-20 h-20 flex-shrink-0 bg-zinc-900 rounded-md overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="thumb" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">No preview</div>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="text-sm text-zinc-300 truncate w-40">{imageFile ? imageFile.name : 'No file chosen'}</div>
                  <div className="text-xs text-zinc-400">PNG, JPG (max 5MB)</div>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 rounded-md bg-transparent border border-zinc-700 px-3 py-2 text-sm text-zinc-200 cursor-pointer hover:bg-zinc-800/40">
                Choose
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage(e.target.files)}
                  className="hidden"
                />
              </label>

              {imageFile ? (
                <button type="button" onClick={removeImage} className="text-sm text-red-400 hover:text-red-300">Remove</button>
              ) : null}
            </div>
          </div>

          {preview && (
            <div className="mt-2">
              <span className="text-sm text-zinc-400">Preview:</span>
              <div className="mt-2">
                <img src={preview} alt="preview" className="max-w-full rounded-md border border-zinc-700" />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800/40"
            >
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-linear-to-r from-indigo-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow"
            >
              Save
            </button>
          </div>
        </div>
      </form>
      </div>
    </main>
  );
}





                                

         