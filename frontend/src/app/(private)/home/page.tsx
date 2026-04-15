"use client";

import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { useGetHomework, useCreateHomework, useDeleteHomework } from "@/hooks/homework";
import { useGetSchedule, useCreateSchedule, useDeleteSchedule } from "@/hooks/schedule";
import { useGetMaterials, useUploadImage, useAddLink, useDeleteMaterial } from "@/hooks/materials";
import { materialsApi } from "@/api/materialsApi";

const DAYS = [
  { id: 1, name: "Esmaspäev" },
  { id: 2, name: "Teisipäev" },
  { id: 3, name: "Kolmapäev" },
  { id: 4, name: "Neljapäev" },
];

const SCHEDULE_DAYS = [
  { id: 1, name: "Esmaspäev" },
  { id: 2, name: "Teisipäev" },
  { id: 3, name: "Kolmapäev" },
  { id: 4, name: "Neljapäev" },
];

const SLOT_TIMES: Record<number, string[]> = {
  1: ["13:30–14:45", "14:55–16:10", "16:20–17:35", "17:45–19:00"],
  2: ["14:00–15:15", "15:25–16:40", "16:50–18:05", "18:15–19:30"],
  3: ["13:30–14:45", "14:55–16:10", "16:20–17:35", "17:45–19:00"],
  4: ["13:30–14:45", "14:55–16:10", "16:20–17:35", "17:45–19:00"],
};

const SUBJECTS = [
  "Inimeseõpetus", "Muusika", "Bioloogia", "Füüsika",
  "Geograafia", "Ajalugu", "Eesti keel", "Eesti kirjandus",
  "Inglise keel", "Keemia", "Kirjandus", "Matemaatika",
  "Uurimuse ja praktilise töö", "VA Lütseumi tund",
  "VA Riigikaitse", "Vene keel",
];

const HW_TYPES = [
  { value: "kodutöö",    label: "Kodutöö" },
  { value: "tunnitöö",   label: "Tunnitöö" },
  { value: "kontrolltöö", label: "Kontrolltöö" },
] as const;

type HwType = "kodutöö" | "tunnitöö" | "kontrolltöö";

// Стили для каждого типа
const TYPE_STYLES: Record<HwType, { card: string; text: string; badge: string }> = {
  "kodutöö":    { card: "border-blue-200 border-l-4 border-l-blue-400", text: "text-blue-700", badge: "" },
  "tunnitöö":   { card: "border-green-200 border-l-4 border-l-green-400", text: "text-green-700", badge: "bg-green-100 text-green-700" },
  "kontrolltöö": { card: "border-amber-300 border-l-4 border-l-amber-400", text: "text-amber-600", badge: "bg-amber-100 text-amber-600" },
};

const RESOURCES = [
  {
    name: "Sõnaveeb",
    url: "https://sonaveeb.ee",
    description: "Eesti keele sõnaraamat",
  },
  {
    name: "HARNO",
    url: "https://harno.ee",
    description: "Eksamite materjalid",
  },
];

