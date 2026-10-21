import React, { useState, useMemo } from 'react';
import { WBSNode, CPMTask } from '../types/pmo';
import { 
  getSuggestionsForLevel, 
  getRecommendedDuration, 
  WBS_DATABASE 
} from '../data/wbsDatabase';
import { DEFAULT_WBS_TREE } from '../data/defaultData';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Send, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Check, 
  Layers, 
  Clock, 
  User, 
  Table, 
  GitFork, 
  FileSpreadsheet, 
  Eye, 
  Lock, 
  Unlock, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface WBSBuilderProps {
  wbsTree: WBSNode[];
  onUpdateWBS: (nodes: WBSNode[]) => void;
  onSyncToCPM: (cpmTasks: CPMTask[]) => void;
  projectName?: string;
}

export const WBSBuilder: React.FC<WBSBuilderProps> = ({
  wbsTree,
  onUpdateWBS,
  onSyncToCPM,
  projectName = "Proyek",
}) => {
  // Navigation between Views: 'wizard' (Smart Step-by-Step), 'tree' (Tree Diagram), 'table' (WBS Table)
  const [activeView, setActiveView] = useState<'wizard' | 'tree' | 'table'>('wizard');

  // Excel Preview Modal
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  // Collapsed rows in table view
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  // --- SMART STEP-BY-STEP (BATCHING) WIZARD STATE ---
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Step 1: Level 1 selected items
  const allDbL1 = useMemo(() => WBS_DATABASE.map(item => item.name), []);
  const [selectedL1List, setSelectedL1List] = useState<string[]>([
    "Pengerukan Tanah & Pekerjaan Tanah"
  ]);
  const [customL1Input, setCustomL1Input] = useState('');

  // Step 2: Level 2 map: { [l1Name]: string[] }
  const [selectedL2Map, setSelectedL2Map] = useState<Record<string, string[]>>({
    "Pengerukan Tanah & Pekerjaan Tanah": [
      "Pekerjaan Persiapan & Survei Lahan",
      "Penggalian & Pengerukan Tanah (Excavation)",
      "Pemindahan & Pembuangan Material (Hauling & Disposal)",
      "Penimbunan Kembali & Pemadatan (Backfilling & Compaction)"
    ]
  });
  const [customL2Input, setCustomL2Input] = useState<Record<string, string>>({});

  // Step 3: Level 3 map: { [l2Name]: string[] }
  const [selectedL3Map, setSelectedL3Map] = useState<Record<string, string[]>>({});
  const [customL3Input, setCustomL3Input] = useState<Record<string, string>>({});

  // --- HELPER: Recompute WBS Codes recursively ---
  const recomputeCodes = (nodes: WBSNode[], parentCode: string = ''): WBSNode[] => {
    return nodes.map((node, index) => {
      const currentCode = parentCode ? `${parentCode}.${index + 1}` : `${index + 1}`;
      const level = currentCode.split('.').length;
      return {
        ...node,
        code: currentCode,
        level,
        children: node.children ? recomputeCodes(node.children, currentCode) : undefined,
      };
    });
  };

  // --- WIZARD HANDLERS ---
  const toggleL1Item = (item: string) => {
    if (selectedL1List.includes(item)) {
      setSelectedL1List(prev => prev.filter(i => i !== item));
    } else {
      setSelectedL1List(prev => [...prev, item]);
    }
  };

  const addCustomL1 = () => {
    if (!customL1Input.trim()) return;
    if (!selectedL1List.includes(customL1Input.trim())) {
      setSelectedL1List(prev => [...prev, customL1Input.trim()]);
    }
    setCustomL1Input('');
  };

  const handleLockLevel1 = () => {
    if (selectedL1List.length === 0) {
      alert("Pilih minimal 1 pekerjaan Level 1.");
      return;
    }

    // Auto-populate recommendations for Level 2
    const newL2Map: Record<string, string[]> = { ...selectedL2Map };
    selectedL1List.forEach(l1 => {
      if (!newL2Map[l1] || newL2Map[l1].length === 0) {
        const suggestions = getSuggestionsForLevel([l1], 2);
        newL2Map[l1] = suggestions.length > 0 ? suggestions : [`Pekerjaan Utama ${l1}`];
      }
    });
    setSelectedL2Map(newL2Map);
    setWizardStep(2);
  };

  const toggleL2Item = (l1: string, l2: string) => {
    const current = selectedL2Map[l1] || [];
    if (current.includes(l2)) {
      setSelectedL2Map(prev => ({
        ...prev,
        [l1]: current.filter(x => x !== l2)
      }));
    } else {
      setSelectedL2Map(prev => ({
        ...prev,
        [l1]: [...current, l2]
      }));
    }
  };

  const addCustomL2 = (l1: string) => {
    const val = (customL2Input[l1] || '').trim();
    if (!val) return;
    const current = selectedL2Map[l1] || [];
    if (!current.includes(val)) {
      setSelectedL2Map(prev => ({
        ...prev,
        [l1]: [...current, val]
      }));
    }
    setCustomL2Input(prev => ({ ...prev, [l1]: '' }));
  };

  const handleLockLevel2 = () => {
    // Auto-populate recommendations for Level 3
    const newL3Map: Record<string, string[]> = { ...selectedL3Map };
    selectedL1List.forEach(l1 => {
      const l2List = selectedL2Map[l1] || [];
      l2List.forEach(l2 => {
        if (!newL3Map[l2] || newL3Map[l2].length === 0) {
          const suggestions = getSuggestionsForLevel([l1, l2], 3);
          newL3Map[l2] = suggestions.length > 0 ? suggestions : [`Aktivitas Detail ${l2}`];
        }
      });
    });
    setSelectedL3Map(newL3Map);
    setWizardStep(3);
  };

  const toggleL3Item = (l2: string, l3: string) => {
    const current = selectedL3Map[l2] || [];
    if (current.includes(l3)) {
      setSelectedL3Map(prev => ({
        ...prev,
        [l2]: current.filter(x => x !== l3)
      }));
    } else {
      setSelectedL3Map(prev => ({
        ...prev,
        [l2]: [...current, l3]
      }));
    }
  };

  const addCustomL3 = (l2: string) => {
    const val = (customL3Input[l2] || '').trim();
    if (!val) return;
    const current = selectedL3Map[l2] || [];
    if (!current.includes(val)) {
      setSelectedL3Map(prev => ({
        ...prev,
        [l2]: [...current, val]
      }));
    }
    setCustomL3Input(prev => ({ ...prev, [l2]: '' }));
  };

  // Compile Wizard Selections into the Full WBS Tree
  const handleApplyWizardToWBS = () => {
    const newTree: WBSNode[] = selectedL1List.map((l1, l1Idx) => {
      const l2Items = selectedL2Map[l1] || [];
      return {
        id: `wbs-wz-1-${l1Idx}-${Date.now()}`,
        code: `${l1Idx + 1}`,
        level: 1,
        name: l1,
        durationDays: 45,
        assignedRole: "Project Manager",
        children: l2Items.map((l2, l2Idx) => {
          const l3Items = selectedL3Map[l2] || [];
          return {
            id: `wbs-wz-2-${l1Idx}-${l2Idx}-${Date.now()}`,
            code: `${l1Idx + 1}.${l2Idx + 1}`,
            level: 2,
            name: l2,
            durationDays: 14,
            assignedRole: "Superintendent",
            children: l3Items.map((l3, l3Idx) => ({
              id: `wbs-wz-3-${l1Idx}-${l2Idx}-${l3Idx}-${Date.now()}`,
              code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}`,
              level: 3,
              name: l3,
              durationDays: getRecommendedDuration([l1, l2, l3]) || 5,
              assignedRole: "Site Supervisor",
              children: []
            }))
          };
        })
      };
    });

    const calculated = recomputeCodes(newTree);
    onUpdateWBS(calculated);
    setActiveView('tree'); // Switch to Tree Diagram view to see results
  };

  // --- FLAT TABLE & EXCEL EXPORT HELPERS ---
  const flattenWBS = (nodes: WBSNode[]): {
    code: string;
    level: number;
    name: string;
    duration: number;
    role: string;
    cost: number;
  }[] => {
    const result: any[] = [];
    const traverse = (items: WBSNode[]) => {
      items.forEach(item => {
        result.push({
          code: item.code,
          level: item.level,
          name: item.name,
          duration: item.durationDays,
          role: item.assignedRole || "-",
          cost: item.costEstimate || 0,
        });
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };
    traverse(nodes);
    return result;
  };

  const flatRowsForExcel = useMemo(() => flattenWBS(wbsTree), [wbsTree]);

  // Real Excel Export using xlsx (SheetJS)
  const handleExportToExcel = () => {
    const worksheetData = [
      ["WBS Code", "Level", "Nama Pekerjaan / Paket Kerja", "Durasi (Hari)", "Penanggung Jawab (PIC)", "Estimasi Biaya (IDR)"],
      ...flatRowsForExcel.map(row => [
        row.code,
        `Level ${row.level}`,
        "  ".repeat(row.level - 1) + row.name,
        row.duration,
        row.role,
        row.cost
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    // Set column widths
    ws['!cols'] = [
      { wch: 15 },
      { wch: 10 },
      { wch: 45 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WBS Structure");

    const sanitizedProjectName = (projectName || "PMO_Project").replace(/[^a-zA-Z0-9_-]/g, "_");
    XLSX.writeFile(wb, `${sanitizedProjectName}_WBS.xlsx`);
  };

  // Send Leaf tasks to CPM Analysis
  const handleExtractToCPM = () => {
    const leafNodes: WBSNode[] = [];
    const extractLeaves = (nodes: WBSNode[]) => {
      nodes.forEach(n => {
        if (!n.children || n.children.length === 0) {
          leafNodes.push(n);
        } else {
          extractLeaves(n.children);
        }
      });
    };
    extractLeaves(wbsTree);

    if (leafNodes.length === 0) {
      alert("Tidak ada aktivitas pekerjaan yang ditemukan.");
      return;
    }

    const cpmTasks: CPMTask[] = leafNodes.map((leaf, index) => {
      const letterId = String.fromCharCode(65 + (index % 26)) + (index >= 26 ? Math.floor(index / 26) : '');
      const predecessor = index > 0 ? [String.fromCharCode(65 + ((index - 1) % 26)) + (index - 1 >= 26 ? Math.floor((index - 1) / 26) : '')] : [];
      return {
        id: letterId,
        name: `[${leaf.code}] ${leaf.name}`,
        duration: leaf.durationDays || 3,
        predecessors: predecessor,
      };
    });

    onSyncToCPM(cpmTasks);
    setSyncToast(true);
    setTimeout(() => setSyncToast(false), 3000);
  };

  // Tree Table operations
  const handleUpdateNode = (nodeId: string, field: keyof WBSNode, value: any) => {
    const updateField = (nodes: WBSNode[]): WBSNode[] => {
      return nodes.map(n => {
        if (n.id === nodeId) {
          return { ...n, [field]: value };
        }
        if (n.children) {
          return { ...n, children: updateField(n.children) };
        }
        return n;
      });
    };
    onUpdateWBS(updateField(wbsTree));
  };

  const handleAddChild = (parentNode: WBSNode) => {
    if (parentNode.level >= 6) {
      alert("Maksimal sampai Level 6 sesuai standar PMO.");
      return;
    }
    const newNode: WBSNode = {
      id: `wbs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code: '',
      level: parentNode.level + 1,
      name: `Pekerjaan Baru Level ${parentNode.level + 1}`,
      durationDays: 3,
      assignedRole: 'Pelaksana Lapangan',
      children: [],
    };

    const append = (nodes: WBSNode[]): WBSNode[] => {
      return nodes.map(n => {
        if (n.id === parentNode.id) {
          return { ...n, children: [...(n.children || []), newNode] };
        }
        if (n.children) {
          return { ...n, children: append(n.children) };
        }
        return n;
      });
    };
    onUpdateWBS(recomputeCodes(append(wbsTree)));
  };

  const handleDeleteNode = (nodeId: string) => {
    const remove = (nodes: WBSNode[]): WBSNode[] => {
      return nodes
        .filter(n => n.id !== nodeId)
        .map(n => ({
          ...n,
          children: n.children ? remove(n.children) : undefined,
        }));
    };
    onUpdateWBS(recomputeCodes(remove(wbsTree)));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">WBS Generator</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengisian bertahap (batching flow) Level 1 s/d Level 6, Diagram Hirarki, dan Ekspor Excel otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {syncToast && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded inline-flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Disinkronkan ke CPM
            </span>
          )}

          {/* View Toggle */}
          <div className="flex items-center border border-slate-200 rounded p-0.5 bg-slate-50 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveView('wizard')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'wizard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Wizard Bertahap</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('tree')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'tree'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Diagram Hirarki</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'table'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabel WBS</span>
            </button>
          </div>

          {/* Tombol Lihat Data Excel */}
          <button
            type="button"
            onClick={() => setIsExcelPreviewOpen(true)}
            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded text-xs font-medium flex items-center gap-1.5 shadow-xs transition"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lihat Data Excel</span>
          </button>

          {/* Tombol Export to Excel */}
          <button
            type="button"
            onClick={handleExportToExcel}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export to Excel (.xlsx)</span>
          </button>

          {/* Send to CPM */}
          <button
            type="button"
            onClick={handleExtractToCPM}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim ke CPM</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SMART STEP-BY-STEP (BATCHING) WIZARD */}
      {activeView === 'wizard' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-6 text-xs font-medium">
              <div className={`flex items-center gap-2 ${wizardStep >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  wizardStep > 1 ? 'bg-emerald-600 text-white' : wizardStep === 1 ? 'bg-slate-900 text-white' : 'bg-slate-200'
                }`}>
                  {wizardStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </span>
                <span>Langkah 1: Tentukan & Kunci Level 1</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />

              <div className={`flex items-center gap-2 ${wizardStep >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  wizardStep > 2 ? 'bg-emerald-600 text-white' : wizardStep === 2 ? 'bg-slate-900 text-white' : 'bg-slate-200'
                }`}>
                  {wizardStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                </span>
                <span>Langkah 2: Rekomendasi Level 2</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />

              <div className={`flex items-center gap-2 ${wizardStep === 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  wizardStep === 3 ? 'bg-slate-900 text-white' : 'bg-slate-200'
                }`}>
                  3
                </span>
                <span>Langkah 3: Rekomendasi Level 3</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">
              Mode Batching Otomatis
            </span>
          </div>

          {/* STEP 1: LEVEL 1 BATCH SELECTION */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Langkah 1: Pilih & Kunci Semua Pekerjaan Utama (Level 1)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan komponen utama proyek Anda. Setelah Level 1 dikunci, sistem otomatis menyediakan rekomendasi Level 2 untuk tiap item.
                </p>
              </div>

              {/* Recommended L1 checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allDbL1.map(item => {
                  const isChecked = selectedL1List.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleL1Item(item)}
                      className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-2.5 ${
                        isChecked
                          ? 'border-slate-900 bg-slate-50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <button type="button" className="mt-0.5 text-slate-900">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-slate-900" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-slate-900 block">{item}</span>
                        <span className="text-[10px] text-slate-500">Rekomendasi Database PMO</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Level 1 add input */}
              <div className="flex items-center gap-2 max-w-md pt-2">
                <input
                  type="text"
                  value={customL1Input}
                  onChange={e => setCustomL1Input(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addCustomL1(); }}
                  placeholder="Atau ketik pekerjaan Level 1 kustom..."
                  className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={addCustomL1}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium border border-slate-300"
                >
                  Tambah L1
                </button>
              </div>

              {/* Lock Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  {selectedL1List.length} Pekerjaan Level 1 terpilih
                </span>
                <button
                  type="button"
                  onClick={handleLockLevel1}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kunci & Lanjut ke Level 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LEVEL 2 BATCH RECOMMENDATIONS */}
          {wizardStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Langkah 2: Rekomendasi Level 2 untuk Tiap Level 1 yang Dikunci
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sistem telah menghasilkan rekomendasi paket kerja Level 2. Centang atau sesuaikan sebelum mengunci.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Kunci Level 1</span>
                </button>
              </div>

              {/* Grouped by Level 1 */}
              <div className="space-y-5">
                {selectedL1List.map((l1, idx) => {
                  const suggestions = getSuggestionsForLevel([l1], 2);
                  const activeL2List = selectedL2Map[l1] || [];

                  return (
                    <div key={l1} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-900 text-white text-[11px] font-mono font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{l1}</h4>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {activeL2List.length} Paket Kerja Level 2
                        </span>
                      </div>

                      {/* Checkboxes for L2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestions.map(s => {
                          const checked = activeL2List.includes(s);
                          return (
                            <div
                              key={s}
                              onClick={() => toggleL2Item(l1, s)}
                              className={`p-2.5 rounded border cursor-pointer transition flex items-center gap-2 text-xs ${
                                checked ? 'border-slate-900 bg-white font-medium text-slate-900' : 'border-slate-200 bg-slate-100/60 text-slate-500'
                              }`}
                            >
                              <button type="button">
                                {checked ? (
                                  <CheckSquare className="w-4 h-4 text-slate-900" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </button>
                              <span className="truncate">{s}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add custom L2 */}
                      <div className="flex items-center gap-2 max-w-sm pt-1">
                        <input
                          type="text"
                          value={customL2Input[l1] || ''}
                          onChange={e => setCustomL2Input(prev => ({ ...prev, [l1]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') addCustomL2(l1); }}
                          placeholder={`Tambah L2 kustom untuk ${l1.substring(0, 18)}...`}
                          className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomL2(l1)}
                          className="px-2.5 py-1.5 bg-slate-200 text-slate-800 rounded text-xs font-medium"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Bar */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Level 1</span>
                </button>

                <button
                  type="button"
                  onClick={handleLockLevel2}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kunci & Lanjut ke Level 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LEVEL 3 BATCH RECOMMENDATIONS & FINALIZE */}
          {wizardStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Langkah 3: Tinjau Rekomendasi Level 3 & Terapkan Struktur WBS
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rekomendasi aktivitas sub-paket Level 3 siap ditinjau. Klik "Terapkan Struktur WBS" untuk menghasilkan diagram dan tabel secara otomatis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Kunci Level 2</span>
                </button>
              </div>

              {/* Grouped by Level 2 items */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                {selectedL1List.map(l1 => {
                  const l2List = selectedL2Map[l1] || [];
                  return (
                    <div key={l1} className="space-y-3">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded">
                        {l1}
                      </div>

                      {l2List.map(l2 => {
                        const suggestions = getSuggestionsForLevel([l1, l2], 3);
                        const activeL3List = selectedL3Map[l2] || [];

                        return (
                          <div key={l2} className="border border-slate-200 rounded p-3 bg-white space-y-2 ml-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                                {l2}
                              </span>
                              <span className="text-[11px] text-slate-500">{activeL3List.length} sub-pekerjaan</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                              {suggestions.map(s => {
                                const checked = activeL3List.includes(s);
                                return (
                                  <div
                                    key={s}
                                    onClick={() => toggleL3Item(l2, s)}
                                    className={`p-2 rounded border cursor-pointer transition flex items-center gap-2 ${
                                      checked ? 'border-slate-800 bg-slate-50 text-slate-900 font-medium' : 'border-slate-200 text-slate-500'
                                    }`}
                                  >
                                    <button type="button">
                                      {checked ? <CheckSquare className="w-3.5 h-3.5 text-slate-900" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
                                    </button>
                                    <span className="truncate">{s}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Add custom L3 */}
                            <div className="flex items-center gap-2 max-w-sm pt-1">
                              <input
                                type="text"
                                value={customL3Input[l2] || ''}
                                onChange={e => setCustomL3Input(prev => ({ ...prev, [l2]: e.target.value }))}
                                onKeyDown={e => { if (e.key === 'Enter') addCustomL3(l2); }}
                                placeholder={`Tambah detail L3...`}
                                className="flex-1 text-[11px] px-2 py-1 border border-slate-300 rounded focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => addCustomL3(l2)}
                                className="px-2 py-1 bg-slate-200 text-slate-800 rounded text-[11px] font-medium"
                              >
                                Tambah
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Finalize Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Level 2</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyWizardToWBS}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Kunci & Terapkan ke Struktur WBS Lengkap</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DIAGRAM HIRARKI (VERTICAL TREE DIAGRAM) */}
      {activeView === 'tree' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Diagram Hirarki WBS (Tree Structure)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Representasi pohon vertikal terstruktur dengan garis penghubung bertingkat dari Level 1 sampai daun paket kerja.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-mono">L1 Domain</span>
              <span className="px-2 py-0.5 bg-slate-700 text-white rounded text-[10px] font-mono">L2 Paket Kerja</span>
              <span className="px-2 py-0.5 bg-blue-700 text-white rounded text-[10px] font-mono">L3 Sub-Paket</span>
            </div>
          </div>

          {/* Vertical Downward Tree Rendering */}
          <div className="overflow-x-auto p-4 bg-slate-50/50 rounded-lg border border-slate-100 min-h-[420px]">
            <div className="min-w-[800px] space-y-8">
              {wbsTree.map((l1Node) => (
                <div key={l1Node.id} className="relative">
                  {/* Level 1 Card */}
                  <div className="inline-block p-3 rounded-lg bg-slate-900 text-white shadow-xs border border-slate-800 max-w-sm">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded font-bold">
                        WBS {l1Node.code}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300">
                        {l1Node.durationDays} Hari
                      </span>
                    </div>
                    <p className="font-bold text-xs">{l1Node.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">PIC: {l1Node.assignedRole || "PM"}</p>
                  </div>

                  {/* Children (Level 2) with downward branching lines */}
                  {Boolean(l1Node.children && l1Node.children.length > 0) && (
                    <div className="ml-8 mt-4 pl-6 border-l-2 border-slate-300 space-y-6 relative before:absolute before:-top-4 before:left-0 before:w-6 before:h-0.5 before:bg-slate-300">
                      {l1Node.children!.map((l2Node) => (
                        <div key={l2Node.id} className="relative before:absolute before:top-4 before:-left-6 before:w-6 before:h-0.5 before:bg-slate-300">
                          {/* Level 2 Card */}
                          <div className="inline-block p-2.5 rounded bg-white border border-slate-300 shadow-2xs max-w-sm">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded font-bold">
                                {l2Node.code}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {l2Node.durationDays}d
                              </span>
                            </div>
                            <p className="font-semibold text-xs text-slate-900">{l2Node.name}</p>
                          </div>

                          {/* Children (Level 3) */}
                          {Boolean(l2Node.children && l2Node.children.length > 0) && (
                            <div className="ml-6 mt-3 pl-4 border-l-2 border-slate-200 space-y-2.5">
                              {l2Node.children!.map((l3Node) => (
                                <div key={l3Node.id} className="flex items-center gap-2 text-xs">
                                  <span className="w-2.5 h-0.5 bg-slate-300"></span>
                                  <div className="p-1.5 px-2.5 rounded bg-slate-100/80 border border-slate-200 flex items-center gap-2">
                                    <span className="font-mono text-[10px] font-bold text-blue-800">{l3Node.code}</span>
                                    <span className="text-slate-800 text-[11px]">{l3Node.name}</span>
                                    <span className="text-[10px] font-mono text-slate-500 bg-white px-1 rounded">{l3Node.durationDays}d</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TABEL HIRARKI LENGKAP */}
      {activeView === 'table' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Tabel Hirarki WBS (Dictionary Data)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Edit langsung nama pekerjaan, durasi (hari), penanggung jawab, atau tambah sub-pekerjaan baru.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {flatRowsForExcel.length} Total Baris
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-28">Kode WBS</th>
                  <th className="py-2.5 px-3 w-16">Level</th>
                  <th className="py-2.5 px-3">Nama Paket Kerja / Deskripsi Aktivitas</th>
                  <th className="py-2.5 px-3 w-24">Durasi</th>
                  <th className="py-2.5 px-3 w-36">PIC</th>
                  <th className="py-2.5 px-3 w-24 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wbsTree.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada struktur WBS. Gunakan Wizard Bertahap untuk mulai.
                    </td>
                  </tr>
                ) : (
                  flatRowsForExcel.map(row => (
                    <tr key={row.code} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{row.code}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                          L{row.level}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div style={{ paddingLeft: `${(row.level - 1) * 16}px` }} className="flex items-center gap-1.5">
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-900 font-medium">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{row.duration} Hari</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.role}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] text-slate-400 font-mono">OK</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: LIHAT DATA EXCEL (TABLE PREVIEW MODAL) */}
      {isExcelPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col border border-slate-300 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <h3 className="text-xs font-bold uppercase tracking-wide">
                  Pratinjau Data Lembar Kerja Excel (Excel Spreadsheet Preview)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportToExcel}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File .xlsx</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExcelPreviewOpen(false)}
                  className="p-1 rounded text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Spreadsheet View */}
            <div className="flex-1 overflow-auto p-4 bg-slate-50">
              <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden">
                <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 text-[11px] text-emerald-900 font-mono flex items-center justify-between">
                  <span>Nama File: <strong>{projectName}_WBS.xlsx</strong></span>
                  <span>Format: <strong>Microsoft Excel Worksheet (.xlsx)</strong></span>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono text-[11px]">
                    <tr>
                      <th className="p-2.5 border-r border-slate-300 w-12 text-center bg-slate-200">#</th>
                      <th className="p-2.5 border-r border-slate-300 w-28">A [WBS Code]</th>
                      <th className="p-2.5 border-r border-slate-300 w-20">B [Level]</th>
                      <th className="p-2.5 border-r border-slate-300">C [Nama Pekerjaan / Paket Kerja]</th>
                      <th className="p-2.5 border-r border-slate-300 w-28">D [Durasi (Hari)]</th>
                      <th className="p-2.5 border-r border-slate-300 w-36">E [PIC / Peran]</th>
                      <th className="p-2.5">F [Estimasi Biaya]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {flatRowsForExcel.map((row, idx) => (
                      <tr key={row.code} className="hover:bg-blue-50/50">
                        <td className="p-2 border-r border-slate-200 text-center font-mono text-[10px] text-slate-400 bg-slate-50">
                          {idx + 1}
                        </td>
                        <td className="p-2 border-r border-slate-200 font-mono font-bold text-slate-800">
                          {row.code}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-slate-600 font-mono text-[11px]">
                          Level {row.level}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-slate-900">
                          <span style={{ paddingLeft: `${(row.level - 1) * 14}px` }} className="inline-block">
                            {row.name}
                          </span>
                        </td>
                        <td className="p-2 border-r border-slate-200 font-mono text-slate-800">
                          {row.duration} Hari
                        </td>
                        <td className="p-2 border-r border-slate-200 text-slate-600">
                          {row.role}
                        </td>
                        <td className="p-2 font-mono text-slate-700">
                          IDR {row.cost.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Total {flatRowsForExcel.length} baris data siap diekspor ke Microsoft Excel
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExcelPreviewOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleExportToExcel}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to Excel (.xlsx) Sekarang</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
