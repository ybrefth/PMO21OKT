import { ProjectCharterData, WBSNode, CPMTask } from '../types/pmo';

export const DEFAULT_PROJECT_CHARTER: ProjectCharterData = {
  projectName: "Proyek Pengerukan Tanah & Penyiapan Lahan Kawasan Industri",
  projectCode: "PMO-PRE-2026-084",
  projectSponsor: "Ir. Hendra Gunawan, M.T. (Director of Infrastructure)",
  projectManager: "Aubrey Fathur, PMP (Senior Project Manager)",
  startDate: "2026-11-01",
  targetEndDate: "2027-04-30",
  budgetEstimated: "14,500,000,000",
  currency: "IDR",
  selectedScopeCategories: [
    "Pengerukan & Cut/Fill",
    "Survei Topografi & Geoteknik",
    "Dewatering & Shoring",
    "Disposal & Hauling Logistik",
    "Uji Pemadatan Subgrade",
    "HSE & Izin Lingkungan"
  ],
  scopeObjectives: "Melaksanakan penyiapan lahan seluas 18,5 Hektar meliputi pekerjaan pengerukan tanah (cut) 120.000 m3, pengurukan dan pemadatan subgrade (fill) 45.000 m3, serta pengangkutan disposal material berizin untuk persiapan konstruksi fasilitas utama pabrik manufaktur.",
  inScopeDeliverables: "1. Pembersihan dan pembabatan vegetasi lahan (Land clearing 18.5 Ha).\n2. Pengerukan tanah sampai elevasi rencana (+12.500 m DPL).\n3. Pemasangan sistem dewatering dan dinding penahan tanah sementara (shoring).\n4. Pengangkutan dan pembuangan sisa galian ke designated disposal area (berizin LH).\n5. Penghamparan, perataan, dan pemadatan lapis per lapis dengan uji kepadatan 95% MDD.\n6. Berita Acara Serah Terima (BAST) kesiapan lahan dan sertifikat sondir/sand cone.",
  outOfScopeExclusions: "1. Pembangunan struktur permanen gedung pabrik dan pondasi tiang pancang (paket kontrak terpisah).\n2. Penyambungan daya listrik tegangan tinggi PLN permanen (hanya genset kerja sementara).\n3. Pengaspalan jalan lingkungan kawasan industri tahap akhir.",
  keyAssumptions: "1. Izin lingkungan UKL-UPL dan akses jalan angkut truk telah tuntas sebelum tanggal mulai galian.\n2. Kondisi cuaca rata-rata normal dengan toleransi hujan 5 hari/bulan.\n3. Akses quarry material timbunan pilihan berjarak kurang dari 15 km.",
  stakeholders: [
    {
      id: "sh-1",
      role: "Sponsor",
      name: "Ir. Hendra Gunawan, M.T.",
      title: "Vice President Infrastructure Development",
      email: "h.gunawan@infrastructure-corp.id",
      phone: "+62 811-9876-5432",
      department: "Executive Board"
    },
    {
      id: "sh-2",
      role: "PM",
      name: "Aubrey Fathur, PMP",
      title: "Lead Project Manager PMO",
      email: "aubrey.f@infrastructure-corp.id",
      phone: "+62 812-3456-7890",
      department: "PMO Division"
    },
    {
      id: "sh-3",
      role: "Steering Committee",
      name: "Dra. Maya Kartika, MBA",
      title: "Director of Risk & Corporate Governance",
      email: "m.kartika@infrastructure-corp.id",
      phone: "+62 813-1122-3344",
      department: "Risk & Governance"
    },
    {
      id: "sh-4",
      role: "Vendor",
      name: "PT Bumi Megah Perkasa (Bpk. Joko Santoso)",
      title: "Main Earthworks Contractor",
      email: "joko@bumimegah.co.id",
      phone: "+62 821-4455-6677",
      department: "Contractor Consortium"
    },
    {
      id: "sh-5",
      role: "End User",
      name: "Bambang Wijaya, S.T.",
      title: "Plant Operations & Site Manager",
      email: "b.wijaya@manufacturing-plant.id",
      phone: "+62 815-9988-7766",
      department: "Operations Division"
    }
  ]
};

