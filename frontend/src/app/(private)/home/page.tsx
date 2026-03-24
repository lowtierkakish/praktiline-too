"use client";

import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { useGetHomework, useCreateHomework, useDeleteHomework } from "@/hooks/homework";

const DAYS = [
  { id: 1, name: "Esmaspäev" },
  { id: 2, name: "Teisipäev" },
  { id: 3, name: "Kolmapäev" },
  { id: 4, name: "Neljapäev" },
  { id: 5, name: "Reede" },
];

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

const TABS = ["Kodutöö", "Tunniplaan"] as const;
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
        <div className="text-center py-16 text-gray-400 text-sm">
          Tunniplaan on tulemas peagi.
        </div>
      )}
    </div>
  );
}