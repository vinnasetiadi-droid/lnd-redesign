import { BookOpen, BarChart2, Target, MessageCircle, FileText, Users, School, Building2, Settings, Shield, Activity } from "lucide-react";
// import { pesertaScenarioData, getPesertaScenario, ConversationResponse } from "../pesertaDialog";
// import { pimpinanScenarioData, getPimpinanScenario } from "../pimpinanDialog";
// import { getInstrukturScenario } from "../instrukturDialog";

export type UserRole = "peserta" | "instruktur" | "admin" | "pimpinan";

export interface Feature {
  icon: any; // Lucide icon component
  title: string;
  description: string;
  query?: string; // Query to send when clicked
}

// // Re-export ConversationResponse from pesertaDialog to maintain consistency
// export type { ConversationResponse };

export interface AssistantContent {
  role: UserRole;
  welcomeTitle: string;
  welcomeMessage: string;
  features: Feature[];
  samplePrompts: string[];
  scenarios?: Record<string, any>;
  getResponse?: (key: string) => any | null;
}

export const assistantData: Record<UserRole, AssistantContent> = {
  peserta: {
    role: "peserta",
    welcomeTitle: "Halo! Aku Nisa 👋",
    welcomeMessage: "AI Assistant yang siap membantu perjalanan pelatihan kamu di LearnXpert!",
    features: [
      {
        icon: BookOpen,
        title: "Bantuan Materi",
        description: "Tanya aku tentang modul, tugas, atau referensi militer",
        query: "Cari referensi materi" // Matches keyword "referensi" -> cari_referensi
      },
      {
        icon: BarChart2,
        title: "Progress Latihan",
        description: "Lihat perkembangan fisik dan akademik",
        query: "Bagaimana progress latihan saya?" // Matches keyword "progress" -> progress_pelatihan
      },
      {
        icon: Target,
        title: "Target Harian",
        description: "Atur dan pantau target latihan harian",
        query: "Jadwal saya hari ini?" // Matches keyword "hari_ini" -> jadwal_hari_ini
      },
      {
        icon: MessageCircle,
        title: "Konsultasi",
        description: "Diskusi materi kapan aja kamu butuh",
        query: "Hubungi instruktur" // Matches keyword "hubungi" -> hubungi_instruktur
      }
    ],
    samplePrompts: [
      "Bagaimana progress saya?",
      "Jadwal saya hari ini?",
      "Detail Strategi Pertahanan",
      "Apa pengumuman terbaru?"
    ],
    // scenarios: pesertaScenarioData,
    // getResponse: getPesertaScenario
  },
  instruktur: {
    role: "instruktur",
    welcomeTitle: "Halo, Pelatih! 👋",
    welcomeMessage: "Saya Nisa, asisten virtual Anda untuk mengelola kelas dan materi pelatihan.",
    features: [
      {
        icon: BarChart2,
        title: "Dashboard Kelas",
        description: "Ringkasan 3 kelas & status 90 siswa",
        query: "Dashboard overview"
      },
      {
        icon: Users,
        title: "Siswa Bermasalah",
        description: "Analisis 6 siswa yang perlu intervensi",
        query: "Detail siswa bermasalah"
      },
      {
        icon: FileText,
        title: "Laporan Kelas",
        description: "Detail performa per kelas (Siber A/B/C)",
        query: "Laporan kelas Siber-A"
      },
      {
        icon: School,
        title: "Tips Mengajar",
        description: "Panduan praktis mengajar efektif",
        query: "Tips mengajar"
      }
    ],
    samplePrompts: [
      "Dashboard overview",
      "Detail siswa bermasalah",
      "Rekomendasi intervensi",
      "Laporan kelas Siber-A"
    ],
    // getResponse: getInstrukturScenario
  },
  admin: {
    role: "admin",
    welcomeTitle: "Selamat Datang, Administrator! 👋",
    welcomeMessage: "Nisa siap membantu pengelolaan sistem dan user LearnXpert.",
    features: [
      {
        icon: Users,
        title: "Manajemen User",
        description: "Kelola akun peserta, instruktur, dan pimpinan"
      },
      {
        icon: Settings,
        title: "Konfigurasi Sistem",
        description: "Pengaturan global dan parameter aplikasi"
      },
      {
        icon: Shield,
        title: "Keamanan",
        description: "Monitoring akses dan log keamanan"
      },
      {
        icon: Activity,
        title: "System Health",
        description: "Pantau performa server dan database"
      }
    ],
    samplePrompts: [
      "Reset password user nrp:12345",
      "Tampilkan log aktivitas login terakhir",
      "Status backup database hari ini"
    ]
  },
  pimpinan: {
    role: "pimpinan",
    welcomeTitle: "Selamat Datang, Komandan! 👋",
    welcomeMessage: "Dashboard Nisa untuk pemantauan strategis dan evaluasi pelatihan.",
    features: [
      {
        icon: Building2,
        title: "Kesiapan Satuan",
        description: "Akses data kesiapan personil dan satuan",
        query: "Dashboard overview"
      },
      {
        icon: BarChart2,
        title: "Laporan Eksekutif",
        description: "Analisis tren pelatihan dan performa kurikulum",
        query: "Analisis kurikulum"
      },
      {
        icon: Users,
        title: "Peta Kekuatan",
        description: "Sebaran kualifikasi dan kompetensi personil",
        query: "Talent mapping overview"
      },
      {
        icon: FileText,
        title: "Evaluasi Kebijakan",
        description: "Simulasi dampak kebijakan pelatihan baru",
        query: "Prediksi masa depan"
      }
    ],
    samplePrompts: [
      "Tampilkan status kesiapan operasional",
      "Laporan logistik wilayah Papua",
      "Analisis efektivitas kurikulum baru",
      "Cari personel sniper dengan medis"
    ],
    // scenarios: pimpinanScenarioData,
    // getResponse: getPimpinanScenario
  }
};