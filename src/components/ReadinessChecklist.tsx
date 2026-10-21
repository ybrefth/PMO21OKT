import React, { useState, useMemo } from 'react';
import { ReadinessChecklistItem } from '../types/pmo';
import { INITIAL_READINESS_CHECKLIST } from '../data/readinessChecklistData';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  RotateCcw, 
  ListCheck, 
  GitCommit, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Search, 
  CheckSquare, 
  Square 
} from 'lucide-react';

interface ReadinessChecklistProps {
  items: ReadinessChecklistItem[];
  onUpdateItems: (items: ReadinessChecklistItem[]) => void;
}

export const ReadinessChecklist: React.FC<ReadinessChecklistProps> = ({
  items,
  onUpdateItems,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'timeline'>('checklist');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Accordion open/close state: Map of phase name to boolean (open or closed)
  // By default, open the first 2 phases and collapse the rest to keep it clean and prevent long scroll!
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({
    "1. Justification & Feasibility": true,
    "2. Governance & Charter": true,
  });

  const togglePhaseAccordion = (phase: string) => {
    setOpenPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  const expandAllPhases = () => {
    const allOpen: Record<string, boolean> = {};
    items.forEach(i => { allOpen[i.phase] = true; });
    setOpenPhases(allOpen);
  };

  const collapseAllPhases = () => {
    setOpenPhases({});
  };

  // Toggle item check status with automatic date & time stamp
  const toggleItem = (id: number) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated = items.map(item => {
      if (item.id === id) {
        const nextState = !item.isCompleted;
        return {
          ...item,
          isCompleted: nextState,
          completedAt: nextState ? (item.completedAt || formattedDate) : undefined,
        };
      }
      return item;
    });

    onUpdateItems(updated);
  };

  // Change completion date manually if required
  const updateDate = (id: number, dateString: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, completedAt: dateString };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  // Update notes
  const updateNotes = (id: number, notes: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, notes };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  // Stats
  const totalCount = items.length; // 40
  const completedCount = items.filter(i => i.isCompleted).length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  // Group phases into 7 clean categories
  const phaseCategories = useMemo(() => {
    const map = new Map<string, ReadinessChecklistItem[]>();
    items.forEach(item => {
      if (!map.has(item.phase)) {
        map.set(item.phase, []);
      }
      map.get(item.phase)!.push(item);
    });
    return Array.from(map.entries());
  }, [items]);

  // Chronological timeline items (only completed, sorted by completedAt ascending)
  const timelineSortedItems = useMemo(() => {
    const completed = items.filter(i => i.isCompleted && i.completedAt);
    return completed.sort((a, b) => {
      return (a.completedAt || '').localeCompare(b.completedAt || '');
    });
  }, [items]);

  // Filtered by search if user is querying
  const filteredPhaseCategories = useMemo(() => {
    if (!searchQuery.trim()) return phaseCategories;
    const q = searchQuery.toLowerCase();

    return phaseCategories.map(([phaseName, phaseItems]) => {
      const filtered = phaseItems.filter(i => 
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.responsibleRole && i.responsibleRole.toLowerCase().includes(q))
      );
      return [phaseName, filtered] as [string, ReadinessChecklistItem[]];
    }).filter(([_, items]) => items.length > 0);
  }, [phaseCategories, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            40 Pre-Project Readiness Checklist & Auto-Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tampilan ringkas berbasis akordion bebas scroll panjang. Mencentang item otomatis mencatat tanggal penyelesaian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded p-0.5 bg-slate-50 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListCheck className="w-3.5 h-3.5" />
              <span>Akordion Checklist</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Auto-Timeline ({completedCount})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Reset checklist ke status awal?")) {
                onUpdateItems(INITIAL_READINESS_CHECKLIST);
              }
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 text-xs flex items-center gap-1"
            title="Reset checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* INDIKATOR KEMAJUAN (PROGRESS BAR SEDERHANA) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-900">
              Kesiapan Pre-Project: {completedCount} / {totalCount} Dokumen Selesai
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              completionPercentage >= 90 ? 'bg-emerald-100 text-emerald-800' :
              completionPercentage >= 50 ? 'bg-blue-100 text-blue-800' :
              'bg-slate-100 text-slate-700'
            }`}>
              {completionPercentage}% Selesai
            </span>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {pendingCount === 0 ? "Seluruh 40 Kriteria Kesiapan Terpenuhi!" : `${pendingCount} Dokumen Tersisa`}
          </span>
        </div>

        {/* Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <div
            className="bg-slate-900 h-full rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* SEARCH & ACCORDION CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-3 shadow-xs text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari dokumen, nomor, atau PIC..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>

        {activeTab === 'checklist' && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={expandAllPhases}
              className="px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50"
            >
              Buka Semua Akordion
            </button>
            <button
              type="button"
              onClick={collapseAllPhases}
              className="px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50"
            >
              Tutup Semua Akordion
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: AKORDION CHECKLIST (BEBAS SCROLL PANJANG) */}
      {activeTab === 'checklist' && (
        <div className="space-y-3">
          {filteredPhaseCategories.map(([phaseName, phaseItems], phaseIdx) => {
            const isOpen = Boolean(openPhases[phaseName]);
            const completedInPhase = phaseItems.filter(i => i.isCompleted).length;
            const totalInPhase = phaseItems.length;
            const isAllCompleted = completedInPhase === totalInPhase;

            return (
              <div
                key={phaseName}
                className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden transition"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => togglePhaseAccordion(phaseName)}
                  className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
                    isOpen ? 'bg-slate-50/80 border-b border-slate-200' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {phaseIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {phaseName}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {totalInPhase} Kriteria Kesiapan Dokumen
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      isAllCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {completedInPhase} / {totalInPhase} Selesai
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Content (Items List) */}
                {isOpen && (
                  <div className="divide-y divide-slate-100">
                    {phaseItems.map(item => (
                      <div
                        key={item.id}
                        className={`p-3.5 hover:bg-slate-50/70 transition flex items-start gap-3 ${
                          item.isCompleted ? 'bg-slate-50/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-slate-900 focus:outline-none"
                          title={item.isCompleted ? "Tandai belum selesai" : "Centang untuk mencatat tanggal otomatis"}
                        >
                          {item.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                              #{item.id}
                            </span>
                            <span className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.2 rounded font-medium">
                              {item.category}
                            </span>

                            {/* Auto Completion Date */}
                            {item.isCompleted && item.completedAt && (
                              <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono ml-auto">
                                <Clock className="w-3 h-3 text-emerald-600" />
                                <span>Tercatat: {item.completedAt}</span>
                              </div>
                            )}
                          </div>

                          <h4 className={`text-xs font-bold ${
                            item.isCompleted ? 'text-slate-700 line-through' : 'text-slate-900'
                          }`}>
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                            {item.responsibleRole && (
                              <span>PIC: <strong className="text-slate-700">{item.responsibleRole}</strong></span>
                            )}

                            {/* Manual date adjustment */}
                            {item.isCompleted && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-400">Edit Tanggal:</span>
                                <input
                                  type="text"
                                  value={item.completedAt || ''}
                                  onChange={e => updateDate(item.id, e.target.value)}
                                  className="text-[11px] font-mono border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 focus:outline-none"
                                />
                              </div>
                            )}

                            {/* Notes */}
                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={e => updateNotes(item.id, e.target.value)}
                              placeholder="Tambah catatan nomor dokumen..."
                              className="text-[11px] border border-transparent hover:border-slate-200 focus:border-slate-900 rounded px-1.5 py-0.5 text-slate-600 flex-1 min-w-[140px] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TAMPILAN TIMELINE SEDERHANA */}
      {activeTab === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Urutan Kronologis Dokumen Selesai (Auto-Timeline)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Disusun otomatis berdasarkan tanggal dan jam yang tercatat saat dokumen dicentang pada checklist.
            </p>
          </div>

          {timelineSortedItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Belum ada dokumen yang dicentang. Silakan centang dokumen pada Akordion Checklist untuk membentuk timeline.
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timelineSortedItems.map(item => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-slate-900 border-4 border-white shadow-xs flex items-center justify-center text-white text-[9px]">
                    <Check className="w-2.5 h-2.5" />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 hover:border-slate-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                          #{item.id}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded self-start sm:self-auto">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        <span>{item.completedAt}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <span>Fase: <strong>{item.phase}</strong></span>
                      <span>•</span>
                      <span>PIC: <strong>{item.responsibleRole || "PMO"}</strong></span>
                      {item.notes && (
                        <>
                          <span>•</span>
                          <span className="text-slate-700 italic">"{item.notes}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
