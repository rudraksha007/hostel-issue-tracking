"use client";

import { IssuesAPI } from "@/lib/api/issues";
import { TimeSlot } from "@repo/db/browser";
import { CreateIssueRequestT } from "@repo/shared/types/api";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

const CATEGORY_MAP: Record<string, string[]> = {
  plumbing: ["Leak", "Clog", "No Water", "Low Pressure", "Shower", "Toilet", "Tap"],
  furniture: ["Bed", "Chair", "Table", "Wardrobe"],
  electrical: ["Power Out", "Fuse/Socket", "Light", "Appliance", "Switch", "Air Conditioner", "Fan", "Cooler", "Gyser"],
  cleanliness: ["Cleaning Request", "Pests", "Garbage", "Sanitation", "Sewage", "Bathroom"],
  internet: ["No Connection", "Slow", "Authentication", "Router"],
  mess: ["Food Quality", "Timing", "Hygiene", "Portion"],
  laundry: ["Delay", "Lost Item", "Damage", "Quality"],
};

const Slots = {
  [TimeSlot.A]: "08 AM-10 AM",
  [TimeSlot.B]: "10 AM-12 PM",
  [TimeSlot.C]: "12 PM-02 PM",
  [TimeSlot.D]: "02 PM-04 PM",
  [TimeSlot.E]: "04 PM-06 PM",
  [TimeSlot.F]: "06 PM-08 PM",
};

export default function ReportPage() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD for input[min]
  const [form, setForm] = useState<CreateIssueRequestT>({
    title: "",
    description: "",
    priority: "MEDIUM",
    raisedBy: "",
    isPublic: false,
    remarks: "",
    category: "",
    timeSlot: [],
    subCategory: "",
  });
  function setFormField(field: keyof CreateIssueRequestT, value: typeof form[typeof field]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleCategoryChange = (v: string) => {
    setFormField("category", v);
    setFormField("subCategory", "");
  };

  const toggleTimeSlot = (slot: TimeSlot) => {
    const currentSlots = form.timeSlot as TimeSlot[];
    if (currentSlots.includes(slot)) {
      setFormField("timeSlot", currentSlots.filter(s => s !== slot));
    } else {
      setFormField("timeSlot", [...currentSlots, slot]);
    }
  };

  const handleImage = (f?: FileList | null) => {
    if (!f || f.length === 0) return;

    const newFiles = Array.from(f);
    const MAX_IMAGES = 5;

    if (imageFiles.length + newFiles.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    // Check file sizes (max 5MB each)
    const oversized = newFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error("Some files exceed 5MB limit");
      return;
    }

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);

    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      raisedBy: "",
      isPublic: false,
      remarks: "",
      category: "",
      timeSlot: [],
      subCategory: "",
    });
    previews.forEach(url => URL.revokeObjectURL(url));
    setImageFiles([]);
    setPreviews([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const saveForm = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // Prevent selecting a past date
    if (date && date < today) {
      toast.error("Please select a valid date.");
      return;
    }
    setLoading(true);
    const res = await IssuesAPI.createIssue(form, imageFiles);
    if (!res.success) toast.error(res.msg || "Failed to submit report.");
    else {
      resetForm();
      toast.success("Report submitted successfully.");
      router.push('/dashboard?tab=home');
    }
    setLoading(false);
  };

  const subcategories = form.category ? CATEGORY_MAP[form.category] ?? ["Other"] : [];

  return (
    <main className="max-w-4xl mx-auto px-5 py-8">
      <div className="bg-linear-to-b from-zinc-900/60 to-zinc-900/40 shadow-2xl ring-1 ring-white/5 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-4">Report an Issue</h1>
        <form onSubmit={saveForm} className="space-y-4">
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm text-zinc-400">Category</span>
              <select
                value={form.category}
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
                value={form.subCategory}
                onChange={(e) => setFormField("subCategory", e.target.value)}
                required
                disabled={!form.category}
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

            <label className="block">
              <span className="text-sm text-zinc-400">Title</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setFormField("title", e.target.value)}
                placeholder="Brief title for the issue"
                required
                className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>

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

              <div className="block">
                <span className="text-sm text-zinc-400">Time slots (select multiple)</span>
                <div className="mt-1 space-y-2 p-3 rounded-md bg-zinc-800/40 border border-zinc-700">
                  {Object.entries(Slots).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-zinc-700/30 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={(form.timeSlot as TimeSlot[]).includes(key as TimeSlot)}
                        onChange={() => toggleTimeSlot(key as TimeSlot)}
                        className="w-4 h-4 rounded border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 bg-zinc-700"
                      />
                      <span className="text-sm text-zinc-200">{label}</span>
                    </label>
                  ))}
                </div>
                {(form.timeSlot as TimeSlot[]).length > 0 && (
                  <div className="mt-1 text-xs text-zinc-400">
                    {(form.timeSlot as TimeSlot[]).length} slot{(form.timeSlot as TimeSlot[]).length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </div>

            <label className="block">
              <span className="text-sm text-zinc-400">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setFormField("description", e.target.value)}
                placeholder="Describe the issue in detail"
                required
                rows={5}
                className="mt-1 block w-full rounded-md bg-zinc-800/40 text-zinc-100 border border-zinc-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => setFormField("isPublic", e.target.checked)}
                className="w-4 h-4 rounded border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 bg-zinc-700"
              />
              <span className="text-sm text-zinc-200">Make this issue public</span>
            </label>

            <div className="block">
              <span className="text-sm text-zinc-400">Images (optional, max 5)</span>
              <div className="mt-1">
                <label className="inline-flex items-center gap-2 rounded-md bg-transparent border border-zinc-700 px-4 py-2 text-sm text-zinc-200 cursor-pointer hover:bg-zinc-800/40">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Images ({imageFiles.length}/5)
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImage(e.target.files)}
                    className="hidden"
                    disabled={imageFiles.length >= 5}
                  />
                </label>
                <div className="text-xs text-zinc-400 mt-1">PNG, JPG (max 5MB each)</div>
              </div>

              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {previews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-video bg-zinc-900 rounded-md overflow-hidden border border-zinc-700">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {imageFiles[idx]?.name.slice(0, 15)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-linear-to-r from-indigo-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow disabled:opacity-50"
              >
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}