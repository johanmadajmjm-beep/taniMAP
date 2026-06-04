# 🌿 TaniMap
### Sistem Informasi Pendataan, Pemetaan, dan Monitoring Petani Berbasis Lokasi

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Status](https://img.shields.io/badge/status-ready-brightgreen)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile-blue)

---

## 📋 Deskripsi

TaniMap adalah aplikasi web berbasis HTML/CSS/JavaScript murni (vanilla) untuk pendataan, pemetaan, dan monitoring petani. Dirancang untuk dijalankan langsung di browser tanpa server backend, data disimpan di `localStorage` browser. Cocok untuk:

- Penyuluh pertanian lapangan
- Dinas pertanian kabupaten/kota
- Kelompok tani dan koperasi

**Wilayah contoh:** Manggarai, Nusa Tenggara Timur (NTT)

---

## ✨ Fitur Lengkap

| Modul | Fitur |
|-------|-------|
| **Dashboard** | Statistik ringkasan, grafik petani per desa, sebaran komoditas, produksi |
| **Data Petani** | CRUD lengkap, upload foto (base64), filter multi-kolom, search |
| **Data Lahan** | Multi-lahan per petani, status kepemilikan, koordinat GPS |
| **Data Tanaman** | Multi-tanaman per petani, status kondisi, perkiraan panen |
| **Kunjungan Lapangan** | Catatan kunjungan petugas, kondisi, rekomendasi, GPS |
| **Hama & Penyakit** | Pencatatan serangan, tingkat keparahan, penanganan |
| **Produksi** | Rekap hasil panen, harga jual, total pendapatan otomatis |
| **Peta Interaktif** | Leaflet.js + OpenStreetMap, marker berwarna per komoditas, popup detail |
| **Laporan** | Rekap per desa, per komoditas, hama; export CSV & JSON |
| **Pengaturan** | Export/Import JSON, muat data contoh, reset data |

---

## 🚀 Cara Menjalankan

### Metode 1: Buka Langsung (Local)
```
1. Download/clone repositori ini
2. Buka index.html di browser (Chrome/Firefox/Edge)
```

> ⚠️ **Catatan:** Beberapa browser memblokir `fetch()` pada protokol `file://`. Jika data dummy tidak muncul, gunakan metode 2.

### Metode 2: GitHub Pages (Rekomendasi)
```
1. Upload semua file ke repositori GitHub
2. Aktifkan GitHub Pages di Settings → Pages → Branch: main
3. Akses via https://username.github.io/nama-repo
```

### Metode 3: Local Server
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# Kemudian buka: http://localhost:8080
```

---

## 📁 Struktur File

```
tanimap/
├── index.html          # Halaman utama (semua UI)
├── styles.css          # Stylesheet lengkap
├── script.js           # Logika aplikasi
├── data/
│   └── farmers.json    # 10 data contoh petani Manggarai
└── README.md
```

---

## 📱 Tampilan Responsif

- **Desktop:** Sidebar navigasi + konten utama
- **Mobile:** Bottom navigation + hamburger menu

---

## 💾 Penyimpanan Data

Semua data disimpan di **localStorage** browser:
- Key: `tanimap_farmers`
- Format: JSON Array

Data tidak hilang saat tab ditutup, kecuali:
- Browser di-clear history/cache
- Mode Incognito/Private
- Reset manual dari menu Pengaturan

---

## 🗺️ Peta

Peta menggunakan **Leaflet.js** + **OpenStreetMap** (membutuhkan koneksi internet).

Warna marker berdasarkan komoditas:
| Komoditas | Warna |
|-----------|-------|
| Kopi Arabika/Robusta | 🟢 Hijau Tua |
| Jagung | 🟡 Kuning/Oranye |
| Padi | 🟢 Hijau Muda |
| Kakao | 🟤 Cokelat |
| Cabai | 🔴 Merah |
| Cengkeh | 🟠 Oranye |
| Vanili | 🟣 Ungu |
| Lainnya | 🔵 Biru |

---

## 📊 Data Contoh

10 petani dari wilayah Manggarai NTT:
- Desa: Golo Loni, Wae Laba, Compang, Benti, Poco Leok, Satar Ngkeling, Pong Murung
- Komoditas: Kopi Arabika, Jagung, Padi, Kakao, Cengkeh, Cabai, Vanili

---

## 📦 Membungkus ke APK Android

Gunakan **WebView** di Android Studio:

```java
// MainActivity.java
WebView webView = (WebView) findViewById(R.id.webview);
webView.getSettings().setJavaScriptEnabled(true);
webView.getSettings().setDomStorageEnabled(true); // Penting untuk localStorage
webView.loadUrl("file:///android_asset/index.html");
```

Atau gunakan **Capacitor.js**:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init TaniMap com.tanimap.app
npx cap add android
npx cap copy android
npx cap open android
```

---

## 🔧 Teknologi

- **HTML5** — Struktur aplikasi
- **CSS3** — Desain responsif, CSS Variables
- **JavaScript ES6+** — Logika aplikasi
- **Leaflet.js 1.9.4** — Peta interaktif
- **Chart.js 4.4.1** — Grafik dashboard
- **Font Awesome 6.5** — Ikon
- **Google Fonts** — Plus Jakarta Sans + Lora
- **localStorage** — Penyimpanan data lokal

---

## 📄 Lisensi

MIT License — Bebas digunakan, dimodifikasi, dan didistribusikan.

---

*Dibuat dengan ❤️ untuk membantu petani Indonesia 🌾*
