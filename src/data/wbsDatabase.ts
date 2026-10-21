export interface WBSRecommendationNode {
  name: string;
  defaultDurationDays?: number;
  children?: WBSRecommendationNode[];
}

export const WBS_DATABASE: WBSRecommendationNode[] = [
  {
    name: "Pengerukan Tanah & Pekerjaan Tanah",
    children: [
      {
        name: "Pekerjaan Persiapan & Survei Lahan",
        children: [
          {
            name: "Pengukuran Topografi & Batas Lahan",
            children: [
              {
                name: "Pemasangan Patok & Benchmarking Geodesi",
                children: [
                  {
                    name: "Verifikasi Elevasi Tanah Asli (Existing Level)",
                    children: [
                      { name: "Penerbitan Berita Acara Survei & Peta Kontur", defaultDurationDays: 3 },
                      { name: "Kalibrasi Koordinat GPS Benchmarking", defaultDurationDays: 2 }
                    ]
                  },
                  {
                    name: "Pengecekan Utilitas Bawah Tanah",
                    children: [
                      { name: "Deteksi Pipa & Kabel Bawah Tanah", defaultDurationDays: 4 },
                      { name: "Koordinasi Pemilik Utilitas Publik", defaultDurationDays: 2 }
                    ]
                  }
                ]
              },
              {
                name: "Pengujian Karakteristik Tanah Lapangan",
                children: [
                  {
                    name: "Soil Investigation & Core Drilling",
                    children: [
                      { name: "Pengambilan Sampel Sondir & Bor Mesin", defaultDurationDays: 5 },
                      { name: "Uji Laboratorium Mekanika Tanah", defaultDurationDays: 4 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pembersihan & Penebasan Lahan (Land Clearing)",
            children: [
              {
                name: "Penebasan Semak Belukar & Pepohonan",
                children: [
                  {
                    name: "Pencabutan Tunggul & Akar Pohon",
                    children: [
                      { name: "Pengumpulan Biomassa & Batang Kayu", defaultDurationDays: 4 },
                      { name: "Pembersihan Area dari Sisa Sampah Organik", defaultDurationDays: 3 }
                    ]
                  },
                  {
                    name: "Pengupasan Tanah Humus (Stripping Top Soil)",
                    children: [
                      { name: "Pengerukan Top Soil Ketebalan 20-30 cm", defaultDurationDays: 5 },
                      { name: "Penimbunan Top Soil Sementara di Stockpile", defaultDurationDays: 3 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Penggalian & Pengerukan Tanah (Excavation)",
        children: [
          {
            name: "Galian Tanah Lunak & Sedang",
            children: [
              {
                name: "Operasional Alat Berat Excavator Backhoe",
                children: [
                  {
                    name: "Pengerukan Lapisan Kedalaman 0 - 2 Meter",
                    children: [
                      { name: "Pembentukan Lereng Talud Sesuai Slope Rencana", defaultDurationDays: 6 },
                      { name: "Perapihan Dinding Galian Manual", defaultDurationDays: 4 }
                    ]
                  },
                  {
                    name: "Pengerukan Lapisan Kedalaman 2 - 5 Meter",
                    children: [
                      { name: "Pemasangan Shoring / Penyangga Dinding Galian", defaultDurationDays: 5 },
                      { name: "Dewatering & Pemompaan Rembesan Air Tanah", defaultDurationDays: 4 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Galian Tanah Keras & Berbatu",
            children: [
              {
                name: "Pemecahan Batuan dengan Hydraulic Breaker",
                children: [
                  {
                    name: "Fragmentasi Bongkahan Batuan Cadas",
                    children: [
                      { name: "Penyortiran Batuan Hasil Pecahan", defaultDurationDays: 5 },
                      { name: "Inspeksi Elevasi Rencana Dasar Galian", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Pemindahan & Pembuangan Material (Hauling & Disposal)",
        children: [
          {
            name: "Pemuatan Material ke Dump Truck",
            children: [
              {
                name: "Operasional Wheel Loader & Excavator di Pit",
                children: [
                  {
                    name: "Penimbangan Beban Muatan Truk (Weighbridge)",
                    children: [
                      { name: "Pencatatan Ritase & Manifest Pengangkutan", defaultDurationDays: 4 },
                      { name: "Pemasangan Terpal Penutup Bak Truk", defaultDurationDays: 1 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pembuangan ke Area Disposal Resmi",
            children: [
              {
                name: "Mobilisasi Dump Truck di Rute Logistik",
                children: [
                  {
                    name: "Dumping Material di Titik Buang Terverifikasi",
                    children: [
                      { name: "Perataan & Perapihan Disposal Area dengan Dozer", defaultDurationDays: 4 },
                      { name: "Pembersihan Roda Truk sebelum Masuk Jalan Raya", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Penimbunan Kembali & Pemadatan (Backfilling & Compaction)",
        children: [
          {
            name: "Penghamparan Material Tanah Pilihan (Selected Fill)",
            children: [
              {
                name: "Penghamparan Lapis Demi Lapis (Layering per 20 cm)",
                children: [
                  {
                    name: "Penyemprotan Air untuk Optimal Moisture Content",
                    children: [
                      { name: "Pemadatan Menggunakan Vibro Roller 10 Ton", defaultDurationDays: 4 },
                      { name: "Finishing Leveling Permukaan Subgrade", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pengujian Kepadatan Tanah Terpasang",
            children: [
              {
                name: "Pengujian Lapangan Sand Cone & CPT",
                children: [
                  {
                    name: "Verifikasi Derajat Kepadatan Minimum 95% MDD",
                    children: [
                      { name: "Penerbitan Laporan Sertifikasi Kepadatan", defaultDurationDays: 3 },
                      { name: "Penyerahan Berita Acara Pekerjaan Tanah", defaultDurationDays: 2 }
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
    name: "Konstruksi Sipil & Bangunan Fasilitas",
    children: [
      {
        name: "Pekerjaan Pondasi & Substruktur",
        children: [
          {
            name: "Pekerjaan Tiang Pancang / Bored Pile",
            children: [
              {
                name: "Pengeboran & Fabrikasi Pembesian Pile",
                children: [
                  {
                    name: "Pengecoran Beton Readymix Tiang Pancang",
                    children: [
                      { name: "Uji Integritas Pile (Pile Integrity Test - PIT)", defaultDurationDays: 3 },
                      { name: "Pembobokan Kepala Tiang (Pile Chipping)", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pekerjaan Pile Cap & Tie Beam",
            children: [
              {
                name: "Bekisting & Penulangan Pile Cap",
                children: [
                  {
                    name: "Pengecoran Beton Mutu K-350 / fc 30 MPa",
                    children: [
                      { name: "Perawatan Beton (Water Curing)", defaultDurationDays: 7 },
                      { name: "Uji Kuat Tekan Silinder Beton 28 Hari", defaultDurationDays: 1 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Pekerjaan Struktur Atas (Superstruktur)",
        children: [
          {
            name: "Kolom & Balok Beton Bertulang",
            children: [
              {
                name: "Perakitan Stek Kolom & Pasang Bekisting",
                children: [
                  {
                    name: "Pengecoran Kolom Struktur Utama",
                    children: [
                      { name: "Pelepasan Bekisting Kolom setelah 24 Jam", defaultDurationDays: 2 },
                      { name: "Inspeksi Visual Kerataan & Cacat Beton", defaultDurationDays: 1 }
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
    name: "Implementasi Sistem Informasi & IT PMO",
    children: [
      {
        name: "Analisis Kebutuhan & Desain Solusi",
        children: [
          {
            name: "User Requirement Gathering & Workshops",
            children: [
              {
                name: "Penyusunan Dokumen Software Requirement Specs (SRS)",
                children: [
                  {
                    name: "Review & Validasi Kebutuhan bersama Key Stakeholders",
                    children: [
                      { name: "Formal Sign-off Dokumen SRS Baseline", defaultDurationDays: 3 },
                      { name: "Penyusunan Traceability Matrix Fitur", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Desain Arsitektur Sistem & Database",
            children: [
              {
                name: "Perancangan Entity Relationship Diagram (ERD)",
                children: [
                  {
                    name: "Desain API Contract & Service Endpoints",
                    children: [
                      { name: "Review Security & Scalability Architecture", defaultDurationDays: 3 },
                      { name: "Penyusunan High-Level Design (HLD) Document", defaultDurationDays: 4 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Pengembangan Modul & Integrasi",
        children: [
          {
            name: "Sprint 1: Core Authentication & User Management",
            children: [
              {
                name: "Setup Role-Based Access Control (RBAC)",
                children: [
                  {
                    name: "Integrasi Single Sign-On (SSO / OAuth)",
                    children: [
                      { name: "Unit Testing Modul Autentikasi Coverage > 80%", defaultDurationDays: 4 },
                      { name: "Code Review & Security Audit Enkripsi Kredensial", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Returns suggested options for a given target level based on the selected ancestor path
 */
export function getSuggestionsForLevel(
  selectedPath: string[], // [l1Name, l2Name, l3Name, ...]
  targetLevel: number // 1 to 6
): string[] {
  if (targetLevel === 1) {
    return WBS_DATABASE.map(item => item.name);
  }

  // Traverse down according to selectedPath
  let currentNodes: WBSRecommendationNode[] = WBS_DATABASE;
  for (let i = 0; i < targetLevel - 1; i++) {
    const selectedName = selectedPath[i];
    if (!selectedName) return [];
    const match = currentNodes.find(
      n => n.name.trim().toLowerCase() === selectedName.trim().toLowerCase()
    );
    if (!match || !match.children) return [];
    currentNodes = match.children;
  }

  return currentNodes.map(n => n.name);
}

/**
 * Return default duration if available for leaf or sub-node
 */
export function getRecommendedDuration(selectedPath: string[]): number {
  let currentNodes: WBSRecommendationNode[] = WBS_DATABASE;
  let duration = 3;
  for (let i = 0; i < selectedPath.length; i++) {
    const selectedName = selectedPath[i];
    const match = currentNodes.find(
      n => n.name.trim().toLowerCase() === selectedName.trim().toLowerCase()
    );
    if (!match) break;
    if (match.defaultDurationDays) {
      duration = match.defaultDurationDays;
    }
    if (match.children) {
      currentNodes = match.children;
    } else {
      break;
    }
  }
  return duration;
}
