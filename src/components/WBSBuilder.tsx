import React, { useState, useMemo } from 'react';
import { WBSNode, CPMTask } from '../types/pmo';
import { 
  getSuggestionsForLevel, 
  WBS_DATABASE, 
  WBSRecommendationNode 
} from '../data/wbsDatabase';
import { DEFAULT_WBS_TREE } from '../data/defaultData';
import { 
  Plus, 
  Trash2, 
  Send, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Check, 
  Clock, 
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
  Square, 
  Database, 
  BookOpen, 
  CheckCircle2 
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
  projectName = "Proyek Pengembangan Jaringan PDAM",
}) => {
  // Navigation: 'wizard' (Wizard Bertahap), 'tree' (Diagram Hirarki), 'table' (Tabel WBS), 'database' (Database Template)
  const [activeView, setActiveView] = useState<'wizard' | 'tree' | 'table' | 'database'>('tree');
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  // --- SMART STEP-BY-STEP (BATCHING) WIZARD STATE ---
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const allDbL1 = useMemo(() => WBS_DATABASE.map(item => item.name), []);
  const [selectedL1List, setSelectedL1List] = useState<string[]>([
    "Persiapan Umum",
    "Perencanaan Teknis",
    "Pengadaan Material dan Jasa",
    "Konstruksi Jaringan",
    "Pengujian dan Serah Terima",
    "Operasi dan Pemeliharaan Awal"
  ]);
  const [customL1Input, setCustomL1Input] = useState('');

  // Step 2: Level 2 map
  const [selectedL2Map, setSelectedL2Map] = useState<Record<string, string[]>>({
    "Persiapan Umum": ["Persiapan Lahan", "Operasional", "Mobilisasi"],
    "Perencanaan Teknis": ["Survei dan Investigasi", "Perancangan Teknik", "Perizinan dan Persetujuan"],
    "Pengadaan Material dan Jasa": ["Pengadaan Material Pipa dan Aksesoris", "Pengadaan Peralatan", "Pengadaan Jasa Kontraktor"],
    "Konstruksi Jaringan": ["Pekerjaan Gali dan Urug", "Pemasangan Pipa dan Aksesoris", "Pekerjaan Struktur dan Kelengkapan"],
    "Pengujian dan Serah Terima": ["Pengujian Jaringan", "Desinfeksi dan Pembilasan Pipa", "Serah Terima dan Dokumentasi"],
    "Operasi dan Pemeliharaan Awal": ["Uji Coba Operasi", "Pelatihan Operator", "Pemeliharaan Awal"]
  });
  const [customL2Input, setCustomL2Input] = useState<Record<string, string>>({});

  // Step 3: Level 3 map
  const [selectedL3Map, setSelectedL3Map] = useState<Record<string, string[]>>({});
  const [customL3Input, setCustomL3Input] = useState<Record<string, string>>({});

  // --- DATABASE TEMPLATE TAB STATE ---
  const [customDatabase, setCustomDatabase] = useState<WBSRecommendationNode[]>(() => {
    try {
      const saved = localStorage.getItem('pmo_custom_wbs_db');
      return saved ? JSON.parse(saved) : WBS_DATABASE;
    } catch {
      return WBS_DATABASE;
    }
  });
  const [selectedDbCategoryIdx, setSelectedDbCategoryIdx] = useState<number>(0);
  const [newTemplateCategoryName, setNewTemplateCategoryName] = useState('');
  const [newDbL1Name, setNewDbL1Name] = useState('');
  const [newDbL2Name, setNewDbL2Name] = useState('');
  const [newDbL3Name, setNewDbL3Name] = useState('');

  // Helper: Recompute WBS Codes recursively
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
      setSelectedL2Map(prev => ({ ...prev, [l1]: current.filter(x => x !== l2) }));
    } else {
      setSelectedL2Map(prev => ({ ...prev, [l1]: [...current, l2] }));
    }
  };

  const addCustomL2 = (l1: string) => {
    const val = (customL2Input[l1] || '').trim();
    if (!val) return;
    const current = selectedL2Map[l1] || [];
    if (!current.includes(val)) {
      setSelectedL2Map(prev => ({ ...prev, [l1]: [...current, val] }));
    }
    setCustomL2Input(prev => ({ ...prev, [l1]: '' }));
  };

  const handleLockLevel2 = () => {
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
      setSelectedL3Map(prev => ({ ...prev, [l2]: current.filter(x => x !== l3) }));
    } else {
      setSelectedL3Map(prev => ({ ...prev, [l2]: [...current, l3] }));
    }
  };

  const addCustomL3 = (l2: string) => {
    const val = (customL3Input[l2] || '').trim();
    if (!val) return;
    const current = selectedL3Map[l2] || [];
    if (!current.includes(val)) {
      setSelectedL3Map(prev => ({ ...prev, [l2]: [...current, val] }));
    }
    setCustomL3Input(prev => ({ ...prev, [l2]: '' }));
  };

  const handleApplyWizardToWBS = () => {
    const newTree: WBSNode[] = selectedL1List.map((l1, l1Idx) => {
      const l2Items = selectedL2Map[l1] || [];
      return {
        id: `wbs-wz-1-${l1Idx}-${Date.now()}`,
        code: `${l1Idx + 1}`,
        level: 1,
        name: l1,
        durationWeeks: 4,
        pic: "Project Manager",
        children: l2Items.map((l2, l2Idx) => {
          const l3Items = selectedL3Map[l2] || [];
          return {
            id: `wbs-wz-2-${l1Idx}-${l2Idx}-${Date.now()}`,
            code: `${l1Idx + 1}.${l2Idx + 1}`,
            level: 2,
            name: l2,
            durationWeeks: 2,
            pic: "Work Package Lead",
            children: l3Items.map((l3, l3Idx) => ({
              id: `wbs-wz-3-${l1Idx}-${l2Idx}-${l3Idx}-${Date.now()}`,
              code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}`,
              level: 3,
              name: l3,
              durationWeeks: 1,
              pic: "Site Engineer",
              children: [
                {
                  id: `wbs-wz-4-${l1Idx}-${l2Idx}-${l3Idx}-1-${Date.now()}`,
                  code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}.1`,
                  level: 4,
                  name: `Pekerjaan Pelaksanaan ${l3}`,
                  durationWeeks: 1,
                  pic: "Mandor Pelaksana",
                  children: [
                    {
                      id: `wbs-wz-5-${l1Idx}-${l2Idx}-${l3Idx}-1-1-${Date.now()}`,
                      code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}.1.1`,
                      level: 5,
                      name: `Pemeriksaan dan operasional teknis ${l3}`,
                      durationWeeks: 1,
                      pic: "Teknisi Lapangan",
                      tool: "Alat ukur & kamera",
                      children: [
                        {
                          id: `wbs-wz-6-${l1Idx}-${l2Idx}-${l3Idx}-1-1-1-${Date.now()}`,
                          code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}.1.1.1`,
                          level: 6,
                          name: `Penyusunan laporan & serah terima hasil uji ${l3}`,
                          durationWeeks: 1,
                          pic: "QA/QC Lead",
                          tool: "Software & printer",
                          material: "Form Berita Acara & Dokumen"
                        }
                      ]
                    }
                  ]
                }
              ]
            }))
          };
        })
      };
    });

    const calculated = recomputeCodes(newTree);
    onUpdateWBS(calculated);
    setActiveView('tree');
  };

  // --- FLATTEN WBS TO ROW DATA MATCHING ATTACHMENT 2 (Yellow highlight cols) ---
  interface WBSAttachmentRow {
    l1Code: string;
    l1Name: string;
    l2Code: string;
    l2Name: string;
    l3Code: string;
    l3Name: string;
    l4Code: string;
    l4Name: string;
    l5Code: string;
    l5Name: string;
    l6Tool: string;
    l6Material: string;
    pic: string;
    durationWeeks: number;
  }

  const flattenedAttachmentRows = useMemo((): WBSAttachmentRow[] => {
    const rows: WBSAttachmentRow[] = [];

    wbsTree.forEach(l1 => {
      if (!l1.children || l1.children.length === 0) {
        rows.push({
          l1Code: l1.code,
          l1Name: l1.name,
          l2Code: "",
          l2Name: "",
          l3Code: "",
          l3Name: "",
          l4Code: "",
          l4Name: "",
          l5Code: "",
          l5Name: "",
          l6Tool: l1.tool || "-",
          l6Material: l1.material || "-",
          pic: l1.pic || "PM",
          durationWeeks: l1.durationWeeks || 2,
        });
        return;
      }

      l1.children.forEach(l2 => {
        if (!l2.children || l2.children.length === 0) {
          rows.push({
            l1Code: l1.code,
            l1Name: l1.name,
            l2Code: l2.code,
            l2Name: l2.name,
            l3Code: "",
            l3Name: "",
            l4Code: "",
            l4Name: "",
            l5Code: "",
            l5Name: "",
            l6Tool: l2.tool || "-",
            l6Material: l2.material || "-",
            pic: l2.pic || "PIC L2",
            durationWeeks: l2.durationWeeks || 2,
          });
          return;
        }

        l2.children.forEach(l3 => {
          if (!l3.children || l3.children.length === 0) {
            rows.push({
              l1Code: l1.code,
              l1Name: l1.name,
              l2Code: l2.code,
              l2Name: l2.name,
              l3Code: l3.code,
              l3Name: l3.name,
              l4Code: "",
              l4Name: "",
              l5Code: "",
              l5Name: "",
              l6Tool: l3.tool || "-",
              l6Material: l3.material || "-",
              pic: l3.pic || "PIC L3",
              durationWeeks: l3.durationWeeks || 1,
            });
            return;
          }

          l3.children.forEach(l4 => {
            if (!l4.children || l4.children.length === 0) {
              rows.push({
                l1Code: l1.code,
                l1Name: l1.name,
                l2Code: l2.code,
                l2Name: l2.name,
                l3Code: l3.code,
                l3Name: l3.name,
                l4Code: l4.code,
                l4Name: l4.name,
                l5Code: "",
                l5Name: "",
                l6Tool: l4.tool || "-",
                l6Material: l4.material || "-",
                pic: l4.pic || "PIC L4",
                durationWeeks: l4.durationWeeks || 1,
              });
              return;
            }

            l4.children.forEach(l5 => {
              if (!l5.children || l5.children.length === 0) {
                rows.push({
                  l1Code: l1.code,
                  l1Name: l1.name,
                  l2Code: l2.code,
                  l2Name: l2.name,
                  l3Code: l3.code,
                  l3Name: l3.name,
                  l4Code: l4.code,
                  l4Name: l4.name,
                  l5Code: l5.code,
                  l5Name: l5.name,
                  l6Tool: l5.tool || "-",
                  l6Material: l5.material || "-",
                  pic: l5.pic || "PIC L5",
                  durationWeeks: l5.durationWeeks || 1,
                });
                return;
              }

              l5.children.forEach(l6 => {
                rows.push({
                  l1Code: l1.code,
                  l1Name: l1.name,
                  l2Code: l2.code,
                  l2Name: l2.name,
                  l3Code: l3.code,
                  l3Name: l3.name,
                  l4Code: l4.code,
                  l4Name: l4.name,
                  l5Code: l5.code,
                  l5Name: l5.name,
                  l6Tool: l6.tool || l5.tool || "-",
                  l6Material: l6.material || l6.name,
                  pic: l6.pic || l5.pic || "PIC L6",
                  durationWeeks: l6.durationWeeks || 1,
                });
              });
            });
          });
        });
      });
    });

    return rows;
  }, [wbsTree]);

  // Real Excel Export formatted exactly like Attachment 2 (Yellow highlight for Level 2, 3, 4)
  const handleExportToExcel = () => {
    const wsData: any[][] = [
      // Row 1: Merged Headers
      [
        "WBS LEVEL 1 (NAMA PROYEK)", "",
        "WBS LEVEL 2 (RUMPUN PEKERJAAN)", "",
        "WBS LEVEL 3 (JENIS PEKERJAAN)", "",
        "WBS LEVEL 4 (PAKET PEKERJAAN)", "",
        "WBS LEVEL 5 (AKTIVITAS)", "",
        "WBS LEVEL 6 (SUMBER DAYA / DETAIL)", "", ""
      ],
      // Row 2: Sub-headers
      [
        "CODE", "PROJECT NAME",
        "CODE", "WORK SECTION",
        "CODE", "TYPE OF WORK",
        "CODE", "WORK PACKAGE",
        "CODE", "ACTIVITY",
        "TOOL", "MATERIAL", "PIC (PENANGGUNG JAWAB)"
      ],
      // Rows: Data
      ...flattenedAttachmentRows.map(row => [
        row.l1Code, row.l1Name,
        row.l2Code, row.l2Name,
        row.l3Code, row.l3Name,
        row.l4Code, row.l4Name,
        row.l5Code, row.l5Name,
        row.l6Tool, row.l6Material, row.pic
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Merge ranges for Header Row 1
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } },
      { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } },
      { s: { r: 0, c: 6 }, e: { r: 0, c: 7 } },
      { s: { r: 0, c: 8 }, e: { r: 0, c: 9 } },
      { s: { r: 0, c: 10 }, e: { r: 0, c: 12 } },
    ];

    // Column widths
    ws['!cols'] = [
      { wch: 8 }, { wch: 25 },
      { wch: 8 }, { wch: 25 },
      { wch: 10 }, { wch: 25 },
      { wch: 10 }, { wch: 30 },
      { wch: 12 }, { wch: 35 },
      { wch: 20 }, { wch: 25 }, { wch: 20 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WBS Structure");
    const sanitized = (projectName || "Proyek_WBS").replace(/[^a-zA-Z0-9_-]/g, "_");
    XLSX.writeFile(wb, `${sanitized}_WBS.xlsx`);
  };

  // Send Leaf tasks to CPM
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
        duration: leaf.durationWeeks || 2,
        predecessors: predecessor,
      };
    });

    onSyncToCPM(cpmTasks);
    setSyncToast(true);
    setTimeout(() => setSyncToast(false), 3000);
  };

  // DATABASE TEMPLATE TAB ACTIONS
  const handleApplyTemplate = (categoryNode: WBSRecommendationNode) => {
    if (!categoryNode.children || categoryNode.children.length === 0) {
      alert("Template ini belum memiliki struktur pekerjaan.");
      return;
    }
    const convertedTree: WBSNode[] = categoryNode.children.map((l1, l1Idx) => ({
      id: `wbs-tpl-${l1Idx}-${Date.now()}`,
      code: `${l1Idx + 1}`,
      level: 1,
      name: l1.name,
      durationWeeks: 4,
      pic: "Project Manager",
      children: (l1.children || []).map((l2, l2Idx) => ({
        id: `wbs-tpl-${l1Idx}-${l2Idx}-${Date.now()}`,
        code: `${l1Idx + 1}.${l2Idx + 1}`,
        level: 2,
        name: l2.name,
        durationWeeks: 2,
        pic: "Superintendent",
        children: (l2.children || []).map((l3, l3Idx) => ({
          id: `wbs-tpl-${l1Idx}-${l2Idx}-${l3Idx}-${Date.now()}`,
          code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}`,
          level: 3,
          name: l3.name,
          durationWeeks: 1,
          pic: "Site Engineer",
          children: (l3.children || []).map((l4, l4Idx) => ({
            id: `wbs-tpl-${l1Idx}-${l2Idx}-${l3Idx}-${l4Idx}-${Date.now()}`,
            code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}.${l4Idx + 1}`,
            level: 4,
            name: l4.name,
            durationWeeks: 1,
            pic: "Mandor",
            children: (l4.children || []).map((l5, l5Idx) => ({
              id: `wbs-tpl-${l1Idx}-${l2Idx}-${l3Idx}-${l4Idx}-${l5Idx}-${Date.now()}`,
              code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}.${l4Idx + 1}.${l5Idx + 1}`,
              level: 5,
              name: l5.name,
              durationWeeks: 1,
              pic: "Teknisi",
              tool: "Alat Lapangan",
              children: (l5.children || []).map((l6, l6Idx) => ({
                id: `wbs-tpl-${l1Idx}-${l2Idx}-${l3Idx}-${l4Idx}-${l5Idx}-${l6Idx}-${Date.now()}`,
                code: `${l1Idx + 1}.${l2Idx + 1}.${l3Idx + 1}.${l4Idx + 1}.${l5Idx + 1}.${l6Idx + 1}`,
                level: 6,
                name: l6.name,
                durationWeeks: 1,
                pic: "QA/QC",
                tool: "Form Inspeksi",
                material: "Dokumen BAST"
              }))
            }))
          }))
        }))
      }))
    }));

    onUpdateWBS(recomputeCodes(convertedTree));
    setActiveView('tree');
    alert(`Template "${categoryNode.name}" berhasil diterapkan ke struktur WBS!`);
  };

  const handleAddNewTemplateCategory = () => {
    if (!newTemplateCategoryName.trim()) return;
    const newCategory: WBSRecommendationNode = {
      name: newTemplateCategoryName.trim(),
      children: [
        {
          name: "1. Pekerjaan Persiapan",
          children: [
            { name: "Survei & Investigasi Awal", children: [{ name: "Pematokan & BA Lapangan" }] }
          ]
        },
        {
          name: "2. Pekerjaan Utama / Konstruksi",
          children: [
            { name: "Pelaksanaan Fisik", children: [{ name: "Instalasi & Perakitan" }] }
          ]
        }
      ]
    };
    const updated = [...customDatabase, newCategory];
    setCustomDatabase(updated);
    localStorage.setItem('pmo_custom_wbs_db', JSON.stringify(updated));
    setSelectedDbCategoryIdx(updated.length - 1);
    setNewTemplateCategoryName('');
  };

  const handleAddL1ToActiveTemplate = () => {
    if (!newDbL1Name.trim()) return;
    const currentCat = customDatabase[selectedDbCategoryIdx];
    if (!currentCat) return;
    const newL1: WBSRecommendationNode = {
      name: newDbL1Name.trim(),
      children: [
        { name: `Pekerjaan Teknis ${newDbL1Name.trim()}`, children: [{ name: "Pelaksanaan & Dokumentasi Lapangan" }] }
      ]
    };
    const updatedCat = {
      ...currentCat,
      children: [...(currentCat.children || []), newL1]
    };
    const updatedDb = [...customDatabase];
    updatedDb[selectedDbCategoryIdx] = updatedCat;
    setCustomDatabase(updatedDb);
    localStorage.setItem('pmo_custom_wbs_db', JSON.stringify(updatedDb));
    setNewDbL1Name('');
  };

  const handleAddL2ToActiveTemplate = (l1Idx: number) => {
    if (!newDbL2Name.trim()) return;
    const currentCat = customDatabase[selectedDbCategoryIdx];
    if (!currentCat || !currentCat.children || !currentCat.children[l1Idx]) return;
    const targetL1 = currentCat.children[l1Idx];
    const newL2: WBSRecommendationNode = {
      name: newDbL2Name.trim(),
      children: [{ name: "Aktivitas Teknis Lapangan" }]
    };
    const updatedL1 = {
      ...targetL1,
      children: [...(targetL1.children || []), newL2]
    };
    const updatedL1Children = [...currentCat.children];
    updatedL1Children[l1Idx] = updatedL1;
    const updatedCat = { ...currentCat, children: updatedL1Children };
    const updatedDb = [...customDatabase];
    updatedDb[selectedDbCategoryIdx] = updatedCat;
    setCustomDatabase(updatedDb);
    localStorage.setItem('pmo_custom_wbs_db', JSON.stringify(updatedDb));
    setNewDbL2Name('');
  };

  const handleDeleteL1FromTemplate = (l1Idx: number) => {
    const currentCat = customDatabase[selectedDbCategoryIdx];
    if (!currentCat || !currentCat.children) return;
    const updatedChildren = currentCat.children.filter((_, idx) => idx !== l1Idx);
    const updatedCat = { ...currentCat, children: updatedChildren };
    const updatedDb = [...customDatabase];
    updatedDb[selectedDbCategoryIdx] = updatedCat;
    setCustomDatabase(updatedDb);
    localStorage.setItem('pmo_custom_wbs_db', JSON.stringify(updatedDb));
  };

  const handleResetDatabase = () => {
    if (confirm("Reset seluruh database template ke rekomendasi bawaan standar PMO?")) {
      setCustomDatabase(WBS_DATABASE);
      localStorage.removeItem('pmo_custom_wbs_db');
      setSelectedDbCategoryIdx(0);
    }
  };

  // Node editing in table view
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
      durationWeeks: 1,
      pic: 'Pelaksana Lapangan',
      tool: parentNode.level >= 4 ? 'Alat Ukur' : undefined,
      material: parentNode.level >= 5 ? 'Material / Dokumen' : undefined,
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
            Struktur Work Breakdown Structure Level 1 s/d 6 + PIC, Diagram Hirarki standar Attachment 3, & Ekspor Excel Attachment 2.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {syncToast && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded inline-flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Disinkronkan ke CPM
            </span>
          )}

          {/* 4 View Toggles */}
          <div className="flex items-center border border-slate-200 rounded p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveView('tree')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                activeView === 'table'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabel WBS</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('wizard')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
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
              onClick={() => setActiveView('database')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                activeView === 'database'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-500" />
              <span>Database Template</span>
            </button>
          </div>

          {/* Tombol Lihat Data Excel */}
          <button
            type="button"
            onClick={() => setIsExcelPreviewOpen(true)}
            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lihat Data Excel</span>
          </button>

          {/* Tombol Export to Excel */}
          <button
            type="button"
            onClick={handleExportToExcel}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export to Excel (.xlsx)</span>
          </button>

          {/* Send to CPM */}
          <button
            type="button"
            onClick={handleExtractToCPM}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim ke CPM</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DIAGRAM HIRARKI PERSIS SEPERTI ATTACHMENT 3 (CONTOH WBS) */}
      {activeView === 'tree' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          {/* Header matching Attachment 3 */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">STANDAR ATTACHMENT PMO</span>
              <h3 className="text-2xl font-black text-[#0B3B60] tracking-wide">CONTOH WBS</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#0B3B60] tracking-wider">MOYA</span>
              <span className="px-2 py-0.5 bg-[#034078] text-white rounded text-xs font-bold">eNetwoQ</span>
            </div>
          </div>

          {/* Diagram Canvas with Level Indicators on the left */}
          <div className="overflow-x-auto p-4 bg-slate-50/60 rounded-lg border border-slate-200 min-h-[500px]">
            <div className="min-w-[950px] space-y-6">
              
              {/* ROW 0: LEVEL 0 (ROOT PROJECT) */}
              <div className="flex items-center gap-4">
                <span className="w-20 px-2 py-1 bg-[#0B3B60] text-white text-[11px] font-bold rounded-full text-center shrink-0">
                  Level 0
                </span>
                <div className="flex-1 flex justify-center">
                  <div className="bg-[#0B3B60] text-white px-8 py-3 rounded-md shadow-md text-center border-2 border-[#034078]">
                    <span className="text-[10px] font-semibold text-cyan-200 block uppercase">Project Master Node</span>
                    <h4 className="text-sm font-black tracking-wide mt-0.5">{projectName}</h4>
                  </div>
                </div>
              </div>

              {/* Connecting vertical line down to bus */}
              <div className="flex justify-center -my-3">
                <div className="w-0.5 h-6 bg-slate-400"></div>
              </div>

              {/* ROW 1: LEVEL 1 (HORIZONTAL COLORFUL CARDS ROW) */}
              <div className="flex items-start gap-4">
                <span className="w-20 px-2 py-1 bg-[#0B3B60] text-white text-[11px] font-bold rounded-full text-center shrink-0 mt-3">
                  Level 1
                </span>

                {/* Horizontal row of L1 cards with top connection line */}
                <div className="flex-1 relative pt-4">
                  {/* Horizontal bus line connecting all L1 columns */}
                  <div className="absolute top-0 left-8 right-8 h-0.5 bg-slate-400"></div>

                  <div className="grid grid-cols-6 gap-3">
                    {wbsTree.map((l1, idx) => {
                      // Palette matching Attachment 3: Blue, Green, Purple, Yellow, Pink, Cyan
                      const colorStyles = [
                        { bg: "bg-[#D9EDF7]", text: "text-[#1B4F72]", border: "border-[#BCE8F1]" }, // 1. Blue
                        { bg: "bg-[#DFF0D8]", text: "text-[#276F37]", border: "border-[#D6E9C6]" }, // 2. Green
                        { bg: "bg-[#E8DAEF]", text: "text-[#5B2C6F]", border: "border-[#D7BDE2]" }, // 3. Purple
                        { bg: "bg-[#FCF8E3]", text: "text-[#7D6608]", border: "border-[#FAEBCC]" }, // 4. Yellow
                        { bg: "bg-[#FADBD8]", text: "text-[#78281F]", border: "border-[#F5B7B1]" }, // 5. Pink
                        { bg: "bg-[#D1F2EB]", text: "text-[#117864]", border: "border-[#A3E4D7]" }, // 6. Cyan
                      ];
                      const style = colorStyles[idx % colorStyles.length];

                      return (
                        <div key={l1.id} className="relative flex flex-col items-center">
                          {/* Vertical connector down from bus line */}
                          <div className="w-0.5 h-4 bg-slate-400 -mt-4 mb-0"></div>

                          {/* L1 Card */}
                          <div className={`w-full p-2.5 rounded shadow-xs text-center border font-bold text-xs ${style.bg} ${style.text} ${style.border}`}>
                            <span className="text-[10px] block opacity-75">Level 1.{idx + 1}</span>
                            <span className="leading-snug block">{l1.name}</span>
                          </div>

                          {/* ROW 2: LEVEL 2 VERTICAL STACK UNDER THIS L1 (Connected with tree branch lines) */}
                          <div className="w-full mt-4 space-y-2 relative pl-3 before:absolute before:left-1 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-300">
                            {(l1.children || []).map((l2) => (
                              <div key={l2.id} className="relative before:absolute before:-left-2 before:top-3 before:w-2 before:h-0.5 before:bg-slate-300">
                                <div className={`p-2 rounded text-[11px] font-semibold border shadow-2xs ${style.bg} ${style.text} ${style.border}`}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-[9px] opacity-75 font-bold">{l2.code}</span>
                                    <span className="text-[9px] opacity-75">{l2.pic || "PIC"}</span>
                                  </div>
                                  <span className="block mt-0.5 leading-tight">{l2.name}</span>
                                </div>

                                {/* ROW 3: LEVEL 3 BULLET LIST BELOW L2 */}
                                {Boolean(l2.children && l2.children.length > 0) && (
                                  <div className="mt-1.5 pl-2 border-l border-slate-300 space-y-1">
                                    {l2.children!.map((l3) => (
                                      <div key={l3.id} className="text-[10px] text-slate-700 bg-white p-1 rounded border border-slate-200">
                                        <div className="font-mono font-bold text-slate-900">• {l3.code} {l3.name}</div>
                                        {/* Sub levels (4-6) summary if available */}
                                        {Boolean(l3.children && l3.children.length > 0) && (
                                          <div className="text-[9px] text-slate-500 pl-2 mt-0.5">
                                            └ {l3.children!.length} sub-aktivitas (L4-L6)
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
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Level 2 & 3 row labels on left */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-200 text-xs text-slate-500">
                <span className="w-20 px-2 py-0.5 bg-[#0B3B60] text-white text-[10px] font-bold rounded-full text-center shrink-0">
                  Level 2
                </span>
                <span>Rumpun Pekerjaan (Work Sections) di bawah tiap kolom Level 1</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="w-20 px-2 py-0.5 bg-[#0B3B60] text-white text-[10px] font-bold rounded-full text-center shrink-0">
                  Level 3
                </span>
                <span>Aktivitas & Deliverables spesifik per paket kerja (bercabang hingga Level 6)</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TABEL WBS HIERARKI LENGKAP LEVEL 1 SAMPAI LEVEL 6 */}
      {activeView === 'table' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Tabel WBS Hierarki Lengkap (Level 1 s/d Level 6 + PIC)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tanpa estimasi biaya, mendukung Level 1 sampai 6 beserta PIC, Alat (Tool), dan Material/Keterangan.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono font-medium">
              {flattenedAttachmentRows.length} Total Baris
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B3B60] text-white text-[11px]">
                <tr>
                  <th className="py-2 px-3 w-28">Kode WBS</th>
                  <th className="py-2 px-3 w-16">Level</th>
                  <th className="py-2 px-3">Nama Paket Kerja / Deskripsi Aktivitas</th>
                  <th className="py-2 px-3 w-40">PIC (Penanggung Jawab)</th>
                  <th className="py-2 px-3 w-32">Tool / Alat</th>
                  <th className="py-2 px-3 w-36">Material / Output</th>
                  <th className="py-2 px-2 w-20 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wbsTree.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Belum ada struktur WBS. Gunakan Wizard Bertahap atau Tab Database Template.
                    </td>
                  </tr>
                ) : (
                  // Recursive flat rows
                  (() => {
                    const renderRows: any[] = [];
                    const traverse = (nodes: WBSNode[], depth: number = 0) => {
                      nodes.forEach(node => {
                        renderRows.push(
                          <tr key={node.id} className="hover:bg-slate-50/70">
                            <td className="py-2 px-3 font-mono font-bold text-slate-800">{node.code}</td>
                            <td className="py-2 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                node.level === 1 ? 'bg-blue-900 text-white' :
                                node.level === 2 ? 'bg-amber-400 text-slate-900' :
                                node.level === 3 ? 'bg-yellow-300 text-slate-900' :
                                node.level === 4 ? 'bg-yellow-100 text-slate-800' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                L{node.level}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <div style={{ paddingLeft: `${(node.level - 1) * 16}px` }} className="flex items-center gap-1.5">
                                <span className="text-slate-400">•</span>
                                <input
                                  type="text"
                                  value={node.name}
                                  onChange={e => handleUpdateNode(node.id, 'name', e.target.value)}
                                  className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-slate-800 focus:bg-white rounded px-1.5 py-0.5 text-xs text-slate-900"
                                />
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={node.pic || ''}
                                onChange={e => handleUpdateNode(node.id, 'pic', e.target.value)}
                                placeholder="PIC / Peran"
                                className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-slate-800 focus:bg-white rounded px-1.5 py-0.5 text-xs text-slate-700"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={node.tool || ''}
                                onChange={e => handleUpdateNode(node.id, 'tool', e.target.value)}
                                placeholder="Alat..."
                                className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-slate-800 focus:bg-white rounded px-1.5 py-0.5 text-xs text-slate-600"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={node.material || ''}
                                onChange={e => handleUpdateNode(node.id, 'material', e.target.value)}
                                placeholder="Material / BA..."
                                className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-slate-800 focus:bg-white rounded px-1.5 py-0.5 text-xs text-slate-600"
                              />
                            </td>
                            <td className="py-2 px-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {node.level < 6 && (
                                  <button
                                    type="button"
                                    onClick={() => handleAddChild(node)}
                                    title={`Tambah sub-pekerjaan Level ${node.level + 1}`}
                                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNode(node.id)}
                                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                        if (node.children) traverse(node.children, depth + 1);
                      });
                    };
                    traverse(wbsTree);
                    return renderRows;
                  })()
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: WIZARD BERTAHAP (BATCHING FLOW) */}
      {activeView === 'wizard' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-6 text-xs font-semibold">
              <div className={`flex items-center gap-2 ${wizardStep >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  wizardStep > 1 ? 'bg-emerald-600 text-white' : wizardStep === 1 ? 'bg-slate-900 text-white' : 'bg-slate-200'
                }`}>
                  {wizardStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </span>
                <span>Langkah 1: Kunci Level 1</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

              <div className={`flex items-center gap-2 ${wizardStep >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  wizardStep > 2 ? 'bg-emerald-600 text-white' : wizardStep === 2 ? 'bg-slate-900 text-white' : 'bg-slate-200'
                }`}>
                  {wizardStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                </span>
                <span>Langkah 2: Rekomendasi Level 2</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

              <div className={`flex items-center gap-2 ${wizardStep === 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  wizardStep === 3 ? 'bg-slate-900 text-white' : 'bg-slate-200'
                }`}>
                  3
                </span>
                <span>Langkah 3: Terapkan ke WBS</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Batching Flow</span>
          </div>

          {/* STEP 1 */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Langkah 1: Tentukan & Kunci Seluruh Level 1
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih kelompok program pekerjaan utama. Sistem otomatis menyiapkan rekomendasi Level 2 untuk tiap item yang dipilih.
                </p>
              </div>

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
                        <span className="text-[10px] text-slate-500">Database PMO</span>
                      </div>
                    </div>
                  );
                })}
              </div>

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
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold border border-slate-300"
                >
                  Tambah L1
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600">{selectedL1List.length} Pekerjaan Level 1 terpilih</span>
                <button
                  type="button"
                  onClick={handleLockLevel1}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kunci & Lanjut ke Level 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {wizardStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Langkah 2: Rekomendasi Level 2 untuk Tiap Level 1 yang Dikunci
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tinjau dan sesuaikan daftar Level 2 sebelum mengunci.
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

              <div className="space-y-4">
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
                        <span className="text-[11px] text-slate-500">{activeL2List.length} Paket Kerja</span>
                      </div>

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
                                {checked ? <CheckSquare className="w-4 h-4 text-slate-900" /> : <Square className="w-4 h-4 text-slate-300" />}
                              </button>
                              <span className="truncate">{s}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 max-w-sm pt-1">
                        <input
                          type="text"
                          value={customL2Input[l1] || ''}
                          onChange={e => setCustomL2Input(prev => ({ ...prev, [l1]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') addCustomL2(l1); }}
                          placeholder="Tambah L2 kustom..."
                          className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                        />
                        <button type="button" onClick={() => addCustomL2(l1)} className="px-2.5 py-1.5 bg-slate-200 text-slate-800 rounded text-xs font-medium">
                          Tambah
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

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
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kunci & Lanjut ke Level 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {wizardStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Langkah 3: Terapkan Rekomendasi Level 3 s/d Level 6 ke WBS Lengkap
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik tombol di bawah untuk langsung menyusun diagram hirarki pohon dan tabel spreadsheet secara otomatis.
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
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Kunci & Terapkan ke Struktur WBS Lengkap</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: DATABASE TEMPLATE TAB (INPUT MANUAL TEMPLATE) */}
      {activeView === 'database' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                Database Template WBS (Master Recommendations)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Kelola master template WBS dari Level 1 sampai Level 6, atau masukkan template baru secara manual untuk dipakai di proyek lainnya.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {customDatabase.length} Kategori Template Tersedia
            </div>
          </div>

          {/* Category Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            {customDatabase.map((cat, idx) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedDbCategoryIdx(idx)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                  selectedDbCategoryIdx === idx
                    ? 'bg-[#0B3B60] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Template Details & Apply Button */}
          {customDatabase[selectedDbCategoryIdx] && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Template: {customDatabase[selectedDbCategoryIdx].name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Memiliki {customDatabase[selectedDbCategoryIdx].children?.length || 0} kelompok paket pekerjaan Level 1.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate(customDatabase[selectedDbCategoryIdx])}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terapkan Template Ini ke WBS Aktif</span>
                </button>
              </div>

              {/* Tree Preview of Template with deletion and addition */}
              <div className="border border-slate-200 rounded p-4 max-h-[360px] overflow-y-auto space-y-3 text-xs bg-slate-50/30">
                {(customDatabase[selectedDbCategoryIdx].children || []).map((l1, i1) => (
                  <div key={i1} className="space-y-1 bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0B3B60]">
                        Level 1.{i1 + 1}: {l1.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteL1FromTemplate(i1)}
                        className="text-slate-400 hover:text-red-600 p-0.5 rounded text-[10px]"
                        title="Hapus kelompok Level 1 ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="pl-3 space-y-1 pt-1">
                      {(l1.children || []).map((l2, i2) => (
                        <div key={i2} className="text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-100">
                          <span className="font-semibold text-slate-800 text-[11px]">└ L2.{i1 + 1}.{i2 + 1}: {l2.name}</span>
                          <div className="pl-3 text-[10px] text-slate-500 mt-0.5">
                            {(l2.children || []).map((l3, i3) => (
                              <div key={i3}>• L3.{i1 + 1}.{i2 + 1}.{i3 + 1}: {l3.name}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Level 1 Item to Current Template */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  + Tambah Pekerjaan Level 1 ke Template "{customDatabase[selectedDbCategoryIdx].name}":
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDbL1Name}
                    onChange={e => setNewDbL1Name(e.target.value)}
                    placeholder="Nama Kelompok Level 1 Baru (misal: Instalasi Mekanikal & Elektrikal)"
                    className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddL1ToActiveTemplate}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold"
                  >
                    Tambah Level 1
                  </button>
                </div>
              </div>

              {/* Add Custom Template Category Form & Reset */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <input
                    type="text"
                    value={newTemplateCategoryName}
                    onChange={e => setNewTemplateCategoryName(e.target.value)}
                    placeholder="Nama Kategori Template Baru (misal: EPC Fasilitas Migas)"
                    className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewTemplateCategory}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 shrink-0"
                  >
                    Tambah Kategori
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResetDatabase}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 underline self-start sm:self-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Database ke Standar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: LIHAT DATA EXCEL PERSIS SEPERTI ATTACHMENT 2 (Yellow highlight cols) */}
      {isExcelPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col border border-slate-300 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-emerald-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <h3 className="text-xs font-bold uppercase tracking-wide">
                  Pratinjau Data Lembar Kerja Excel (Sesuai Format Attachment 2)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportToExcel}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xlsx</span>
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

            {/* Modal Spreadsheet View with Yellow Highlight on L2, L3, L4 */}
            <div className="flex-1 overflow-auto p-4 bg-slate-100">
              <div className="bg-white border border-slate-400 rounded shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  {/* Row 1: Merged Category Headers */}
                  <thead>
                    <tr className="border-b-2 border-slate-800 text-[11px] font-bold text-slate-900">
                      <th colSpan={2} className="p-2 border-r border-slate-400 bg-slate-200 text-center">
                        WBS LEVEL 1 (NAMA PROYEK)
                      </th>
                      <th colSpan={2} className="p-2 border-r border-slate-400 bg-[#FFF200] text-slate-900 text-center">
                        WBS LEVEL 2 (RUMPUN PEKERJAAN)
                      </th>
                      <th colSpan={2} className="p-2 border-r border-slate-400 bg-[#FFF200] text-slate-900 text-center">
                        WBS LEVEL 3 (JENIS PEKERJAAN)
                      </th>
                      <th colSpan={2} className="p-2 border-r border-slate-400 bg-[#FFF200] text-slate-900 text-center">
                        WBS LEVEL 4 (PAKET PEKERJAAN)
                      </th>
                      <th colSpan={2} className="p-2 border-r border-slate-400 bg-slate-200 text-center">
                        WBS LEVEL 5 (AKTIVITAS)
                      </th>
                      <th colSpan={3} className="p-2 bg-slate-200 text-center">
                        WBS LEVEL 6 (SUMBER DAYA / DETAIL)
                      </th>
                    </tr>
                    {/* Row 2: Sub-headers */}
                    <tr className="border-b border-slate-400 text-[10px] font-bold text-slate-800 font-mono bg-slate-100">
                      <th className="p-2 border-r border-slate-300 w-12 text-center">CODE</th>
                      <th className="p-2 border-r border-slate-400 w-40">PROJECT NAME</th>

                      <th className="p-2 border-r border-slate-300 w-12 text-center bg-[#FFF200]/50">CODE</th>
                      <th className="p-2 border-r border-slate-400 w-44 bg-[#FFF200]/50">WORK SECTION</th>

                      <th className="p-2 border-r border-slate-300 w-12 text-center bg-[#FFF200]/50">CODE</th>
                      <th className="p-2 border-r border-slate-400 w-44 bg-[#FFF200]/50">TYPE OF WORK</th>

                      <th className="p-2 border-r border-slate-300 w-14 text-center bg-[#FFF200]/50">CODE</th>
                      <th className="p-2 border-r border-slate-400 w-48 bg-[#FFF200]/50">WORK PACKAGE</th>

                      <th className="p-2 border-r border-slate-300 w-16 text-center">CODE</th>
                      <th className="p-2 border-r border-slate-400 w-52">ACTIVITY</th>

                      <th className="p-2 border-r border-slate-300 w-32">TOOL</th>
                      <th className="p-2 border-r border-slate-300 w-36">MATERIAL</th>
                      <th className="p-2 w-32">PIC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans text-[11px]">
                    {flattenedAttachmentRows.map((r, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/60">
                        <td className="p-1.5 border-r border-slate-300 font-mono text-center font-bold">{r.l1Code}</td>
                        <td className="p-1.5 border-r border-slate-400 font-semibold">{r.l1Name}</td>

                        <td className="p-1.5 border-r border-slate-300 font-mono text-center bg-[#FFF200]/30">{r.l2Code}</td>
                        <td className="p-1.5 border-r border-slate-400 bg-[#FFF200]/30 font-medium">{r.l2Name}</td>

                        <td className="p-1.5 border-r border-slate-300 font-mono text-center bg-[#FFF200]/30">{r.l3Code}</td>
                        <td className="p-1.5 border-r border-slate-400 bg-[#FFF200]/30">{r.l3Name}</td>

                        <td className="p-1.5 border-r border-slate-300 font-mono text-center bg-[#FFF200]/30">{r.l4Code}</td>
                        <td className="p-1.5 border-r border-slate-400 bg-[#FFF200]/30">{r.l4Name}</td>

                        <td className="p-1.5 border-r border-slate-300 font-mono text-center">{r.l5Code}</td>
                        <td className="p-1.5 border-r border-slate-400 font-medium text-slate-900">{r.l5Name}</td>

                        <td className="p-1.5 border-r border-slate-300 text-slate-600">{r.l6Tool}</td>
                        <td className="p-1.5 border-r border-slate-300 text-slate-600">{r.l6Material}</td>
                        <td className="p-1.5 text-slate-800 font-medium">{r.pic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Format tabel spreadsheet dengan kolom Level 2-4 berlatar kuning (sesuai lampiran excel)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExcelPreviewOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleExportToExcel}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File Excel (.xlsx)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
