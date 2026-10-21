import { ProjectCharterData, WBSNode, CPMTask, Project } from '../types/pmo';
import { INITIAL_READINESS_CHECKLIST } from './readinessChecklistData';

export const DEFAULT_PROJECT_CHARTER: ProjectCharterData = {
  projectName: "Pembangunan Jaringan Distribusi Air Bersih Kawasan Cikarang Timur",
  projectCode: "MOYA-CKR-2026-01",
  projectSponsor: "General Manager Operations",
  projectManager: "Ahmad Fauzi",
  startDate: "2026-08-01",
  targetEndDate: "2027-01-31",
  durationText: "6 Bulan (1 Agustus 2026 – 31 Januari 2027)",
  budgetEstimated: "15 Miliar",
  currency: "Rp",
  selectedScopeCategories: [
    "Pipa Distribusi 12 km",
    "Survey & Engineering",
    "Pekerjaan Galian",
    "Hydrotest & Flushing",
    "Perizinan & AMDAL"
  ],
  scopeObjectives: "Membangun jaringan distribusi air sepanjang 12 km untuk meningkatkan kapasitas distribusi air bersih.",
  inScopeDeliverables: "1. Approved Engineering Drawing\n2. Jaringan pipa 12 km terpasang\n3. BAST Handover Proyek",
  outOfScopeExclusions: "1. Sambungan rumah tangga (SR)\n2. Pembangunan reservoir baru",
  keyAssumptions: "Izin jalan kabupaten tuntas sebelum galian pipa dimulai.",
  // Attachment 1 detailed sections:
  businessNeed: "Untuk meningkatkan cakupan layanan air bersih dan memenuhi kebutuhan pelanggan baru di Kawasan Cikarang Timur, PT Moya Indonesia akan membangun jaringan distribusi air baru sepanjang 12 km yang terhubung dengan reservoir existing. Proyek ini diharapkan dapat meningkatkan kapasitas distribusi, mengurangi gangguan layanan, dan mendukung pertumbuhan pelanggan.",
  projectObjectives: [
    "Membangun jaringan distribusi air sepanjang 12 km.",
    "Menyelesaikan proyek dalam waktu 6 bulan.",
    "Menyelesaikan proyek sesuai anggaran yang telah disetujui.",
    "Mendukung penambahan 3.000 pelanggan baru.",
    "Memenuhi standar kualitas, keselamatan kerja, dan regulasi yang berlaku."
  ],
  inScope: [
    "Survey lapangan",
    "Engineering design",
    "Pengadaan material pipa",
    "Pekerjaan galian",
    "Instalasi pipa distribusi",
    "Hydrotest dan flushing",
    "Commissioning",
    "Penyusunan as-built drawing",
    "Handover ke tim operasi"
  ],
  outOfScope: [
    "Sambungan rumah pelanggan",
    "Pembangunan reservoir baru",
    "Pengadaan lahan",
    "Operasional pasca handover"
  ],
  keyDeliverables: [
    "Approved Engineering Drawing",
    "Jaringan distribusi air 12 km terpasang",
    "Hasil hydrotest memenuhi standar",
    "As-built drawing lengkap",
    "Dokumen handover proyek",
    "Berita Acara Serah Terima Proyek"
  ],
  topRisks: [
    "Keterlambatan permit",
    "Konflik dengan utilitas existing",
    "Keterlambatan pengadaan material",
    "Keluhan masyarakat selama pekerjaan"
  ],
  successCriteria: [
    "Proyek selesai maksimal 31 Januari 2027",
    "Deviasi biaya tidak melebihi 5%",
    "Zero Fatality Accident",
    "Tidak terjadi kerusakan utilitas major",
    "As-built drawing disetujui",
    "Handover diterima oleh tim operasi"
  ],
  keyMilestones: [
    { id: "m-1", no: 1, milestone: "Survey & Engineering Design Selesai", targetDate: "31 Agustus 2026" },
    { id: "m-2", no: 2, milestone: "Permit & Perizinan Selesai", targetDate: "30 September 2026" },
    { id: "m-3", no: 3, milestone: "Instalasi Pipa Utama Selesai", targetDate: "30 November 2026" },
    { id: "m-4", no: 4, milestone: "Hydrotest & Commissioning Selesai", targetDate: "15 Januari 2027" },
    { id: "m-5", no: 5, milestone: "Handover & Project Closeout", targetDate: "31 Januari 2027" }
  ],
  stakeholders: [
    { id: "s-1", name: "Sponsor Proyek", role: "Project Sponsor", interest: "Pengarah dan pemberi keputusan" },
    { id: "s-2", name: "Ahmad Fauzi", role: "Project Manager", interest: "Mengelola dan mengendalikan proyek" },
    { id: "s-3", name: "Engineering Department", role: "Engineering Team", interest: "Desain dan technical support" },
    { id: "s-4", name: "Construction Department", role: "Construction Lead", interest: "Pelaksanaan pekerjaan di lapangan" },
    { id: "s-5", name: "HSE Department", role: "Safety Officer", interest: "Pengawasan keselamatan kerja" },
    { id: "s-6", name: "Procurement Department", role: "Procurement", interest: "Pengadaan material dan jasa" },
    { id: "s-7", name: "Vendor / Subcontractor", role: "Vendor Mitra", interest: "Pelaksana pekerjaan konstruksi" },
    { id: "s-8", name: "Pemerintah Daerah", role: "Regulator", interest: "Pemberi izin dan regulasi" },
    { id: "s-9", name: "Pemilik Utilitas Existing", role: "External Partner", interest: "Koordinasi dan mitigasi konflik utilitas" },
    { id: "s-10", name: "Masyarakat Sekitar", role: "Community", interest: "Pihak terdampak kegiatan proyek" }
  ]
};