export const DEFAULT_WBS_TREE: WBSNode[] = [
  {
    id: "wbs-1",
    code: "1",
    level: 1,
    name: "Pengerukan Tanah & Pekerjaan Tanah",
    durationDays: 85,
    assignedRole: "Project Manager",
    costEstimate: 14500000000,
    children: [
      {
        id: "wbs-1-1",
        code: "1.1",
        level: 2,
        name: "Pekerjaan Persiapan & Survei Lahan",
        durationDays: 14,
        assignedRole: "Chief Surveyor",
        costEstimate: 850000000,
        children: [
          {
            id: "wbs-1-1-1",
            code: "1.1.1",
            level: 3,
            name: "Pengukuran Topografi & Batas Lahan",
            durationDays: 6,
            assignedRole: "Survey Team A",
            costEstimate: 320000000,
            children: [
              {
                id: "wbs-1-1-1-1",
                code: "1.1.1.1",
                level: 4,
                name: "Pemasangan Patok & Benchmarking Geodesi",
                durationDays: 4,
                assignedRole: "Geodetic Engineer",
                costEstimate: 150000000,
                children: [
                  {
                    id: "wbs-1-1-1-1-1",
                    code: "1.1.1.1.1",
                    level: 5,
                    name: "Verifikasi Elevasi Tanah Asli (Existing Level)",
                    durationDays: 3,
                    assignedRole: "Site Inspector",
                    costEstimate: 75000000,
                    children: [
                      {
                        id: "wbs-1-1-1-1-1-1",
                        code: "1.1.1.1.1.1",
                        level: 6,
                        name: "Penerbitan Berita Acara Survei & Peta Kontur",
                        durationDays: 3,
                        assignedRole: "GIS Lead",
                        costEstimate: 40000000
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: "wbs-1-1-2",
            code: "1.1.2",
            level: 3,
            name: "Pembersihan & Penebasan Lahan (Land Clearing)",
            durationDays: 8,
            assignedRole: "Civil Foreman",
            costEstimate: 530000000,
            children: [
              {
                id: "wbs-1-1-2-1",
                code: "1.1.2.1",
                level: 4,
                name: "Penebasan Semak Belukar & Pepohonan",
                durationDays: 5,
                assignedRole: "Equipment Operator",
                costEstimate: 280000000
              }
            ]
          }
        ]
      },
      {
        id: "wbs-1-2",
        code: "1.2",
        level: 2,
        name: "Penggalian & Pengerukan Tanah (Excavation)",
        durationDays: 40,
        assignedRole: "Earthworks Superintendent",
        costEstimate: 6200000000,
        children: [
          {
            id: "wbs-1-2-1",
            code: "1.2.1",
            level: 3,
            name: "Galian Tanah Lunak & Sedang",
            durationDays: 24,
            assignedRole: "Heavy Equipment Crew",
            costEstimate: 3800000000,
            children: [
              {
                id: "wbs-1-2-1-1",
                code: "1.2.1.1",
                level: 4,
                name: "Operasional Alat Berat Excavator Backhoe",
                durationDays: 18,
                assignedRole: "Excavator Operator Lead",
                costEstimate: 2900000000,
                children: [
                  {
                    id: "wbs-1-2-1-1-1",
                    code: "1.2.1.1.1",
                    level: 5,
                    name: "Pengerukan Lapisan Kedalaman 0 - 2 Meter",
                    durationDays: 10,
                    assignedRole: "Shift Supervisor",
                    costEstimate: 1600000000,
                    children: [
                      {
                        id: "wbs-1-2-1-1-1-1",
                        code: "1.2.1.1.1.1",
                        level: 6,
                        name: "Pembentukan Lereng Talud Sesuai Slope Rencana",
                        durationDays: 6,
                        assignedRole: "Grade Checker",
                        costEstimate: 600000000
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "wbs-1-3",
        code: "1.3",
        level: 2,
        name: "Pemindahan & Pembuangan Material (Hauling & Disposal)",
        durationDays: 32,
        assignedRole: "Logistics Coordinator",
        costEstimate: 4100000000,
        children: [
          {
            id: "wbs-1-3-1",
            code: "1.3.1",
            level: 3,
            name: "Pemuatan Material ke Dump Truck",
            durationDays: 20,
            assignedRole: "Pit Dispatcher",
            costEstimate: 2100000000
          },
          {
            id: "wbs-1-3-2",
            code: "1.3.2",
            level: 3,
            name: "Pembuangan ke Area Disposal Resmi",
            durationDays: 25,
            assignedRole: "Disposal Supervisor",
            costEstimate: 2000000000
          }
        ]
      },
      {
        id: "wbs-1-4",
        code: "1.4",
        level: 2,
        name: "Penimbunan Kembali & Pemadatan (Backfilling & Compaction)",
        durationDays: 25,
        assignedRole: "Soil Compaction Specialist",
        costEstimate: 3350000000,
        children: [
          {
            id: "wbs-1-4-1",
            code: "1.4.1",
            level: 3,
            name: "Penghamparan Material Tanah Pilihan (Selected Fill)",
            durationDays: 16,
            assignedRole: "Roller Operator",
            costEstimate: 2400000000
          },
          {
            id: "wbs-1-4-2",
            code: "1.4.2",
            level: 3,
            name: "Pengujian Kepadatan Tanah Terpasang",
            durationDays: 9,
            assignedRole: "Geotechnical QA/QC",
            costEstimate: 950000000
          }
        ]
      }
    ]
  }
];

export const DEFAULT_CPM_TASKS: CPMTask[] = [
  {
    id: "A",
    name: "Survei Topografi & Benchmarking",
    duration: 5,
    predecessors: []
  },
  {
    id: "B",
    name: "Pembersihan Lahan & Land Clearing",
    duration: 7,
    predecessors: ["A"]
  },
  {
    id: "C",
    name: "Pemasangan Pagar Proyek & Pos Jaga",
    duration: 4,
    predecessors: ["A"]
  },
  {
    id: "D",
    name: "Mobilisasi Alat Berat & Excavator",
    duration: 3,
    predecessors: ["B"]
  },
  {
    id: "E",
    name: "Pengerukan & Penggalian Tanah Masif",
    duration: 18,
    predecessors: ["B", "D"]
  },
  {
    id: "F",
    name: "Dewatering & Saluran Drainase Sementara",
    duration: 6,
    predecessors: ["C", "B"]
  },
  {
    id: "G",
    name: "Pemadatan Subgrade & Penghamparan Fill",
    duration: 12,
    predecessors: ["E", "F"]
  },
  {
    id: "H",
    name: "Uji Sand Cone & Final Site Handover",
    duration: 4,
    predecessors: ["G"]
  }
];

import { INITIAL_READINESS_CHECKLIST } from './readinessChecklistData';
import { Project } from '../types/pmo';

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-19",
    charter: DEFAULT_PROJECT_CHARTER,
    wbsTree: DEFAULT_WBS_TREE,
    cpmTasks: DEFAULT_CPM_TASKS,
    checklistItems: INITIAL_READINESS_CHECKLIST,
  },
  {
    id: "proj-2",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-18",
    charter: {
      projectName: "Implementasi Sistem Cloud ERP & Data Warehouse PMO",
      projectCode: "PMO-PRE-2026-092",
      projectSponsor: "Direktur Transformasi Digital & IT",
      projectManager: "Aubrey Fathur, PMP",
      startDate: "2026-12-01",
      targetEndDate: "2027-06-30",
      budgetEstimated: "4,200,000,000",
      currency: "IDR",
      selectedScopeCategories: [
        "Software & System Architecture",
        "Hardware Procurement & Cloud",
        "Sistem MEP & Utilitas"
      ],
      scopeObjectives: "Membangun pondasi sistem enterprise resource planning (ERP) terintegrasi berbasis cloud untuk otomasi pelaporan PMO dan manajemen aset terpusat.",
      inScopeDeliverables: "1. Dokumen Software Requirement Specs (SRS).\n2. Setup cloud environment & security policy.\n3. Modul Finance, Procurement, dan PMO Project Tracking.\n4. Integrasi single sign-on (SSO) dan training 120 key users.",
      outOfScopeExclusions: "1. Custom pengembangan modul logistik pihak ketiga (fase 2).\n2. Penggantian seluruh laptop operasional cabang.",
      keyAssumptions: "1. Ketersediaan bandwidth internet stabil di 5 kantor wilayah.\n2. Key users dapat dialokasikan minimal 20 jam/minggu untuk User Acceptance Testing (UAT).",
      stakeholders: [
        {
          id: "sh-2-1",
          role: "Sponsor",
          name: "Dr. Pratama Kusuma",
          title: "Chief Information Officer",
          email: "pratama.k@corp.id",
          phone: "+62 811-3344-5566",
          department: "IT Leadership"
        },
        {
          id: "sh-2-2",
          role: "PM",
          name: "Aubrey Fathur, PMP",
          title: "Senior Enterprise PM",
          email: "aubrey.f@corp.id",
          phone: "+62 812-3456-7890",
          department: "PMO Division"
        }
      ]
    },
    wbsTree: [
      {
        id: "wbs-2-1",
        code: "1",
        level: 1,
        name: "Implementasi Sistem Informasi & IT PMO",
        durationDays: 60,
        assignedRole: "Project Manager",
        children: [
          {
            id: "wbs-2-1-1",
            code: "1.1",
            level: 2,
            name: "Analisis Kebutuhan & Desain Solusi",
            durationDays: 20,
            assignedRole: "Lead System Analyst",
            children: [
              {
                id: "wbs-2-1-1-1",
                code: "1.1.1",
                level: 3,
                name: "User Requirement Gathering & Workshops",
                durationDays: 10,
                assignedRole: "Analyst"
              },
              {
                id: "wbs-2-1-1-2",
                code: "1.1.2",
                level: 3,
                name: "Desain Arsitektur Sistem & Database",
                durationDays: 10,
                assignedRole: "Cloud Architect"
              }
            ]
          },
          {
            id: "wbs-2-1-2",
            code: "1.2",
            level: 2,
            name: "Pengembangan Modul & Integrasi",
            durationDays: 40,
            assignedRole: "Dev Lead"
          }
        ]
      }
    ],
    cpmTasks: [
      { id: "A", name: "Inisiasi & Setup Server Cloud", duration: 7, predecessors: [] },
      { id: "B", name: "Penyusunan SRS & Approval", duration: 12, predecessors: ["A"] },
      { id: "C", name: "Konfigurasi Database & Keamanan", duration: 8, predecessors: ["B"] },
      { id: "D", name: "User Acceptance Testing (UAT)", duration: 14, predecessors: ["C"] }
    ],
    checklistItems: INITIAL_READINESS_CHECKLIST.map((item, idx) => ({
      ...item,
      isCompleted: idx < 12,
      completedAt: idx < 12 ? "2026-10-12 10:00" : undefined
    }))
  }
];