const TABS = ["Kodutöö", "Tunniplaan", "Materjalid", "Ressursid"] as const;
type Tab = (typeof TABS)[number];

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>("Kodutöö");
  const [addingForDay, setAddingForDay] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [hwType, setHwType] = useState<HwType>("kodutöö");
  const [formError, setFormError] = useState("");

  const { data: homeworkData, isLoading } = useGetHomework();
  const homework = homeworkData ?? [];
  const { mutate: createHomework, isPending: isCreating } = useCreateHomework();
  const { mutate: deleteHomework } = useDeleteHomework();

  // Schedule state
  const [addingSlot, setAddingSlot] = useState<{ day: number; slot: number } | null>(null);
  const [schedSubject, setSchedSubject] = useState("");

  const { data: scheduleData, isLoading: isScheduleLoading } = useGetSchedule();
  const schedule = scheduleData ?? [];
  const { mutate: createSchedule, isPending: isScheduleCreating } = useCreateSchedule();
  const { mutate: deleteSchedule } = useDeleteSchedule();

  function scheduleEntry(day: number, slot: number) {
    return schedule.find((e) => e.day === day && e.slot === slot);
  }

  function handleScheduleSubmit(e: React.FormEvent, day: number, slot: number) {
    e.preventDefault();
    if (!schedSubject) return;
    createSchedule(
      { day, slot, subject: schedSubject },
      { onSuccess: () => { setAddingSlot(null); setSchedSubject(""); } }
    );
  }

  // Materials state
  const [showImageForm, setShowImageForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const { data: materialsData, isLoading: isMaterialsLoading } = useGetMaterials();
  const materials = materialsData ?? [];
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutate: addLink, isPending: isAddingLink } = useAddLink();
  const { mutate: deleteMaterial } = useDeleteMaterial();

  function handleImageUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile || !imageName.trim()) return;
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("name", imageName.trim());
    uploadImage(formData, {
      onSuccess: () => { setShowImageForm(false); setImageFile(null); setImageName(""); }
    });
  }

  function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!linkName.trim() || !linkUrl.trim()) return;
    addLink(
      { name: linkName.trim(), url: linkUrl.trim() },
      { onSuccess: () => { setShowLinkForm(false); setLinkName(""); setLinkUrl(""); } }
    );
  }

  function openForm(dayId: number) {
    setAddingForDay(dayId);
    setSubject("");
    setDescription("");
    setHwType("kodutöö");
    setFormError("");
  }

  function closeForm() {
    setAddingForDay(null);
  }

  function handleSubmit(e: React.FormEvent, dayId: number) {
    e.preventDefault();
    if (!subject || !description.trim()) {
      setFormError("Vali aine ja kirjuta kirjeldus.");
      return;
    }
    setFormError("");
    createHomework(
      { subject, description, day: dayId, type: hwType },
      { onSuccess: closeForm }
    );
  }

  function homeworkForDay(dayId: number) {
    return homework.filter((hw) => hw.day === dayId);
  }

  return (
    <div className="px-4 py-8">

      {/* Вкладки */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[#1e3a5f] text-white bg-[#1e3a5f] rounded-t-md"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Kodutöö */}
      {activeTab === "Kodutöö" && (
        <div className="overflow-x-auto pb-4">
          {isLoading ? (
            <p className="text-sm text-gray-400 text-center py-12">Laadimine...</p>
          ) : (
            <div className="flex gap-3 justify-center">
              {DAYS.map((day) => (
                <div
                  key={day.id}
                  className="w-52 flex flex-col bg-gray-50 rounded-xl border border-gray-200 p-3"
                >
                  {/* Название дня */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {day.name}
                    </h2>
                    <button
                      onClick={() => addingForDay === day.id ? closeForm() : openForm(day.id)}
                      className="text-[#1e3a5f] hover:text-[#162d4a] transition-colors"
                    >
                      {addingForDay === day.id ? <X size={15} /> : <Plus size={15} />}
                    </button>
                  </div>

                  {/* Форма */}
                  {addingForDay === day.id && (
                    <form
                      onSubmit={(e) => handleSubmit(e, day.id)}
                      className="mb-3 p-3 rounded-lg border border-gray-200 bg-white flex flex-col gap-2"
                    >
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-[#1e3a5f] focus:outline-none"
                      >
                        <option value="" disabled>Vali aine...</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>

                      <textarea
                        placeholder="nt. lk 42, harjutus 12"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-[#1e3a5f] focus:outline-none resize-none"
                      />

                      {/* Выбор типа — 3 кнопки */}
                      <div className="flex flex-col gap-1">
                        {HW_TYPES.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setHwType(t.value)}
                            className={`flex-1 text-xs py-1 rounded-md border transition-colors focus:outline-none ${
                              hwType === t.value
                                ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {formError && (
                        <p className="text-xs text-red-500">{formError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-xs font-medium py-1.5 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isCreating ? "..." : "Lisa"}
                      </button>
                    </form>
                  )}

                  {/* Карточки */}
                  <div className="flex flex-col gap-2 flex-1">
                    {homeworkForDay(day.id).length === 0 ? (
                      <p className="text-xs text-gray-300 text-center py-4">Tühi</p>
                    ) : (
                      homeworkForDay(day.id).map((hw) => {
                        const style = TYPE_STYLES[hw.type as HwType] ?? TYPE_STYLES["kodutöö"];
                        return (
                          <div
                            key={hw.id}
                            className={`flex items-start justify-between gap-2 px-3 py-2.5 rounded-lg border bg-white ${style.card}`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className={`font-semibold text-xs leading-tight ${style.text}`}>
                                  {hw.subject}
                                </p>
                                {hw.type !== "kodutöö" && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${style.badge}`}>
                                    {hw.type}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 leading-snug break-words">{hw.description}</p>
                            </div>
                            <button
                              onClick={() => deleteHomework(hw.id)}
                              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tunniplaan */}
      {activeTab === "Tunniplaan" && (
        <div className="overflow-x-auto pb-4">
          {isScheduleLoading ? (
            <p className="text-sm text-gray-400 text-center py-12">Laadimine...</p>
          ) : (
            <div className="flex gap-3 justify-center">
              {SCHEDULE_DAYS.map((day) => (
                <div
                  key={day.id}
                  className="w-52 flex flex-col bg-gray-50 rounded-xl border border-gray-200 p-3"
                >
                  <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                    {day.name}
                  </h2>

                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((slot) => {
                      const entry = scheduleEntry(day.id, slot);
                      const time = SLOT_TIMES[day.id][slot - 1];
                      const isAdding = addingSlot?.day === day.id && addingSlot?.slot === slot;

                      return (
                        <div key={slot} className="rounded-lg border border-gray-200 bg-white p-2">
                          <p className="text-xs text-gray-400 mb-1">{time}</p>

                          {entry ? (
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-semibold text-[#1e3a5f] truncate">
                                {entry.subject}
                              </p>
                              <button
                                onClick={() => deleteSchedule(entry.id)}
                                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ) : isAdding ? (
                            <form onSubmit={(e) => handleScheduleSubmit(e, day.id, slot)} className="flex flex-col gap-1.5">
                              <select
                                value={schedSubject}
                                onChange={(e) => setSchedSubject(e.target.value)}
                                className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-xs focus:border-[#1e3a5f] focus:outline-none"
                              >
                                <option value="" disabled>Vali aine...</option>
                                {SUBJECTS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <div className="flex gap-1">
                                <button
                                  type="submit"
                                  disabled={!schedSubject || isScheduleCreating}
                                  className="flex-1 bg-[#1e3a5f] text-white text-xs py-1 rounded-md disabled:opacity-50"
                                >
                                  Lisa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setAddingSlot(null); setSchedSubject(""); }}
                                  className="text-gray-400 hover:text-gray-600 px-1"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button
                              onClick={() => { setAddingSlot({ day: day.id, slot }); setSchedSubject(""); }}
                              className="text-gray-300 hover:text-[#1e3a5f] transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Ressursid */}
      {activeTab === "Ressursid" && (
        <div className="max-w-xl mx-auto flex flex-col gap-3">
          {RESOURCES.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 px-5 py-4 border border-gray-200 rounded-xl bg-white hover:border-[#1e3a5f] transition-colors"
            >
              <span className="text-sm font-semibold text-[#1e3a5f]">{r.name}</span>
              <span className="text-xs text-gray-400">{r.description}</span>
            </a>
          ))}
        </div>
      )}

      {/* Materjalid */}
      {activeTab === "Materjalid" && (
        <div className="max-w-3xl mx-auto">
          {isMaterialsLoading ? (
            <p className="text-sm text-gray-400 text-center py-12">Laadimine...</p>
          ) : (
            <>
              {/* Buttons to open forms */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => { setShowImageForm(!showImageForm); setShowLinkForm(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1e3a5f] text-white text-sm rounded-md hover:bg-[#162d4a] transition-colors"
                >
                  <Plus size={14} /> Lisa pilt
                </button>
                <button
                  onClick={() => { setShowLinkForm(!showLinkForm); setShowImageForm(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-md hover:border-gray-300 transition-colors"
                >
                  <Plus size={14} /> Lisa link
                </button>
              </div>

              {/* Image upload form */}
              {showImageForm && (
                <form onSubmit={handleImageUpload} className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Nimi (nt. Füüsika konspekt)"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none"
                  />
                  <label className="cursor-pointer">
                    <span className="inline-block px-3 py-2 border border-gray-200 rounded-md bg-white text-sm text-gray-600 hover:border-gray-300 transition-colors">
                      {imageFile ? imageFile.name : "Vali pilt..."}
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!imageFile || !imageName.trim() || isUploading}
                      className="px-4 py-2 bg-[#1e3a5f] text-white text-sm rounded-md disabled:opacity-50"
                    >
                      {isUploading ? "Laadin..." : "Lae üles"}
                    </button>
                    <button type="button" onClick={() => setShowImageForm(false)} className="px-4 py-2 text-gray-400 text-sm">
                      Tühista
                    </button>
                  </div>
                </form>
              )}

              {/* Add link form */}
              {showLinkForm && (
                <form onSubmit={handleAddLink} className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Nimi (nt. Bioloogia slaidid)"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Link (https://...)"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!linkName.trim() || !linkUrl.trim() || isAddingLink}
                      className="px-4 py-2 bg-[#1e3a5f] text-white text-sm rounded-md disabled:opacity-50"
                    >
                      {isAddingLink ? "Lisan..." : "Lisa"}
                    </button>
                    <button type="button" onClick={() => setShowLinkForm(false)} className="px-4 py-2 text-gray-400 text-sm">
                      Tühista
                    </button>
                  </div>
                </form>
              )}

              {/* Images grid */}
              {materials.filter((m) => m.type === "image").length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Pildid</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {materials.filter((m) => m.type === "image").map((m) => (
                      <div key={m.id} className="relative group rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={materialsApi.imageUrl(m.url)}
                          alt={m.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-2 bg-white">
                          <p className="text-xs font-medium text-gray-700 truncate">{m.name}</p>
                        </div>
                        <button
                          onClick={() => deleteMaterial(m.id)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links list */}
              {materials.filter((m) => m.type === "link").length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Lingid</h3>
                  <div className="flex flex-col gap-2">
                    {materials.filter((m) => m.type === "link").map((m) => (
                      <div key={m.id} className="flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#1e3a5f] hover:underline truncate"
                        >
                          {m.name}
                        </a>
                        <button
                          onClick={() => deleteMaterial(m.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {materials.length === 0 && (
                <p className="text-sm text-gray-300 text-center py-12">Materjale pole veel lisatud.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}