// WBS matching Attachment 2 & Attachment 3 (Level 1 to Level 6 + PIC, Tool, Material)
export const DEFAULT_WBS_TREE: WBSNode[] = [
  {
    id: "wbs-1",
    code: "1",
    level: 1,
    name: "Persiapan Umum",
    durationWeeks: 4,
    pic: "Project Manager",
    children: [
      {
        id: "wbs-1-1",
        code: "1.1",
        level: 2,
        name: "Persiapan Lahan & Survei",
        durationWeeks: 2,
        pic: "Chief Surveyor",
        children: [
          {
            id: "wbs-1-1-1",
            code: "1.1.1",
            level: 3,
            name: "Pemeriksaan & Survei Lokasi",
            durationWeeks: 1,
            pic: "Survey Team",
            children: [
              {
                id: "wbs-1-1-1-1",
                code: "1.1.1.1",
                level: 4,
                name: "Pengukuran & Pematokan Jalur Pipa",
                durationWeeks: 1,
                pic: "Geodetic Engineer",
                children: [
                  {
                    id: "wbs-1-1-1-1-1",
                    code: "1.1.1.1.1",
                    level: 5,
                    name: "Pemeriksaan Bangunan Sekitar & Lokasi Shaft",
                    durationWeeks: 1,
                    pic: "Site Inspector",
                    tool: "Alat ukur & kamera",
                    children: [
                      {
                        id: "wbs-1-1-1-1-1-1",
                        code: "1.1.1.1.1.1",
                        level: 6,
                        name: "Penerbitan Dokumen Perizinan & BA Lapangan",
                        durationWeeks: 1,
                        pic: "Legal & Surveyor",
                        tool: "Laptop & Printer",
                        material: "Dokumen Perizinan & Peta Jalur"
                      }
                    ]
                  }
                ]
              },
              {
                id: "wbs-1-1-1-2",
                code: "1.1.1.2",
                level: 4,
                name: "Pembuatan Pagar Sementara & Papan Nama Proyek",
                durationWeeks: 1,
                pic: "Mandor Sipil",
                children: [
                  {
                    id: "wbs-1-1-1-2-1",
                    code: "1.1.1.2.1",
                    level: 5,
                    name: "Membuat dan memasang papan nama proyek",
                    durationWeeks: 1,
                    pic: "Tukang Kayu",
                    tool: "Paku dan palu",
                    children: [
                      {
                        id: "wbs-1-1-1-2-1-1",
                        code: "1.1.1.2.1.1",
                        level: 6,
                        name: "Pemasangan banner informasi proyek K3",
                        durationWeeks: 1,
                        pic: "HSE Officer",
                        tool: "Palu & Tang",
                        material: "Papan kayu, print banner"
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
            name: "Operasional & Fasilitas Lapangan",
            durationWeeks: 2,
            pic: "General Affair",
            children: [
              {
                id: "wbs-1-1-2-1",
                code: "1.1.2.1",
                level: 4,
                name: "Penyediaan Bangunan Kantor & Gudang",
                durationWeeks: 1,
                pic: "Logistics Lead",
                children: [
                  {
                    id: "wbs-1-1-2-1-1",
                    code: "1.1.2.1.1",
                    level: 5,
                    name: "Sewa bangunan kantor & barak kerja",
                    durationWeeks: 1,
                    pic: "Site Admin",
                    tool: "Perangkat Kantor",
                    children: [
                      {
                        id: "wbs-1-1-2-1-1-1",
                        code: "1.1.2.1.1.1",
                        level: 6,
                        name: "Penyediaan instalasi air & sanitasi pekerja",
                        durationWeeks: 1,
                        pic: "Plumber",
                        tool: "Alat kebersihan & pipa",
                        material: "Tandon air & pipa PVC"
                      }
                    ]
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
    id: "wbs-2",
    code: "2",
    level: 1,
    name: "Perencanaan Teknis",
    durationWeeks: 4,
    pic: "Engineering Head",
    children: [
      {
        id: "wbs-2-1",
        code: "2.1",
        level: 2,
        name: "Survei dan Investigasi Geoteknik",
        durationWeeks: 2,
        pic: "Geotech Engineer",
        children: [
          {
            id: "wbs-2-1-1",
            code: "2.1.1",
            level: 3,
            name: "Pengujian Tanah Sondir & CPT",
            durationWeeks: 1,
            pic: "Soil Lab Crew",
            children: [
              {
                id: "wbs-2-1-1-1",
                code: "2.1.1.1",
                level: 4,
                name: "Pengambilan Sampel Sondir Lapangan",
                durationWeeks: 1,
                pic: "Mesin Sondir",
                children: [
                  {
                    id: "wbs-2-1-1-1-1",
                    code: "2.1.1.1.1",
                    level: 5,
                    name: "Uji Laboratorium Daya Dukung Tanah",
                    durationWeeks: 1,
                    pic: "Analis Lab",
                    tool: "Mesin Uji Tekan",
                    children: [
                      {
                        id: "wbs-2-1-1-1-1-1",
                        code: "2.1.1.1.1.1",
                        level: 6,
                        name: "Penerbitan Laporan Rekomendasi Pondasi Pipa",
                        durationWeeks: 1,
                        pic: "Geotech Specialist",
                        tool: "Software Geoteknik",
                        material: "Laporan Final Sondir"
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
        id: "wbs-2-2",
        code: "2.2",
        level: 2,
        name: "Perancangan Detail Teknik (DED)",
        durationWeeks: 3,
        pic: "Lead Pipeline Designer",
        children: [
          {
            id: "wbs-2-2-1",
            code: "2.2.1",
            level: 3,
            name: "Pemodelan Hidrolis & Profil Aliran",
            durationWeeks: 2,
            pic: "Hydraulic Modeler"
          }
        ]
      }
    ]
  },
  {
    id: "wbs-3",
    code: "3",
    level: 1,
    name: "Pengadaan Material dan Jasa",
    durationWeeks: 6,
    pic: "Procurement Manager",
    children: [
      {
        id: "wbs-3-1",
        code: "3.1",
        level: 2,
        name: "Pengadaan Pipa Distribusi & Fitting",
        durationWeeks: 4,
        pic: "Material Buyer",
        children: [
          {
            id: "wbs-3-1-1",
            code: "3.1.1",
            level: 3,
            name: "Pabrikasi Pipa HDPE & Valve Aksesoris",
            durationWeeks: 3,
            pic: "Pipe Manufacturer"
          }
        ]
      }
    ]
  },
  {
    id: "wbs-4",
    code: "4",
    level: 1,
    name: "Konstruksi Jaringan",
    durationWeeks: 12,
    pic: "Site Construction Superintendent",
    children: [
      {
        id: "wbs-4-1",
        code: "4.1",
        level: 2,
        name: "Pekerjaan Galian dan Urug Kembali",
        durationWeeks: 6,
        pic: "Heavy Equipment Lead",
        children: [
          {
            id: "wbs-4-1-1",
            code: "4.1.1",
            level: 3,
            name: "Galian Parit Jalur Pipa per Zona",
            durationWeeks: 4,
            pic: "Excavator Operator"
          }
        ]
      },
      {
        id: "wbs-4-2",
        code: "4.2",
        level: 2,
        name: "Pemasangan Pipa dan Aksesoris",
        durationWeeks: 8,
        pic: "Pipelaying Foreman",
        children: [
          {
            id: "wbs-4-2-1",
            code: "4.2.1",
            level: 3,
            name: "Penyambungan Butt Fusion & Valve Chamber",
            durationWeeks: 6,
            pic: "Welder Bersertifikat"
          }
        ]
      }
    ]
  },
  {
    id: "wbs-5",
    code: "5",
    level: 1,
    name: "Pengujian dan Serah Terima",
    durationWeeks: 3,
    pic: "QA/QC Manager",
    children: [
      {
        id: "wbs-5-1",
        code: "5.1",
        level: 2,
        name: "Uji Tekan (Hydrotest) & Desinfeksi",
        durationWeeks: 2,
        pic: "Testing Specialist"
      }
    ]
  },
  {
    id: "wbs-6",
    code: "6",
    level: 1,
    name: "Operasi dan Pemeliharaan Awal",
    durationWeeks: 2,
    pic: "Operation Lead",
    children: [
      {
        id: "wbs-6-1",
        code: "6.1",
        level: 2,
        name: "Commissioning & Uji Aliran ke Pelanggan",
        durationWeeks: 2,
        pic: "Plant Operations"
      }
    ]
  }
];

// CPM in WEEKS (Minggu)
export const DEFAULT_CPM_TASKS: CPMTask[] = [
  {
    id: "A",
    name: "Survei Topografi & Desain DED",
    duration: 3, // 3 minggu
    predecessors: []
  },
  {
    id: "B",
    name: "Perizinan Jalur & Permit PU",
    duration: 4, // 4 minggu
    predecessors: ["A"]
  },
  {
    id: "C",
    name: "Penyediaan Fasilitas Lapangan & Pagar",
    duration: 2, // 2 minggu
    predecessors: ["A"]
  },
  {
    id: "D",
    name: "Pengadaan Pipa HDPE 12 km & Fitting",
    duration: 6, // 6 minggu
    predecessors: ["B"]
  },
  {
    id: "E",
    name: "Pekerjaan Galian & Penyangga Tanah",
    duration: 5, // 5 minggu
    predecessors: ["B", "C"]
  },
  {
    id: "F",
    name: "Penyambungan Pipa & Butt Fusion",
    duration: 7, // 7 minggu
    predecessors: ["D", "E"]
  },
  {
    id: "G",
    name: "Pemasangan Gate Valve & Aksesoris",
    duration: 3, // 3 minggu
    predecessors: ["F"]
  },
  {
    id: "H",
    name: "Hydrotest, Flushing & Handover BAST",
    duration: 2, // 2 minggu
    predecessors: ["G"]
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    createdAt: "2026-08-01",
    updatedAt: "2026-10-20",
    targetDurationWeeks: 24, // 6 Bulan = 24 Minggu
    charter: DEFAULT_PROJECT_CHARTER,
    wbsTree: DEFAULT_WBS_TREE,
    cpmTasks: DEFAULT_CPM_TASKS,
    checklistItems: INITIAL_READINESS_CHECKLIST,
  }
];
