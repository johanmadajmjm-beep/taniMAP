<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="TaniMap - Sistem Informasi Pendataan, Pemetaan, dan Monitoring Petani" />
  <title>TaniMap — Sistem Informasi Petani</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Styles -->
  <link rel="stylesheet" href="styles.css" />

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />

<style>
#splashScreen{position:fixed;inset:0;z-index:99999;
  background:linear-gradient(160deg,#022c22 0%,#064e3b 40%,#0f172a 100%);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:32px 28px;font-family:'Plus Jakarta Sans',sans-serif;overflow-y:auto;}
#splashScreen.hide{animation:splashFadeOut .5s ease forwards;}
@keyframes splashFadeOut{to{opacity:0;pointer-events:none;}}
.splash-logo{font-family:'Sora',sans-serif;font-size:52px;font-weight:800;
  color:white;letter-spacing:-2px;margin-bottom:4px;line-height:1;}
.splash-logo span{color:#34d399;}
.splash-tagline{font-size:13px;color:rgba(255,255,255,.5);font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;margin-bottom:36px;}
.splash-divider{width:48px;height:3px;background:linear-gradient(90deg,#34d399,#059669);
  border-radius:2px;margin-bottom:32px;}
.splash-feature{display:flex;align-items:flex-start;gap:14px;
  margin-bottom:18px;width:100%;max-width:340px;}
.splash-feature-icon{width:40px;height:40px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;}
.splash-feature-text h4{font-size:14px;font-weight:700;color:white;margin-bottom:3px;}
.splash-feature-text p{font-size:12px;color:rgba(255,255,255,.45);line-height:1.5;}
.splash-version{font-size:11px;color:rgba(255,255,255,.25);margin-top:24px;margin-bottom:16px;}
.splash-btn{width:100%;max-width:340px;padding:16px;border:none;border-radius:14px;
  background:linear-gradient(135deg,#059669,#34d399);color:white;font-size:15px;
  font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
  box-shadow:0 8px 24px rgba(5,150,105,.4);transition:all .2s;letter-spacing:.02em;}
.splash-btn:active{transform:scale(.97);}
</style>
</head>
<body>

<!-- ==================== LAYOUT ==================== -->
<div class="app-layout">

  <!-- Sidebar Overlay (mobile) -->
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

  <!-- ===== SIDEBAR ===== -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">
        <div class="brand-icon">🌿</div>
        <div class="brand-text">TaniMap
          <span>Sistem Informasi Petani</span>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Menu Utama</div>
      <button class="nav-item active" onclick="navigate('dashboard')">
        <i class="fas fa-chart-pie"></i> Beranda
      </button>
      <button class="nav-item" onclick="navigate('farmers')">
        <i class="fas fa-users"></i> Petani
      </button>
      <button class="nav-item" onclick="navigate('map')">
        <i class="fas fa-map-marked-alt"></i> Peta
      </button>

      <div class="nav-section-label" style="margin-top:8px">Data Pertanian</div>
      <button class="nav-item" onclick="navigate('visits')">
        <i class="fas fa-clipboard-list"></i> Kunjungan
      </button>
      <button class="nav-item" onclick="navigate('crops')">
        <i class="fas fa-seedling"></i> Tanaman
      </button>
      <button class="nav-item" onclick="navigate('production')">
        <i class="fas fa-box-open"></i> Produksi
      </button>

      <div class="nav-section-label" style="margin-top:8px">Lainnya</div>
      <button class="nav-item" onclick="navigate('hama')" id="nav-hama">
        <i class="fas fa-bug"></i> Rekap Hama
      </button>
      <button class="nav-item" onclick="navigate('gallery')">
        <i class="fas fa-images"></i> Galeri Foto
      </button>
      <button class="nav-item" onclick="navigate('reports')">
        <i class="fas fa-file-alt"></i> Laporan
      </button>
      <button class="nav-item" onclick="navigate('settings')">
        <i class="fas fa-cog"></i> Pengaturan
      </button>
    </nav>

    <div class="sidebar-footer">
      <span class="sidebar-footer-img">👨‍🌾</span>
      <div class="sidebar-footer-text">Kelola data pertanian lebih mudah dan akurat bersama TaniMap.</div>
      <div class="sidebar-footer-version">v1.0 · TaniMap 2026</div>
    </div>
  </aside>

  <!-- ===== MAIN CONTENT ===== -->
  <div class="main-content">

    <!-- Top Header -->
    <header class="top-header">
      <button class="hamburger-btn" onclick="toggleSidebar()">
        <i class="fas fa-bars"></i>
      </button>
      <div class="header-title">
        <span id="pageTitle">Beranda</span>
        <small id="pageSubtitle">Selamat datang di TaniMap</small>
      </div>
      <div class="header-actions">
        <div class="header-search">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Cari data..." id="globalSearch" />
        </div>

        <button class="btn btn-primary btn-sm" id="headerActionBtn" onclick="openAddFarmerModal()" style="display:none">
          <i class="fas fa-plus"></i> Tambah Petani
        </button>

      </div>
    </header>

    <!-- Page Content -->
    <main class="page-content">

      <!-- ========== DASHBOARD ========== -->
      <div class="page active" id="page-dashboard">

        <!-- Baris 1: Total Petani, Total Lahan, Total Kunjungan -->
        <div class="stats-grid stats-grid-primary" id="statsGridPrimary"></div>

        <!-- Baris 2: Total Komoditas, Total Tanaman, Total Produksi -->
        <div class="stats-grid stats-grid-secondary" id="statsGridSecondary"></div>

        <!-- Baris 3: Grafik Petani per Desa (full width) -->
        <div class="chart-card chart-card-full mb-2">
          <div class="chart-title">📍 Petani per Desa</div>
          <div class="chart-canvas-wrap" style="height:260px"><canvas id="chartVillage"></canvas></div>
        </div>

        <!-- Baris 4: Sebaran Komoditas + Tingkat Serangan Hama -->
        <div class="charts-grid charts-grid-2" style="margin-bottom:16px">
          <div class="chart-card">
            <div class="chart-title">🌾 Sebaran Komoditas</div>
            <div class="chart-canvas-wrap"><canvas id="chartCommodity"></canvas></div>
          </div>
          <div class="chart-card">
            <div class="chart-title">🔴 Tingkat Serangan Hama</div>
            <div class="chart-canvas-wrap"><canvas id="chartHamaTingkatOv"></canvas></div>
          </div>
        </div>

        <!-- Baris 5: Produksi per Komoditas + Penjualan per Komoditas -->
        <div class="charts-grid charts-grid-2">
          <div class="chart-card">
            <div class="chart-title">📦 Produksi per Komoditas (Kg/Ton)</div>
            <div class="chart-canvas-wrap" style="height:220px"><canvas id="chartProduction"></canvas></div>
          </div>
          <div class="chart-card">
            <div class="chart-title">💰 Penjualan per Komoditas (Rp)</div>
            <div class="chart-canvas-wrap" style="height:220px"><canvas id="chartPenjualan"></canvas></div>
          </div>
        </div>



      </div>

      <!-- ========== FARMERS ========== -->
      <div class="page" id="page-farmers">
        <div class="toolbar">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchFarmer" placeholder="Cari nama petani..." oninput="filterFarmers()" />
          </div>
          <select class="filter-select" id="filterVillage" onchange="filterFarmers()">
            <option value="">Semua Desa</option>
          </select>
          <select class="filter-select" id="filterDistrict" onchange="filterFarmers()">
            <option value="">Semua Kecamatan</option>
          </select>
          <select class="filter-select" id="filterCommodity" onchange="filterFarmers()">
            <option value="">Semua Komoditas</option>
          </select>

        </div>
        <div id="farmersGrid" class="farmers-grid"></div>
        <div id="farmersEmpty" class="empty-state" style="display:none">
          <div class="empty-icon">👨‍🌾</div>
          <p>Belum ada data petani.<br>Tambahkan petani pertama!</p>
        </div>
      </div>

      <!-- ========== MAP ========== -->
      <div class="page" id="page-map">
        <div class="map-filters">
          <div class="search-box" style="min-width:200px">
            <i class="fas fa-search"></i>
            <input type="text" id="searchMap" placeholder="Cari petani di peta..." oninput="filterMapMarkers()" />
          </div>
          <select class="filter-select" id="mapFilterVillage" onchange="filterMapMarkers()">
            <option value="">Semua Desa</option>
          </select>
          <select class="filter-select" id="mapFilterCommodity" onchange="filterMapMarkers()">
            <option value="">Semua Komoditas</option>
          </select>
          <button class="btn btn-outline btn-sm" onclick="getMyLocation()">
            <i class="fas fa-location-arrow"></i> Lokasi Saya
          </button>
          <button class="btn btn-secondary btn-sm" onclick="resetMap()">
            <i class="fas fa-redo"></i> Reset
          </button>
          <button class="btn btn-primary btn-sm" onclick="downloadMapPDF()" id="btnDownloadMap">
            <i class="fas fa-file-pdf"></i> Download PDF
          </button>
        </div>

        <!-- Layout peta + panel info -->
        <div class="map-layout">
          <!-- Peta utama (tanpa legenda di dalam) -->
          <div class="map-container">
            <div id="map"></div>
          </div>

          <!-- Panel info di samping peta -->
          <div class="map-info-panel">
            <!-- Legenda komoditas -->
            <div class="map-panel-card">
              <div class="map-panel-title"><i class="fas fa-circle-dot"></i> Legenda Komoditas</div>
              <div class="map-legend-list" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px 4px">
                <div class="legend-item"><div class="legend-dot" style="background:#1b5e20"></div> Kopi Arabika</div>
                <div class="legend-item"><div class="legend-dot" style="background:#2e7d32"></div> Kopi Robusta</div>
                <div class="legend-item"><div class="legend-dot" style="background:#f57f17"></div> Jagung</div>
                <div class="legend-item"><div class="legend-dot" style="background:#66bb6a"></div> Padi</div>
                <div class="legend-item"><div class="legend-dot" style="background:#6d4c41"></div> Kakao</div>
                <div class="legend-item"><div class="legend-dot" style="background:#e53935"></div> Cabai</div>
                <div class="legend-item"><div class="legend-dot" style="background:#ff7043"></div> Cengkeh</div>
                <div class="legend-item"><div class="legend-dot" style="background:#8e24aa"></div> Vanili</div>
                <div class="legend-item"><div class="legend-dot" style="background:#1565c0"></div> Lainnya</div>
              </div>
            </div>

            <!-- Statistik peta -->
            <div class="map-panel-card">
              <div class="map-panel-title"><i class="fas fa-chart-bar"></i> Statistik</div>
              <div id="mapStats"></div>
            </div>

            <!-- Petani di peta -->
            <div class="map-panel-card">
              <div class="map-panel-title"><i class="fas fa-users"></i> Petani di Peta</div>
              <div id="mapFarmerList" class="map-farmer-list"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== VISITS ========== -->
      <div class="page" id="page-visits">
        <div class="toolbar">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchVisit" placeholder="Cari kunjungan..." oninput="filterVisits()" />
          </div>
          <button class="btn btn-primary" onclick="openAddVisitModal()">
            <i class="fas fa-plus"></i> Tambah Kunjungan
          </button>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th><th>Petani</th><th class="hide-mobile">Desa</th><th class="hide-mobile">Petugas</th><th>Kondisi</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="visitsTable"></tbody>
              </table>
            </div>
            <div id="visitsEmpty" class="empty-state" style="display:none">
              <div class="empty-icon">📋</div>
              <p>Belum ada catatan kunjungan.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CROPS ========== -->
      <div class="page" id="page-crops">
        <div class="toolbar">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchCrop" placeholder="Cari tanaman..." oninput="filterCrops()" />
          </div>
          <select class="filter-select" id="filterCropStatus" onchange="filterCrops()">
            <option value="">Semua Status</option>
            <option value="Baik">Baik</option>
            <option value="Perawatan">Perawatan</option>
            <option value="Terserang Hama">Terserang Hama</option>
            <option value="Siap Panen">Siap Panen</option>
          </select>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tanaman</th><th>Petani</th><th class="hide-mobile">Desa</th><th class="hide-mobile">Luas Tanam</th><th class="hide-mobile">Umur</th><th>Status</th><th class="hide-mobile">Panen</th>
                  </tr>
                </thead>
                <tbody id="cropsTable"></tbody>
              </table>
            </div>
            <div id="cropsEmpty" class="empty-state" style="display:none">
              <div class="empty-icon">🌱</div>
              <p>Belum ada data tanaman.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== PRODUCTION ========== -->
      <div class="page" id="page-production">
        <div class="toolbar">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchProd" placeholder="Cari produksi..." oninput="filterProduction()" />
          </div>
          <select class="filter-select" id="filterProdCommodity" onchange="filterProduction()">
            <option value="">Semua Komoditas</option>
          </select>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-wrap">
              <table class="">
                <thead>
                  <tr>
                    <th>Tahun</th><th>Petani</th><th>Komoditas</th><th class="hide-mobile">Luas (Ha)</th><th class="hide-mobile">Jumlah</th><th class="hide-mobile">Harga/Satuan</th><th>Total</th><th class="hide-mobile">Pembeli</th>
                  </tr>
                </thead>
                <tbody id="productionTable"></tbody>
              </table>
            </div>
            <div id="productionEmpty" class="empty-state" style="display:none">
              <div class="empty-icon">📦</div>
              <p>Belum ada data produksi.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== REPORTS ========== -->
      <div class="page" id="page-reports">
        <div class="report-actions">
          <button class="btn btn-primary" onclick="bukaPreviewExcel()">
            <i class="fas fa-file-excel"></i> Export Excel
          </button>
          <button class="btn btn-danger" onclick="bukaPreviewPDF()">
            <i class="fas fa-file-pdf"></i> Export PDF
          </button>
          <button class="btn btn-sheets" onclick="exportToGoogleSheets()">
            <i class="fas fa-table"></i> Kirim ke Google Sheets
          </button>
        </div>

        <div id="reportContent"></div>
      </div>

      <!-- ========== SETTINGS ========== -->
      <!-- ===== PAGE: REKAP HAMA ===== -->
      <div class="page" id="page-hama">
        <div class="toolbar">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Cari hama..." oninput="filterHama(this.value)" />
          </div>
          <select class="filter-select" id="filterHamaTingkat" onchange="filterHama()">
            <option value="">Semua Tingkat</option>
            <option value="Ringan">Ringan</option>
            <option value="Sedang">Sedang</option>
            <option value="Berat">Berat</option>
          </select>
        </div>

        <div class="card">
          <div class="card-header" style="padding:14px 16px;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;justify-content:space-between">
            <h3 style="font-size:14px;font-weight:700">📋 Data Hama & Penyakit</h3>
            <span id="hamaCount" style="font-size:12px;color:var(--gray-500)"></span>
          </div>
          <div class="table-wrap">
            <table class="">
              <thead>
                <tr>
                  <th>#</th><th>Nama Petani</th><th>Desa</th><th>Tanaman</th>
                  <th>Nama Hama/Penyakit</th><th>Tingkat</th><th>Tanggal</th><th>Keterangan</th>
                </tr>
              </thead>
              <tbody id="hamaTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ===== PAGE: GALERI FOTO ===== -->
      <div class="page" id="page-gallery">

        <!-- Toolbar -->
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px">
          <select id="galleryFilter" onchange="renderGallery()" style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:var(--r-sm);font-size:13px;background:var(--white);color:var(--gray-700);flex:1;min-width:140px">
            <option value="all">Semua Foto</option>
            <option value="petani">Foto Petani</option>
            <option value="lahan">Foto Lahan</option>
            <option value="tanaman">Foto Tanaman</option>
          </select>
          <button class="btn btn-secondary btn-sm" onclick="gallerySelectAll()">
            <i class="fas fa-check-double"></i> Pilih Semua
          </button>
          <button class="btn btn-secondary btn-sm" onclick="galleryDeselectAll()">
            <i class="fas fa-times"></i> Hapus Pilihan
          </button>
          <button class="btn btn-primary btn-sm" onclick="gallerySendSelected()">
            <i class="fas fa-cloud-upload-alt"></i> Kirim ke Drive
          </button>
        </div>

        <!-- Status kirim -->
        <div id="galleryUploadStatus" style="display:none;padding:10px 14px;border-radius:var(--r-sm);font-size:13px;margin-bottom:12px"></div>

        <!-- Grid foto -->
        <div id="galleryGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">
          <div style="color:var(--gray-400);font-size:13px;grid-column:1/-1;text-align:center;padding:40px 0">
            <i class="fas fa-images" style="font-size:32px;margin-bottom:8px;display:block"></i>
            Belum ada foto tersimpan
          </div>
        </div>

      </div>

      <!-- ===== PAGE: SETTINGS ===== -->
      <div class="page" id="page-settings">

        <!-- SECTION: Tampilan -->
        <div class="settings-section-label"><i class="fas fa-palette"></i> Tampilan</div>
        <div class="settings-grid">

          <!-- Tema Warna -->
          <div class="settings-card">
            <div class="settings-card-header">
              <div class="settings-card-icon-sm"><i class="fas fa-adjust" style="color:var(--green-600)"></i></div>
              <div>
                <div class="settings-card-title">Tema Warna</div>
                <div class="settings-card-desc">Pilih tampilan terang atau gelap</div>
              </div>
            </div>
            <div class="theme-toggle-wrap">
              <button class="theme-btn active" id="themeLight" onclick="setTheme('light')">
                <i class="fas fa-sun"></i> Terang
              </button>
              <button class="theme-btn" id="themeDark" onclick="setTheme('dark')">
                <i class="fas fa-moon"></i> Gelap
              </button>
            </div>
          </div>

          <!-- Ukuran Huruf -->
          <div class="settings-card">
            <div class="settings-card-header">
              <div class="settings-card-icon-sm"><i class="fas fa-font" style="color:var(--green-600)"></i></div>
              <div>
                <div class="settings-card-title">Ukuran Huruf</div>
                <div class="settings-card-desc">Sesuaikan ukuran teks aplikasi</div>
              </div>
            </div>
            <div class="font-size-wrap">
              <button class="font-btn" id="fontSmall" onclick="setFontSize('small')">
                <span style="font-size:11px">A</span> Kecil
              </button>
              <button class="font-btn active" id="fontMedium" onclick="setFontSize('medium')">
                <span style="font-size:14px">A</span> Sedang
              </button>
              <button class="font-btn" id="fontLarge" onclick="setFontSize('large')">
                <span style="font-size:17px">A</span> Besar
              </button>
            </div>
            <div class="font-preview" id="fontPreview">
              Contoh teks dengan ukuran ini — TaniMap Sistem Informasi Petani.
            </div>
          </div>

        </div>

        <!-- SECTION: Google Drive -->
        <div class="settings-section-label" style="margin-top:24px"><i class="fab fa-google-drive"></i> Google Drive</div>
        <div class="settings-grid" style="grid-template-columns:1fr 1fr">

          <div class="settings-card">
            <div class="settings-card-header">
              <div class="settings-card-icon-sm"><i class="fab fa-google-drive" style="color:#1a73e8"></i></div>
              <div>
                <div class="settings-card-title">Backup ke Drive</div>
                <div class="settings-card-desc">Simpan semua data petani ke Google Drive kamu</div>
              </div>
            </div>
            <div id="driveStatusBackup" style="font-size:12px;color:var(--gray-400);margin-bottom:8px">Belum pernah backup</div>
            <button class="btn btn-primary btn-sm" onclick="backupToDrive()">
              <i class="fas fa-cloud-upload-alt"></i> Backup Sekarang
            </button>
          </div>

          <div class="settings-card">
            <div class="settings-card-header">
              <div class="settings-card-icon-sm"><i class="fas fa-cloud-download-alt" style="color:#34a853"></i></div>
              <div>
                <div class="settings-card-title">Restore dari Drive</div>
                <div class="settings-card-desc">Muat data petani dari file backup Google Drive</div>
              </div>
            </div>
            <div id="driveStatusRestore" style="font-size:12px;color:var(--gray-400);margin-bottom:8px">Pilih file backup untuk dimuat</div>
            <button class="btn btn-secondary btn-sm" onclick="restoreFromDrive()">
              <i class="fas fa-cloud-download-alt"></i> Restore dari Drive
            </button>
          </div>

        </div>

        <!-- SECTION: Data -->
        <div class="settings-section-label" style="margin-top:24px"><i class="fas fa-database"></i> Data</div>
        <div class="settings-grid" style="grid-template-columns:1fr 1fr">

          <div class="settings-card">
            <div class="settings-card-header">
              <div class="settings-card-icon-sm"><i class="fas fa-trash-alt" style="color:var(--red-500)"></i></div>
              <div>
                <div class="settings-card-title">Reset Semua Data</div>
                <div class="settings-card-desc">Hapus semua data dari penyimpanan lokal. Tidak bisa dibatalkan.</div>
              </div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="confirmReset()">
              <i class="fas fa-trash"></i> Reset Data
            </button>
          </div>

          <div class="settings-card">
            <div class="settings-card-header">
              <div class="settings-card-icon-sm"><i class="fas fa-info-circle" style="color:var(--blue-500)"></i></div>
              <div>
                <div class="settings-card-title">Informasi Aplikasi</div>
                <div class="settings-card-desc">TaniMap v1.0 — Sistem Informasi Petani Berbasis Lokasi.</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <span class="badge badge-green"><i class="fas fa-check-circle"></i> Offline Ready</span>
              <span class="badge badge-blue"><i class="fas fa-mobile-alt"></i> Android & Web</span>
            </div>
          </div>

        </div>

        <!-- SECTION: Kontak -->
        <div class="settings-section-label" style="margin-top:24px"><i class="fas fa-user"></i> Pengembang</div>
        <div class="settings-card settings-card-developer">
          <div class="developer-avatar">JM</div>
          <div class="developer-info">
            <div class="developer-name">Johan Mada</div>
            <div class="developer-links">
              <a href="tel:085333068814" class="developer-link">
                <i class="fas fa-phone"></i> 085 333 068 814
              </a>
              <a href="mailto:johanmada.jm.jm@gmail.com" class="developer-link">
                <i class="fas fa-envelope"></i> johanmada.jm.jm@gmail.com
              </a>
            </div>
          </div>
        </div>

      </div>

    </main>
  </div><!-- /main-content -->
</div><!-- /app-layout -->



<!-- ============ MODALS ============ -->

<!-- ADD/EDIT FARMER MODAL -->
<div class="modal-overlay" id="modalFarmer">
  <div class="modal modal-lg">
    <div class="modal-header">
      <div class="modal-title" id="modalFarmerTitle">Tambah Petani</div>
      <button class="modal-close" onclick="closeModal('modalFarmer')">&times;</button>
    </div>
    <div class="modal-body">
      <form id="farmerForm" onsubmit="saveFarmer(event)">
        <input type="hidden" id="farmerId" />
        <!-- Foto -->
        <div class="form-group">
          <label class="form-label">Foto Petani</label>
          <!-- Pilihan foto: Kamera atau Galeri -->
          <div id="photoUploadArea">
            <div class="photo-choice-btns">
              <label class="photo-choice-btn" id="btnCamera">
                <i class="fas fa-camera"></i>
                <span>Kamera</span>
                <input type="file" id="farmerPhotoCamera" accept="image/*" capture="environment" onchange="previewFarmerPhoto(event)" />
              </label>
              <label class="photo-choice-btn" id="btnGallery">
                <i class="fas fa-images"></i>
                <span>Galeri</span>
                <input type="file" id="farmerPhotoGallery" accept="image/*" onchange="previewFarmerPhoto(event)" />
              </label>
            </div>
          </div>
          <!-- Preview foto setelah dipilih -->
          <div id="farmerPhotoPreviewWrap" style="display:none; margin-top:10px; position:relative">
            <img id="farmerPhotoPreview" class="photo-preview" style="display:block" alt="Preview" />
            <button type="button" onclick="clearFarmerPhoto()" style="
              position:absolute; top:6px; right:6px;
              background:rgba(0,0,0,.55); color:white; border:none;
              border-radius:50%; width:28px; height:28px;
              font-size:14px; cursor:pointer; display:flex;
              align-items:center; justify-content:center;">✕</button>
          </div>
          <input type="hidden" id="farmerPhotoData" />
        </div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label class="form-label">Nama Lengkap <span class="required">*</span></label>
            <input type="text" class="form-control" id="fNama" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nomor HP</label>
            <input type="tel" class="form-control" id="fHp" />
          </div>
        </div>
        <div class="form-row cols-3">
          <div class="form-group">
            <label class="form-label">Jenis Kelamin</label>
            <select class="form-control" id="fJK">
              <option>Laki-laki</option><option>Perempuan</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Umur</label>
            <input type="number" class="form-control" id="fUmur" min="15" max="100" />
          </div>
          <div class="form-group">
            <label class="form-label">Komoditas Utama <span class="required">*</span></label>
            <select class="form-control" id="fKomoditas" required>
              <option>Kopi Arabika</option>
              <option>Kopi Robusta</option>
              <option>Jagung</option>
              <option>Padi</option>
              <option>Kakao</option>
              <option>Cengkeh</option>
              <option>Cabai</option>
              <option>Vanili</option>
              <option>Lainnya</option>
            </select>
          </div>
        </div>
        <div class="form-row cols-3">
          <div class="form-group">
            <label class="form-label">Desa <span class="required">*</span></label>
            <input type="text" class="form-control" id="fDesa" required />
          </div>
          <div class="form-group">
            <label class="form-label">Kecamatan <span class="required">*</span></label>
            <input type="text" class="form-control" id="fKecamatan" required />
          </div>
          <div class="form-group">
            <label class="form-label">Kabupaten</label>
            <input type="text" class="form-control" id="fKabupaten" value="Manggarai" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Alamat Lengkap</label>
          <textarea class="form-control" id="fAlamat" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Kelompok Tani</label>
          <input type="text" class="form-control" id="fKelompok" />
        </div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label class="form-label">Latitude (GPS)</label>
            <input type="number" class="form-control" id="fLat" step="0.000001" placeholder="-8.6100" />
          </div>
          <div class="form-group">
            <label class="form-label">Longitude (GPS)</label>
            <input type="number" class="form-control" id="fLng" step="0.000001" placeholder="120.4674" />
          </div>
        </div>
        <div class="flex" style="gap:8px">
          <button type="button" class="btn btn-secondary btn-sm" onclick="getGPSForForm()">
            <i class="fas fa-location-arrow"></i> Ambil GPS
          </button>
        </div>

        <!-- ===== SECTION: LAHAN ===== -->
        <div style="margin-top:24px">
          <div class="section-title">🗺️ Data Lahan <span id="lahanFormCount" style="font-size:11px;color:var(--gray-400);font-weight:400;margin-left:4px"></span></div>
          <div id="lahanFormList"></div>
          <button type="button" class="btn btn-outline btn-sm mt-1" onclick="addLahanRow()">
            <i class="fas fa-plus"></i> Tambah Lahan
          </button>
        </div>

        <!-- ===== SECTION: TANAMAN ===== -->
        <div style="margin-top:24px">
          <div class="section-title">🌱 Data Tanaman <span id="tanamanFormCount" style="font-size:11px;color:var(--gray-400);font-weight:400;margin-left:4px"></span></div>
          <div id="tanamanFormList"></div>
          <button type="button" class="btn btn-outline btn-sm mt-1" onclick="addTanamanRow()">
            <i class="fas fa-plus"></i> Tambah Tanaman
          </button>
        </div>

        <!-- ===== SECTION: PRODUKSI ===== -->
        <div style="margin-top:24px">
          <div class="section-title">📦 Data Produksi <span id="produksiFormCount" style="font-size:11px;color:var(--gray-400);font-weight:400;margin-left:4px"></span></div>
          <div id="produksiFormList"></div>
          <button type="button" class="btn btn-outline btn-sm mt-1" onclick="addProduksiRow()">
            <i class="fas fa-plus"></i> Tambah Produksi
          </button>
        </div>

      </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalFarmer')">Batal</button>
      <button class="btn btn-primary" onclick="document.getElementById('farmerForm').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}))">
        <i class="fas fa-save"></i> Simpan Semua
      </button>
    </div>
  </div>
</div>

<!-- DETAIL FARMER MODAL -->
<div class="modal-overlay" id="modalDetail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <div class="modal-title">Detail Petani</div>
      <button class="modal-close" onclick="closeModal('modalDetail')">&times;</button>
    </div>
    <div class="modal-body" id="modalDetailBody">
    </div>
  </div>
</div>

<!-- ADD VISIT MODAL -->
<div class="modal-overlay" id="modalVisit">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title" id="modalVisitTitle">Tambah Kunjungan</div>
      <button class="modal-close" onclick="closeModal('modalVisit')">&times;</button>
    </div>
    <div class="modal-body">
      <form id="visitForm" onsubmit="saveVisit(event)">
        <input type="hidden" id="visitFarmerId" />
        <input type="hidden" id="visitId" />
        <div class="form-group">
          <label class="form-label">Petani <span class="required">*</span></label>
          <select class="form-control" id="vFarmerSelect" required></select>
        </div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label class="form-label">Tanggal Kunjungan <span class="required">*</span></label>
            <input type="date" class="form-control" id="vTanggal" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nama Petugas <span class="required">*</span></label>
            <input type="text" class="form-control" id="vPetugas" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Kondisi Tanaman</label>
          <select class="form-control" id="vKondisi">
            <option>Baik</option><option>Cukup</option><option>Kurang Baik</option><option>Kritis</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Masalah Ditemukan</label>
          <textarea class="form-control" id="vMasalah" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Rekomendasi Tindak Lanjut</label>
          <textarea class="form-control" id="vRekomendasi" rows="2"></textarea>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-outline btn-sm" onclick="getGPSForVisit()" style="margin-bottom:8px">
            <i class="fas fa-map-marker-alt"></i> Ambil Titik Lokasi
          </button>
        </div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label class="form-label">Latitude</label>
            <input type="number" class="form-control" id="vLat" step="0.000001" />
          </div>
          <div class="form-group">
            <label class="form-label">Longitude</label>
            <input type="number" class="form-control" id="vLng" step="0.000001" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Catatan Lapangan</label>
          <textarea class="form-control" id="vCatatan" rows="2"></textarea>
        </div>

        <!-- HAMA & PENYAKIT -->
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--gray-200)">
          <div style="font-weight:600;font-size:13px;color:var(--gray-700);margin-bottom:10px">
            <i class="fas fa-bug" style="color:#f59e0b"></i> Hama & Penyakit (opsional)
          </div>
          <div id="visitHamaList"></div>
          <button type="button" class="btn btn-outline btn-sm" onclick="addVisitHamaRow()" style="margin-top:6px">
            <i class="fas fa-plus"></i> Tambah Hama/Penyakit
          </button>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalVisit')">Batal</button>
      <button class="btn btn-primary" onclick="document.getElementById('visitForm').dispatchEvent(new Event('submit'))">
        <i class="fas fa-save"></i> Simpan
      </button>
    </div>
  </div>
</div>

<!-- CONFIRM DIALOG -->
<div id="confirm-overlay">
  <div class="confirm-box">
    <div class="confirm-icon" id="confirmIcon">⚠️</div>
    <div class="confirm-title" id="confirmTitle">Konfirmasi</div>
    <div class="confirm-msg" id="confirmMsg">Apakah Anda yakin?</div>
    <div class="confirm-actions">
      <button class="btn btn-secondary" onclick="closeConfirm()">Batal</button>
      <button class="btn btn-danger" id="confirmOkBtn" onclick="">Ya, Lanjutkan</button>
    </div>
  </div>
</div>

<!-- Toast Container -->
<!-- ===== BOTTOM NAV (Mobile/APK only) ===== -->
<nav class="bottom-nav" id="bottomNav">

  <!-- Tab 1: Beranda -->
  <button class="bottom-nav-item active" id="bnav-dashboard" onclick="navigate('dashboard')" style="flex-direction:column;align-items:center;justify-content:center;display:flex;height:100%;background:none;border:none;cursor:pointer;gap:3px;padding:6px 0">
    <i class="fas fa-home"></i>
    <span>Beranda</span>
  </button>

  <!-- Tab 2: Petani -->
  <button class="bottom-nav-item" id="bnav-farmers" onclick="navigate('farmers')" style="flex-direction:column;align-items:center;justify-content:center;display:flex;height:100%;background:none;border:none;cursor:pointer;gap:3px;padding:6px 0">
    <i class="fas fa-users"></i>
    <span>Petani</span>
  </button>

  <!-- Tab 3: Tombol Tambah Tengah (FAB style) -->
  <div style="display:flex;align-items:center;justify-content:center;padding-bottom:6px">
    <button onclick="toggleMoreMenu()" id="btnMoreNav"
      style="width:52px;height:52px;border-radius:50%;background:var(--green-600);border:none;color:white;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.25);transition:transform .15s">
      <i class="fas fa-grid-2" id="moreNavIcon"></i>
    </button>
  </div>

  <!-- Tab 4: Laporan -->
  <button class="bottom-nav-item" id="bnav-reports" onclick="navigate('reports')" style="flex-direction:column;align-items:center;justify-content:center;display:flex;height:100%;background:none;border:none;cursor:pointer;gap:3px;padding:6px 0">
    <i class="fas fa-file-alt"></i>
    <span>Laporan</span>
  </button>

  <!-- Tab 5: Pengaturan -->
  <button class="bottom-nav-item" id="bnav-settings" onclick="navigate('settings')" style="flex-direction:column;align-items:center;justify-content:center;display:flex;height:100%;background:none;border:none;cursor:pointer;gap:3px;padding:6px 0">
    <i class="fas fa-cog"></i>
    <span>Pengaturan</span>
  </button>

</nav>

<!-- Menu Lainnya (slide-up) -->
<div id="moreMenuOverlay" onclick="closeMoreMenu()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:1000"></div>
<div id="moreMenuSheet" style="display:none;position:fixed;bottom:60px;left:0;right:0;background:var(--white);border-radius:20px 20px 0 0;padding:16px;z-index:1001;box-shadow:0 -4px 24px rgba(0,0,0,.15)">
  <div style="width:36px;height:4px;background:var(--gray-200);border-radius:2px;margin:0 auto 16px"></div>
  <div style="font-size:12px;font-weight:600;color:var(--gray-400);margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em">Menu</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">

    <button onclick="closeMoreMenu();navigate('map')" id="bnav-map"
      style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border:1px solid var(--gray-100);border-radius:12px;background:var(--gray-50);cursor:pointer;font-size:11px;font-weight:500;color:var(--gray-700)">
      <i class="fas fa-map-marker-alt" style="font-size:18px;color:var(--green-600)"></i>Peta
    </button>

    <button onclick="closeMoreMenu();navigate('visits')" id="bnav-visits"
      style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border:1px solid var(--gray-100);border-radius:12px;background:var(--gray-50);cursor:pointer;font-size:11px;font-weight:500;color:var(--gray-700)">
      <i class="fas fa-clipboard-list" style="font-size:18px;color:#3b82f6"></i>Kunjungan
    </button>

    <button onclick="closeMoreMenu();navigate('crops')" id="bnav-crops"
      style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border:1px solid var(--gray-100);border-radius:12px;background:var(--gray-50);cursor:pointer;font-size:11px;font-weight:500;color:var(--gray-700)">
      <i class="fas fa-seedling" style="font-size:18px;color:#10b981"></i>Tanaman
    </button>

    <button onclick="closeMoreMenu();navigate('production')" id="bnav-production"
      style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border:1px solid var(--gray-100);border-radius:12px;background:var(--gray-50);cursor:pointer;font-size:11px;font-weight:500;color:var(--gray-700)">
      <i class="fas fa-box" style="font-size:18px;color:#f59e0b"></i>Produksi
    </button>

    <button onclick="closeMoreMenu();navigate('gallery')" id="bnav-gallery"
      style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border:1px solid var(--gray-100);border-radius:12px;background:var(--gray-50);cursor:pointer;font-size:11px;font-weight:500;color:var(--gray-700)">
      <i class="fas fa-images" style="font-size:18px;color:#8b5cf6"></i>Galeri
    </button>

    <button onclick="closeMoreMenu();navigate('hama')" id="bnav-hama"
      style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border:1px solid var(--gray-100);border-radius:12px;background:var(--gray-50);cursor:pointer;font-size:11px;font-weight:500;color:var(--gray-700)">
      <i class="fas fa-bug" style="font-size:18px;color:#ef4444"></i>Rekap Hama
    </button>

  </div>
</div>

<div id="toast-container" style="position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:320px"></div>

<!-- ===== FAB (Floating Action Button) ===== -->
<div class="fab-overlay" id="fabOverlay" onclick="closeFab()"></div>
<div class="fab-container" id="fabContainer">
  <div class="fab-menu" id="fabMenu">
    <button class="fab-menu-item" onclick="closeFab();openAddVisitModal()">
      <div class="fab-menu-icon" style="background:#1e74d4">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <span>Tambah Kunjungan</span>
    </button>
    <button class="fab-menu-item" onclick="closeFab();openAddFarmerModal()">
      <div class="fab-menu-icon" style="background:#2e7d39">
        <i class="fas fa-user-plus"></i>
      </div>
      <span>Tambah Petani</span>
    </button>
  </div>
  <button class="fab-btn" id="fabBtn" onclick="toggleFab()">
    <i class="fas fa-plus" id="fabIcon"></i>
  </button>
</div>

<!-- ============ SCRIPTS ============ -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<!-- SheetJS untuk export Excel -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<!-- jsPDF + AutoTable untuk export PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>
<!-- QRCode untuk kartu petani -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script src="https://apis.google.com/js/api.js"></script>
<script src="https://accounts.google.com/gsi/client"></script>
<script src="script.js"></script>
<!-- MODAL FOTO VIEWER -->
<div class="modal-overlay" id="modalFotoViewer">
  <div class="modal" style="max-width:480px">
    <div class="modal-header">
      <div class="modal-title" id="modalFotoTitle">Foto Petani</div>
      <button class="modal-close" onclick="closeModal('modalFotoViewer')">&times;</button>
    </div>
    <div class="modal-body" style="padding:16px;text-align:center">
      <img id="modalFotoImg" src="" alt="Foto"
        style="width:100%;max-height:400px;object-fit:contain;border-radius:var(--r-md);background:var(--gray-50)" />
      <div id="modalFotoInfo" style="margin-top:12px;font-size:12px;color:var(--gray-400)"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalFotoViewer')">
        <i class="fas fa-times"></i> Tutup
      </button>
      <button class="btn btn-primary" id="modalFotoSaveBtn" onclick="simpanFotoModal()">
        <i class="fas fa-download"></i> Simpan ke HP
      </button>
    </div>
  </div>
</div>

<!-- MODAL PREVIEW DOWNLOAD -->
<div class="modal-overlay" id="modalDownloadPreview">
  <div class="modal" style="max-width:520px">
    <div class="modal-header">
      <div class="modal-title" id="dlPreviewTitle">Preview Sebelum Download</div>
      <button class="modal-close" onclick="closeModal('modalDownloadPreview')">&times;</button>
    </div>
    <div class="modal-body" style="padding:20px">

      <!-- Preview kartu/file -->
      <div id="dlPreviewContent" style="margin-bottom:16px"></div>

      <!-- Info file -->
      <div style="background:var(--gray-50);border:1px solid var(--gray-100);border-radius:var(--r-sm);padding:12px;margin-bottom:16px">
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.5px">Nama File</div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-900)" id="dlPreviewFilename">—</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.5px">Format</div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-900)" id="dlPreviewFormat">—</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.5px">Konten</div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-900)" id="dlPreviewInfo">—</div>
          </div>
        </div>
      </div>

      <div style="background:var(--blue-50);border:1px solid var(--blue-100);border-radius:var(--r-sm);padding:10px;font-size:12px;color:var(--blue-600)">
        <i class="fas fa-info-circle"></i> File akan disimpan ke folder <b>Download</b> di perangkat kamu.
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalDownloadPreview')">
        <i class="fas fa-times"></i> Batal
      </button>
      <button class="btn btn-primary" id="dlPreviewBtn" onclick="executePendingDownload()">
        <i class="fas fa-download"></i> Download Sekarang
      </button>
    </div>
  </div>
</div>

<!-- MODAL GALERI FOTO PREVIEW -->
<div id="modalGaleriPreview" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;align-items:center;justify-content:center;padding:16px" onclick="tutupGaleriPreview(event)">
  <div style="position:relative;max-width:92vw;max-height:92vh">
    <button onclick="tutupGaleriPreview()" style="position:absolute;top:-14px;right:-14px;width:34px;height:34px;border-radius:50%;background:#fff;border:none;font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#111;z-index:1;box-shadow:0 2px 8px rgba(0,0,0,.3)">✕</button>
    <img id="galeriPreviewImg" src="" style="max-width:92vw;max-height:88vh;border-radius:10px;object-fit:contain;display:block" />
    <div id="galeriPreviewLabel" style="text-align:center;color:#fff;font-size:13px;margin-top:10px;font-weight:600"></div>
  </div>
</div>

<!-- MODAL PREVIEW EXCEL -->
<div class="modal-overlay" id="modalPreviewExcel">
  <div class="modal" style="max-width:98vw;width:720px">
    <div class="modal-header">
      <div class="modal-title"><i class="fas fa-file-excel" style="color:#1d6f42"></i> Preview Data Excel</div>
      <button class="modal-close" onclick="closeModal('modalPreviewExcel')">&times;</button>
    </div>
    <div class="modal-body" style="padding:0;max-height:70vh;overflow-y:auto">
      <div id="excelPreviewContent" style="padding:16px"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalPreviewExcel')">
        <i class="fas fa-times"></i> Tutup
      </button>
      <button class="btn btn-primary" onclick="unduhExcel()">
        <i class="fas fa-download"></i> Unduh Excel
      </button>
    </div>
  </div>
</div>

<!-- MODAL PREVIEW PDF -->
<div class="modal-overlay" id="modalPreviewPDF">
  <div class="modal" style="max-width:98vw;width:860px">
    <div class="modal-header">
      <div class="modal-title"><i class="fas fa-file-pdf" style="color:#e53935"></i> Preview Laporan PDF</div>
      <button class="modal-close" onclick="closeModal('modalPreviewPDF')">&times;</button>
    </div>
    <div class="modal-body" style="padding:0;max-height:75vh;overflow:hidden">
      <div id="pdfPreviewContent" style="height:75vh"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalPreviewPDF')">
        <i class="fas fa-times"></i> Tutup
      </button>
      <button class="btn btn-danger" id="btnUnduhPDF" onclick="unduhPDF()">
        <i class="fas fa-download"></i> Unduh PDF
      </button>
    </div>
  </div>
</div>


</div><!-- end mainContent -->

<!-- MODAL GOOGLE SHEETS -->
        <!-- Modal konfirmasi Google Sheets -->
        <div class="modal-overlay" id="modalSheets">
          <div class="modal" style="max-width:440px">
            <div class="modal-header">
              <div class="modal-title">Kirim ke Google Sheets</div>
              <button class="modal-close" onclick="closeModal('modalSheets')">&times;</button>
            </div>
            <div class="modal-body">
              <div id="sheetsStatus" style="display:none"></div>
              <div class="form-group">
                <label class="form-label">Nama Pengirim <span class="required">*</span></label>
                <input type="text" class="form-control" id="sheetsPengirim" placeholder="contoh: Johan Mada" />
                <small style="color:var(--gray-400);font-size:11px;margin-top:4px;display:block">Nama ini akan dicatat sebagai pengirim data di Google Sheets</small>
              </div>
              <div class="form-group">
                <label class="form-label">Kirim Data</label>
                <div style="display:flex;flex-direction:column;gap:8px">
                  <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" id="chkPetani" checked /> Data Petani (${farmers_count} petani)
                  </label>
                  <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" id="chkKunjungan" checked /> Data Kunjungan
                  </label>
                  <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" id="chkProduksi" checked /> Data Produksi
                  </label>
                </div>
              </div>
              <div style="background:var(--green-50);border:1px solid var(--green-200);border-radius:var(--r-sm);padding:12px;font-size:12px;color:var(--green-700)">
                <i class="fas fa-info-circle"></i> Data akan dikirim ke Google Sheets milik admin dan digabung dengan data dari pengguna lain.
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" onclick="closeModal('modalSheets')">Batal</button>
              <button class="btn btn-sheets" id="btnKirimSheets" onclick="doSendToSheets()">
                <i class="fas fa-paper-plane"></i> Kirim Sekarang
              </button>
            </div>
          </div>
        </div>

<!-- SPLASH SCREEN -->
<div id="splashScreen">

  <div class="splash-logo">Tani<span>Map</span></div>
  <div class="splash-tagline">Sistem Informasi Manajemen Petani</div>
  <div class="splash-divider"></div>

  <div class="splash-feature">
    <div class="splash-feature-icon" style="background:rgba(5,150,105,.2)">
      <i class="fas fa-users" style="color:#34d399"></i>
    </div>
    <div class="splash-feature-text">
      <h4>Kelola Data Petani</h4>
      <p>Catat data petani, lahan, tanaman, dan produksi secara lengkap dan terstruktur</p>
    </div>
  </div>

  <div class="splash-feature">
    <div class="splash-feature-icon" style="background:rgba(37,99,235,.2)">
      <i class="fas fa-map-marker-alt" style="color:#60a5fa"></i>
    </div>
    <div class="splash-feature-text">
      <h4>Peta Interaktif</h4>
      <p>Visualisasi sebaran lokasi petani dengan marker berwarna per komoditas</p>
    </div>
  </div>

  <div class="splash-feature">
    <div class="splash-feature-icon" style="background:rgba(217,119,6,.2)">
      <i class="fas fa-file-alt" style="color:#fbbf24"></i>
    </div>
    <div class="splash-feature-text">
      <h4>Laporan & Export</h4>
      <p>Export data ke Excel, PDF, dan sinkronisasi langsung ke Google Sheets</p>
    </div>
  </div>

  <div class="splash-feature">
    <div class="splash-feature-icon" style="background:rgba(124,58,237,.2)">
      <i class="fas fa-images" style="color:#a78bfa"></i>
    </div>
    <div class="splash-feature-text">
      <h4>Galeri Foto Lapangan</h4>
      <p>Dokumentasi foto petani, lahan, dan tanaman langsung dari kamera HP</p>
    </div>
  </div>

  <div class="splash-version">TaniMap v1.0 &nbsp;·&nbsp; Nusa Tenggara Timur &nbsp;·&nbsp; 2026</div>

  <button class="splash-btn" onclick="mulaiApp()">
    <i class="fas fa-arrow-right"></i> &nbsp; Mulai
  </button>

</div>


</body>
</html>
