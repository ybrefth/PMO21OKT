export interface WBSRecommendationNode {
  name: string;
  defaultDurationDays?: number;
  children?: WBSRecommendationNode[];
}

export const WBS_DATABASE: WBSRecommendationNode[] = [
  {
    name: "Pengembangan Jaringan PDAM (Water Pipeline)",
    children: [
      {
        name: "Persiapan Umum",
        children: [
          {
            name: "Persiapan Lahan",
            children: [
              {
                name: "Melakukan survei lokasi",
                children: [
                  {
                    name: "Pemeriksaan lahan rencana & koordinasi shaft",
                    children: [
                      { name: "Penerbitan Berita Acara & Dokumen Perizinan", defaultDurationDays: 3 }
                    ]
                  },
                  {
                    name: "Pengukuran ulang & benchmarking geodesi",
                    children: [
                      { name: "Pematokan elevasi rencana pipa", defaultDurationDays: 2 }
                    ]
                  }
                ]
              },
              {
                name: "Pembuatan pagar sementara dan papan nama proyek",
                children: [
                  {
                    name: "Membuat dan memasang pagar pengaman",
                    children: [
                      { name: "Pemasangan banner informasi K3", defaultDurationDays: 2 }
                    ]
                  }
                ]
              },
              {
                name: "Kegiatan sosialisasi proyek kepada masyarakat",
                children: [
                  {
                    name: "Penyuluhan dan pembagian informasi proyek",
                    children: [
                      { name: "Absensi dan kesepakatan warga", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Operasional",
            children: [
              {
                name: "Menyediakan bangunan kantor kontraktor & gudang",
                children: [
                  {
                    name: "Sewa bangunan dan pembersihan fasilitas",
                    children: [
                      { name: "Penyediaan instalasi air dan sanitasi", defaultDurationDays: 3 }
                    ]
                  }
                ]
              },
              {
                name: "Keamanan dan Manajemen Lapangan K3",
                children: [
                  {
                    name: "Penyuluhan Program K3 kepada Pekerja",
                    children: [
                      { name: "Inspeksi APD dan sertifikasi peralatan", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Mobilisasi",
            children: [
              {
                name: "Pengangkutan Peralatan ke Lokasi Kerja",
                children: [
                  {
                    name: "Mobilisasi Excavator & Mesin Butt Fusion",
                    children: [
                      { name: "Pemeriksaan kondisi laik operasi alat", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Perencanaan Teknis",
        children: [
          {
            name: "Survei dan Investigasi",
            children: [
              {
                name: "Pengumpulan Data Lapangan & Geoteknik",
                children: [
                  {
                    name: "Uji Sondir & Uji Laboratorium Sampel",
                    children: [
                      { name: "Laporan Evaluasi Tanah Subgrade", defaultDurationDays: 4 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Perancangan Teknik (DED)",
            children: [
              {
                name: "Penyusunan Gambar Kerja Detail",
                children: [
                  {
                    name: "Desain Profil Memanjang & Melintang Pipa",
                    children: [
                      { name: "Approval Konsultan Pengawas", defaultDurationDays: 5 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Perizinan dan Persetujuan",
            children: [
              {
                name: "Pengurusan Izin Pemanfaatan Jalan PU",
                children: [
                  {
                    name: "Koordinasi Pemilik Utilitas Lain",
                    children: [
                      { name: "Surat Rekomendasi Teknis", defaultDurationDays: 3 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Pengadaan Material dan Jasa",
        children: [
          {
            name: "Pengadaan Material Pipa dan Aksesoris",
            children: [
              {
                name: "Pengadaan Pipa Distribusi HDPE 12 km",
                children: [
                  {
                    name: "Fabrikasi & Pengiriman Pipa ke Site",
                    children: [
                      { name: "Inspeksi Mutu Pipa di Gudang", defaultDurationDays: 7 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pengadaan Peralatan",
            children: [
              {
                name: "Sewa Mesin Butt Fusion & Pompa Dewatering",
                children: [
                  {
                    name: "Kalibrasi Alat Las Pipa HDPE",
                    children: [
                      { name: "Uji Coba Pengelasan Sampel", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pengadaan Jasa Kontraktor",
            children: [
              {
                name: "Seleksi Subkontraktor Galian & Pipelaying",
                children: [
                  {
                    name: "Penandatanganan Kontrak Kerja SPK",
                    children: [
                      { name: "Kickoff Meeting Pelaksanaan", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Konstruksi Jaringan",
        children: [
          {
            name: "Pekerjaan Gali dan Urug",
            children: [
              {
                name: "Pekerjaan Galian Parit Jalur Pipa",
                children: [
                  {
                    name: "Galian Parit dengan Mini Excavator",
                    children: [
                      { name: "Perapihan Dasar Parit & Bantalan Pasir", defaultDurationDays: 6 }
                    ]
                  }
                ]
              },
              {
                name: "Pekerjaan Urug Kembali dan Pemadatan",
                children: [
                  {
                    name: "Penimbunan Lapisan Pasir Pengaman Pipa",
                    children: [
                      { name: "Pemadatan Subbase & Perapihan Bekas Galian", defaultDurationDays: 4 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pemasangan Pipa dan Aksesoris",
            children: [
              {
                name: "Penyambungan Pipa HDPE & Fitting",
                children: [
                  {
                    name: "Penurunan Pipa ke dalam Parit Galian",
                    children: [
                      { name: "Pemasangan Thrust Block & Valve Chamber", defaultDurationDays: 5 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pekerjaan Struktur dan Kelengkapan",
            children: [
              {
                name: "Pembuatan Bak Kontrol & Manhole Valve",
                children: [
                  {
                    name: "Pengecoran Beton Mutu K-250",
                    children: [
                      { name: "Pemasangan Cover Cast Iron Manhole", defaultDurationDays: 3 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Pengujian dan Serah Terima",
        children: [
          {
            name: "Pengujian Jaringan Pipa",
            children: [
              {
                name: "Hydrostatic Pressure Test (Uji Tekan)",
                children: [
                  {
                    name: "Pengisian Air & Peningkatan Tekanan Uji",
                    children: [
                      { name: "Pencatatan Penurunan Tekanan per 2 Jam", defaultDurationDays: 3 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Desinfeksi dan Pembilasan Pipa",
            children: [
              {
                name: "Flushing Air Bersih & Klorinasi",
                children: [
                  {
                    name: "Pengambilan Sampel Air Laboratorium",
                    children: [
                      { name: "Penerbitan Sertifikat Kualitas Air", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Serah Terima dan Dokumentasi",
            children: [
              {
                name: "Penyusunan As-Built Drawing Lengkap",
                children: [
                  {
                    name: "Final Inspection bersama Tim Operasi PDAM",
                    children: [
                      { name: "Penandatanganan Berita Acara Serah Terima (BAST)", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Operasi dan Pemeliharaan Awal",
        children: [
          {
            name: "Uji Coba Operasi Aliran Pipa",
            children: [
              {
                name: "Penyaluran Air Bersih ke Pelanggan",
                children: [
                  {
                    name: "Monitoring Tekanan di Ujung Jaringan",
                    children: [
                      { name: "Verifikasi Debit Aliran Minimum", defaultDurationDays: 3 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pelatihan Operator Lapangan",
            children: [
              {
                name: "Workshop Operasional Valve & Flushing",
                children: [
                  {
                    name: "Simulasi Penanganan Kebocoran Darurat",
                    children: [
                      { name: "Penyerahan Manual SOP Pemeliharaan", defaultDurationDays: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Pemeliharaan Awal (Defect Liability Period)",
            children: [
              {
                name: "Inspeksi Berkala Mingguan",
                children: [
                  {
                    name: "Perbaikan Minor Cacat Pekerjaan",
                    children: [
                      { name: "Penerbitan Final Handover Certificate", defaultDurationDays: 2 }
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
