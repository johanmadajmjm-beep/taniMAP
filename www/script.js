/**
 * TaniMap — Sistem Informasi Pendataan, Pemetaan, dan Monitoring Petani
 * script.js — Main Application Logic
 * Version 1.0 | 2024
 */

// ============================================================
//  GLOBAL STATE
// ============================================================

let farmers = [];           // Array utama data petani
let map = null;             // Instance Leaflet map
let mapMarkers = [];        // Array marker di peta
let charts = {};            // Chart.js instances
let currentPage = 'dashboard';  // Halaman aktif

// ============================================================
//  INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  loadFromStorage();           // Muat data dari localStorage
  navigate('dashboard');       // Tampilkan halaman beranda
});

/**
 * Muat data dari localStorage. Jika kosong, muat dari farmers.json
 */
async function loadFromStorage() {
  const stored = localStorage.getItem('tanimap_farmers');
  if (stored) {
    farmers = JSON.parse(stored);
  } else {
    await loadSampleData();
    return; // loadSampleData juga memanggil refresh
  }
  refreshAll();
}

/**
 * Muat data contoh dari file data/farmers.json
 */
async function loadSampleData() {
  try {
    const res = await fetch('data/farmers.json');
    if (!res.ok) throw new Error('Gagal muat data contoh');
    farmers = await res.json();
    saveToStorage();
    refreshAll();
    showToast('Data contoh berhasil dimuat', 'success');
  } catch (e) {
    // Fallback: jika fetch gagal (mis. file://), pakai data inline minimal
    farmers = getFallbackData();
    saveToStorage();
    refreshAll();
  }
}

/**
 * Simpan farmers ke localStorage
 */
function saveToStorage() {
  localStorage.setItem('tanimap_farmers', JSON.stringify(farmers));
}

/**
 * Refresh semua view
 */
function refreshAll() {
  renderDashboard();
  renderFarmersGrid();
  renderVisitsTable();
  renderCropsTable();
  renderProductionTable();
  renderReports();
  populateFilters();
  if (currentPage === 'map' && map) renderMapMarkers();
}

// ============================================================
//  NAVIGATION
// ============================================================

/**
 * Navigasi ke halaman tertentu
 * @param {string} page - ID halaman
 */
function navigate(page) {
  currentPage = page;

  // Sembunyikan semua page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Aktifkan page yang dituju
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // Update nav items (sidebar)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(`'${page}'`)) {
      item.classList.add('active');
    }
  });

  // Update header
  const titles = {
    dashboard: ['Beranda', 'Ringkasan data pertanian'],
    farmers: ['Data Petani', 'Kelola data petani'],
    map: ['Peta Interaktif', 'Sebaran lokasi petani'],
    visits: ['Kunjungan Lapangan', 'Catatan kunjungan petugas'],
    crops: ['Data Tanaman', 'Monitoring tanaman petani'],
    production: ['Data Produksi', 'Rekap hasil produksi'],
    reports: ['Laporan', 'Rekap dan export data'],
    settings: ['Pengaturan', 'Konfigurasi aplikasi'],
  };
  const t = titles[page] || [page, ''];
  document.getElementById('pageTitle').textContent = t[0];
  document.getElementById('pageSubtitle').textContent = t[1];

  // Tombol aksi header
  const headerBtn = document.getElementById('headerActionBtn');
  headerBtn.style.display = page === 'farmers' ? 'flex' : 'none';

  // Inisialisasi peta saat pertama dibuka
  if (page === 'map') {
    setTimeout(() => {
      initMap();
      renderMapMarkers();
    }, 100);
  }

  // Tutup sidebar di mobile
  if (window.innerWidth < 900) closeSidebar();
}

// ============================================================
//  SIDEBAR TOGGLE
// ============================================================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ============================================================
//  DASHBOARD
// ============================================================

function renderDashboard() {
  renderStats();
  renderCharts();
  renderRecentFarmers();
}

function renderStats() {
  const totalFarmers = farmers.length;
  const totalLahan = farmers.reduce((s, f) => s + (f.lahan || []).reduce((a, l) => a + (parseFloat(l.luas) || 0), 0), 0);
  const komoditasSet = new Set(farmers.map(f => f.komoditas));
  const totalVisits = farmers.reduce((s, f) => s + (f.kunjungan || []).length, 0);
  const totalProd = farmers.reduce((s, f) => s + (f.produksi || []).reduce((a, p) => a + (parseFloat(p.jumlah) || 0), 0), 0);
  const totalTanaman = farmers.reduce((s, f) => s + (f.tanaman || []).length, 0);

  const stats = [
    { icon: '👨‍🌾', label: 'Total Petani', value: totalFarmers, color: 'green' },
    { icon: '🌾', label: 'Total Komoditas', value: komoditasSet.size, color: 'orange' },
    { icon: '🗺️', label: 'Total Lahan (Ha)', value: totalLahan.toFixed(2), color: 'blue' },
    { icon: '📋', label: 'Total Kunjungan', value: totalVisits, color: 'brown' },
    { icon: '🌱', label: 'Total Tanaman', value: totalTanaman, color: 'green' },
    { icon: '📦', label: 'Total Produksi', value: totalProd.toFixed(0) + ' Kg/Ton', color: 'orange' },
  ];

  const grid = document.getElementById('statsGrid');
  grid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon ${s.color}">${s.icon}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

function renderCharts() {
  // Hancurkan chart lama
  ['chartVillage', 'chartCommodity', 'chartProduction'].forEach(id => {
    if (charts[id]) { charts[id].destroy(); delete charts[id]; }
  });

  // Chart: Petani per Desa
  const villageCount = {};
  farmers.forEach(f => { villageCount[f.desa] = (villageCount[f.desa] || 0) + 1; });
  charts['chartVillage'] = new Chart(document.getElementById('chartVillage'), {
    type: 'bar',
    data: {
      labels: Object.keys(villageCount),
      datasets: [{ label: 'Petani', data: Object.values(villageCount),
        backgroundColor: '#4caf50', borderRadius: 6 }]
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });

  // Chart: Komoditas
  const commCount = {};
  farmers.forEach(f => { commCount[f.komoditas] = (commCount[f.komoditas] || 0) + 1; });
  const colors = ['#1b5e20','#f57f17','#66bb6a','#6d4c41','#e53935','#ff7043','#8e24aa','#1565c0','#37474f'];
  charts['chartCommodity'] = new Chart(document.getElementById('chartCommodity'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(commCount),
      datasets: [{ data: Object.values(commCount), backgroundColor: colors }]
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
  });

  // Chart: Produksi per Komoditas
  const prodMap = {};
  farmers.forEach(f => (f.produksi || []).forEach(p => {
    prodMap[p.komoditas] = (prodMap[p.komoditas] || 0) + (parseFloat(p.jumlah) || 0);
  }));
  charts['chartProduction'] = new Chart(document.getElementById('chartProduction'), {
    type: 'bar',
    data: {
      labels: Object.keys(prodMap),
      datasets: [{ label: 'Produksi', data: Object.values(prodMap),
        backgroundColor: '#f57c00', borderRadius: 6 }]
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } } }
  });
}

function renderRecentFarmers() {
  const tbody = document.getElementById('recentFarmersTable');
  const recent = [...farmers].sort((a, b) => new Date(b.tanggalInput) - new Date(a.tanggalInput)).slice(0, 5);
  if (!recent.length) { tbody.innerHTML = '<tr><td colspan="5" class="text-muted" style="text-align:center;padding:20px">Belum ada data</td></tr>'; return; }
  tbody.innerHTML = recent.map(f => `
    <tr>
      <td>
        <div class="flex items-center gap-1" style="gap:10px">
          ${f.foto ? `<img src="${f.foto}" style="width:32px;height:32px;border-radius:6px;object-fit:cover" />` : `<div style="width:32px;height:32px;border-radius:6px;background:var(--green-100);display:flex;align-items:center;justify-content:center">👨‍🌾</div>`}
          <span class="fw-bold">${f.nama}</span>
        </div>
      </td>
      <td>${f.desa}</td>
      <td>${commodityBadge(f.komoditas)}</td>
      <td>${(f.lahan||[]).reduce((s,l)=>s+(parseFloat(l.luas)||0),0).toFixed(2)} Ha</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openDetail('${f.id}')">Detail</button>
      </td>
    </tr>
  `).join('');
}

// ============================================================
//  FARMERS
// ============================================================

function renderFarmersGrid() {
  const grid = document.getElementById('farmersGrid');
  const empty = document.getElementById('farmersEmpty');
  const filtered = getFilteredFarmers();

  if (!filtered.length) {
    grid.innerHTML = ''; empty.style.display = 'block'; return;
  }
  empty.style.display = 'none';
  grid.innerHTML = filtered.map(f => farmerCardHTML(f)).join('');
}

function farmerCardHTML(f) {
  const totalLahan = (f.lahan || []).reduce((s, l) => s + (parseFloat(l.luas) || 0), 0);
  const avatarHtml = f.foto
    ? `<div class="farmer-avatar"><img src="${f.foto}" alt="${f.nama}" /></div>`
    : `<div class="farmer-avatar">👨‍🌾</div>`;
  return `
    <div class="farmer-card">
      <div class="farmer-card-top">
        ${avatarHtml}
        <div class="farmer-info">
          <div class="farmer-name">${f.nama}</div>
          <div class="farmer-village"><i class="fas fa-map-marker-alt text-green" style="font-size:11px"></i> ${f.desa}, ${f.kecamatan}</div>
          <div class="farmer-meta mt-1">
            ${commodityBadge(f.komoditas)}
          </div>
        </div>
      </div>
      <div class="farmer-card-body">
        <div class="info-grid" style="grid-template-columns:1fr 1fr;gap:8px">
          <div><div class="info-key">Lahan</div><div class="info-value">${totalLahan.toFixed(2)} Ha</div></div>
          <div><div class="info-key">Kelompok</div><div class="info-value">${f.kelompokTani || '-'}</div></div>
        </div>
        ${f.lat && f.lng ? `<div class="gps-display mt-1"><i class="fas fa-map-pin"></i>${f.lat.toFixed(4)}, ${f.lng.toFixed(4)}</div>` : ''}
      </div>
      <div class="farmer-card-footer">
        <button class="btn btn-outline btn-sm" style="flex:1" onclick="openDetail('${f.id}')"><i class="fas fa-eye"></i> Detail</button>
        <button class="btn btn-secondary btn-sm" onclick="cetakKartu('${f.id}')"><i class="fas fa-id-card"></i></button>
        <button class="btn btn-secondary btn-sm" onclick="openEditFarmer('${f.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteFarmer('${f.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `;
}

function getFilteredFarmers() {
  const search = (document.getElementById('searchFarmer')?.value || '').toLowerCase();
  const village = document.getElementById('filterVillage')?.value || '';
  const district = document.getElementById('filterDistrict')?.value || '';
  const commodity = document.getElementById('filterCommodity')?.value || '';
  return farmers.filter(f =>
    (!search || f.nama.toLowerCase().includes(search)) &&
    (!village || f.desa === village) &&
    (!district || f.kecamatan === district) &&
    (!commodity || f.komoditas === commodity)
  );
}

function filterFarmers() { renderFarmersGrid(); }

function populateFilters() {
  const villages = [...new Set(farmers.map(f => f.desa))].sort();
  const districts = [...new Set(farmers.map(f => f.kecamatan))].sort();
  const commodities = [...new Set(farmers.map(f => f.komoditas))].sort();

  // Sidebar filter & map filters
  ['filterVillage', 'mapFilterVillage'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = el.value;
    el.innerHTML = '<option value="">Semua Desa</option>' + villages.map(v => `<option value="${v}">${v}</option>`).join('');
    el.value = cur;
  });
  ['filterDistrict'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = el.value;
    el.innerHTML = '<option value="">Semua Kecamatan</option>' + districts.map(d => `<option value="${d}">${d}</option>`).join('');
    el.value = cur;
  });
  ['filterCommodity', 'mapFilterCommodity', 'filterProdCommodity'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = el.value;
    el.innerHTML = '<option value="">Semua Komoditas</option>' + commodities.map(c => `<option value="${c}">${c}</option>`).join('');
    el.value = cur;
  });

  // Populate visit farmer select
  const vSel = document.getElementById('vFarmerSelect');
  if (vSel) {
    vSel.innerHTML = farmers.map(f => `<option value="${f.id}">${f.nama} — ${f.desa}</option>`).join('');
  }
}

// ---- ADD / EDIT FARMER ----

function openAddFarmerModal() {
  document.getElementById('modalFarmerTitle').textContent = 'Tambah Petani';
  document.getElementById('farmerForm').reset();
  document.getElementById('farmerId').value = '';
  document.getElementById('farmerPhotoData').value = '';
  document.getElementById('farmerPhotoPreviewWrap').style.display = 'none';
  document.getElementById('photoUploadArea').style.display = 'block';
  // Reset inline sections
  document.getElementById('lahanFormList').innerHTML = '';
  document.getElementById('tanamanFormList').innerHTML = '';
  document.getElementById('produksiFormList').innerHTML = '';
  updateRowCounts();
  openModal('modalFarmer');
}

function openEditFarmer(id) {
  const f = farmers.find(x => x.id === id);
  if (!f) return;
  document.getElementById('modalFarmerTitle').textContent = 'Edit Petani';
  document.getElementById('farmerId').value = f.id;
  document.getElementById('fNama').value = f.nama || '';
  document.getElementById('fHp').value = f.hp || '';
  document.getElementById('fJK').value = f.jenisKelamin || 'Laki-laki';
  document.getElementById('fUmur').value = f.umur || '';
  document.getElementById('fKomoditas').value = f.komoditas || '';
  document.getElementById('fDesa').value = f.desa || '';
  document.getElementById('fKecamatan').value = f.kecamatan || '';
  document.getElementById('fKabupaten').value = f.kabupaten || '';
  document.getElementById('fAlamat').value = f.alamat || '';
  document.getElementById('fKelompok').value = f.kelompokTani || '';
  document.getElementById('fLat').value = f.lat || '';
  document.getElementById('fLng').value = f.lng || '';
  document.getElementById('farmerPhotoData').value = f.foto || '';
  if (f.foto) {
    document.getElementById('farmerPhotoPreview').src = f.foto;
    document.getElementById('farmerPhotoPreviewWrap').style.display = 'block';
    document.getElementById('photoUploadArea').style.display = 'none';
  } else {
    document.getElementById('farmerPhotoPreviewWrap').style.display = 'none';
    document.getElementById('photoUploadArea').style.display = 'block';
  }

  // Populate inline lahan rows
  document.getElementById('lahanFormList').innerHTML = '';
  (f.lahan || []).forEach(l => addLahanRow(l));

  // Populate inline tanaman rows
  document.getElementById('tanamanFormList').innerHTML = '';
  (f.tanaman || []).forEach(t => addTanamanRow(t));

  // Populate inline produksi rows
  document.getElementById('produksiFormList').innerHTML = '';
  (f.produksi || []).forEach(p => addProduksiRow(p));

  updateRowCounts();
  openModal('modalFarmer');
}

function previewFarmerPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    document.getElementById('farmerPhotoData').value = data;
    document.getElementById('farmerPhotoPreview').src = data;
    document.getElementById('farmerPhotoPreviewWrap').style.display = 'block';
    document.getElementById('photoUploadArea').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function clearFarmerPhoto() {
  document.getElementById('farmerPhotoData').value = '';
  document.getElementById('farmerPhotoPreview').src = '';
  document.getElementById('farmerPhotoPreviewWrap').style.display = 'none';
  document.getElementById('photoUploadArea').style.display = 'block';
  // Reset kedua input file
  document.getElementById('farmerPhotoCamera').value = '';
  document.getElementById('farmerPhotoGallery').value = '';
}

function saveFarmer(e) {
  e.preventDefault();
  const id = document.getElementById('farmerId').value;
  const isEdit = !!id;

  // Kumpulkan data lahan dari inline rows
  const lahanRows = document.querySelectorAll('#lahanFormList .inline-form-row');
  const lahanData = [];
  lahanRows.forEach((row, i) => {
    const nama = row.querySelector('.lahan-nama')?.value?.trim();
    const luas = parseFloat(row.querySelector('.lahan-luas')?.value) || 0;
    if (nama) {
      lahanData.push({
        id: row.dataset.id || ('L' + Date.now() + i),
        nama,
        luas,
        status: row.querySelector('.lahan-status')?.value || 'Milik Sendiri',
        jenis: row.querySelector('.lahan-jenis')?.value || 'Kebun',
        lat: parseFloat(row.querySelector('.lahan-lat')?.value) || null,
        lng: parseFloat(row.querySelector('.lahan-lng')?.value) || null,
        foto: row.querySelector('input[type="hidden"].lahan-foto')?.value || '',
        catatan: row.querySelector('.lahan-catatan')?.value || ''
      });
    }
  });

  // Kumpulkan data tanaman dari inline rows
  const tanamanRows = document.querySelectorAll('#tanamanFormList .inline-form-row');
  const tanamanData = [];
  tanamanRows.forEach((row, i) => {
    const jenis = row.querySelector('.tanaman-jenis')?.value?.trim();
    if (jenis) {
      tanamanData.push({
        id: row.dataset.id || ('T' + Date.now() + i),
        jenis,
        foto: row.querySelector('input[type="hidden"].tanaman-foto')?.value || '',
        luasTanam: parseFloat(row.querySelector('.tanaman-luas')?.value) || 0,
        umurTanaman: parseInt(row.querySelector('.tanaman-umur')?.value) || 0,
        status: row.querySelector('.tanaman-status')?.value || 'Baik',
        perkiraanPanen: row.querySelector('.tanaman-panen')?.value || '',
        catatan: row.querySelector('.tanaman-catatan')?.value || ''
      });
    }
  });

  // Kumpulkan data produksi dari inline rows
  const produksiRows = document.querySelectorAll('#produksiFormList .inline-form-row');
  const produksiData = [];
  produksiRows.forEach((row, i) => {
    const komoditas = row.querySelector('.prod-komoditas')?.value?.trim();
    const jumlah = parseFloat(row.querySelector('.prod-jumlah')?.value) || 0;
    const harga = parseFloat(row.querySelector('.prod-harga')?.value) || 0;
    if (komoditas) {
      produksiData.push({
        id: row.dataset.id || ('P' + Date.now() + i),
        tahun: parseInt(row.querySelector('.prod-tahun')?.value) || new Date().getFullYear(),
        musim: row.querySelector('.prod-musim')?.value || 'Tanam I',
        komoditas,
        jumlah,
        satuan: row.querySelector('.prod-satuan')?.value || 'Kg',
        harga,
        total: jumlah * harga,
        pembeli: row.querySelector('.prod-pembeli')?.value || '',
        catatan: row.querySelector('.prod-catatan')?.value || ''
      });
    }
  });

  const existing = isEdit ? farmers.find(f => f.id === id) : null;

  const data = {
    id: isEdit ? id : 'F' + Date.now(),
    nama: document.getElementById('fNama').value.trim(),
    hp: document.getElementById('fHp').value.trim(),
    jenisKelamin: document.getElementById('fJK').value,
    umur: parseInt(document.getElementById('fUmur').value) || 0,
    komoditas: document.getElementById('fKomoditas').value,
    desa: document.getElementById('fDesa').value.trim(),
    kecamatan: document.getElementById('fKecamatan').value.trim(),
    kabupaten: document.getElementById('fKabupaten').value.trim(),
    alamat: document.getElementById('fAlamat').value.trim(),
    kelompokTani: document.getElementById('fKelompok').value.trim(),
    lat: parseFloat(document.getElementById('fLat').value) || null,
    lng: parseFloat(document.getElementById('fLng').value) || null,
    foto: document.getElementById('farmerPhotoData').value,
    tanggalInput: isEdit ? existing?.tanggalInput : new Date().toISOString().split('T')[0],
    lahan: lahanData,
    tanaman: tanamanData,
    kunjungan: isEdit ? (existing?.kunjungan || []) : [],
    hama: isEdit ? (existing?.hama || []) : [],
    produksi: produksiData,
  };

  if (isEdit) {
    const idx = farmers.findIndex(f => f.id === id);
    farmers[idx] = data;
  } else {
    farmers.push(data);
  }

  saveToStorage();
  closeModal('modalFarmer');
  refreshAll();
  showToast(isEdit ? 'Data petani berhasil diperbarui' : 'Petani berhasil ditambahkan', 'success');
}

// ============================================================
//  INLINE ROW BUILDERS (Lahan / Tanaman / Produksi dalam form)
// ============================================================

/**
 * Update label jumlah baris di tiap section
 */
function updateRowCounts() {
  const lc = document.querySelectorAll('#lahanFormList .inline-form-row').length;
  const tc = document.querySelectorAll('#tanamanFormList .inline-form-row').length;
  const pc = document.querySelectorAll('#produksiFormList .inline-form-row').length;
  const lel = document.getElementById('lahanFormCount');
  const tel = document.getElementById('tanamanFormCount');
  const pel = document.getElementById('produksiFormCount');
  if (lel) lel.textContent = lc ? `(${lc})` : '';
  if (tel) tel.textContent = tc ? `(${tc})` : '';
  if (pel) pel.textContent = pc ? `(${pc})` : '';
}

/**
 * Tambah baris lahan ke form
 * @param {object} data - data lahan existing (opsional, untuk edit)
 */
function addLahanRow(data = {}) {
  const list = document.getElementById('lahanFormList');
  const idx = list.querySelectorAll('.inline-form-row').length + 1;
  const uid = 'lahan_' + Date.now() + '_' + idx;
  const div = document.createElement('div');
  div.className = 'inline-form-row';
  div.dataset.id = data.id || '';
  div.innerHTML = `
    <div class="row-number">
      🗺️ Lahan #${idx}
      <button type="button" class="btn-remove-row" onclick="removeRow(this)">✕ Hapus</button>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">Nama Lahan <span class="required">*</span></label>
        <input type="text" class="form-control lahan-nama" value="${data.nama||''}" placeholder="contoh: Kebun Kopi Utara" />
      </div>
      <div class="form-group">
        <label class="form-label">Luas (Ha)</label>
        <input type="number" class="form-control lahan-luas" value="${data.luas||''}" step="0.01" placeholder="0.00" />
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">Status Kepemilikan</label>
        <select class="form-control lahan-status">
          ${['Milik Sendiri','Sewa','Garapan','Hibah'].map(s=>`<option ${data.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Jenis Lahan</label>
        <select class="form-control lahan-jenis">
          ${['Sawah','Kebun','Ladang','Pekarangan','Tegalan'].map(s=>`<option ${data.jenis===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">Latitude</label>
        <input type="number" class="form-control lahan-lat" value="${data.lat||''}" step="0.000001" />
      </div>
      <div class="form-group">
        <label class="form-label">Longitude</label>
        <input type="number" class="form-control lahan-lng" value="${data.lng||''}" step="0.000001" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Catatan</label>
      <input type="text" class="form-control lahan-catatan" value="${data.catatan||''}" placeholder="Keterangan tambahan (opsional)" />
    </div>
    <!-- Foto Lahan -->
    <div class="form-group">
      <label class="form-label">Foto Lahan</label>
      <div class="mini-photo-wrap" id="wrap_${uid}">
        <div class="mini-photo-btns">
          <label class="mini-photo-btn">
            <i class="fas fa-camera"></i> Kamera
            <input type="file" accept="image/*" capture="environment" onchange="previewMiniPhoto(this,'${uid}')" />
          </label>
          <label class="mini-photo-btn">
            <i class="fas fa-images"></i> Galeri
            <input type="file" accept="image/*" onchange="previewMiniPhoto(this,'${uid}')" />
          </label>
        </div>
        <div id="prev_${uid}" style="display:none; margin-top:8px; position:relative">
          <img class="lahan-foto mini-photo-preview" src="${data.foto||''}" style="${data.foto?'':'display:none'}" />
          <button type="button" class="mini-photo-clear" onclick="clearMiniPhoto('${uid}','lahan-foto')">✕</button>
        </div>
        <input type="hidden" class="lahan-foto" value="${data.foto||''}" />
      </div>
    </div>
  `;
  list.appendChild(div);
  // Jika ada foto existing, tampilkan preview
  if (data.foto) {
    const prevDiv = div.querySelector(`#prev_${uid}`);
    const img = prevDiv.querySelector('img');
    img.style.display = 'block';
    prevDiv.style.display = 'block';
  }
  updateRowCounts();
}

/**
 * Tambah baris tanaman ke form
 */
function addTanamanRow(data = {}) {
  const list = document.getElementById('tanamanFormList');
  const idx = list.querySelectorAll('.inline-form-row').length + 1;
  const uid = 'tanaman_' + Date.now() + '_' + idx;
  const statusOpts = ['Baik','Perawatan','Terserang Hama','Siap Panen'];
  const div = document.createElement('div');
  div.className = 'inline-form-row';
  div.dataset.id = data.id || '';
  div.innerHTML = `
    <div class="row-number">
      🌱 Tanaman #${idx}
      <button type="button" class="btn-remove-row" onclick="removeRow(this)">✕ Hapus</button>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">Jenis Tanaman <span class="required">*</span></label>
        <input type="text" class="form-control tanaman-jenis" value="${data.jenis||''}" placeholder="contoh: Kopi Arabika" />
      </div>
      <div class="form-group">
        <label class="form-label">Luas Tanam (Ha)</label>
        <input type="number" class="form-control tanaman-luas" value="${data.luasTanam||''}" step="0.01" placeholder="0.00" />
      </div>
    </div>
    <div class="form-row cols-3">
      <div class="form-group">
        <label class="form-label">Umur (Bulan)</label>
        <input type="number" class="form-control tanaman-umur" value="${data.umurTanaman||''}" placeholder="0" />
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-control tanaman-status">
          ${statusOpts.map(s=>`<option ${data.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Perkiraan Panen</label>
        <input type="date" class="form-control tanaman-panen" value="${data.perkiraanPanen||''}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Catatan Kondisi</label>
      <input type="text" class="form-control tanaman-catatan" value="${data.catatan||''}" placeholder="Keterangan tambahan (opsional)" />
    </div>
    <!-- Foto Tanaman -->
    <div class="form-group">
      <label class="form-label">Foto Tanaman</label>
      <div class="mini-photo-wrap" id="wrap_${uid}">
        <div class="mini-photo-btns">
          <label class="mini-photo-btn">
            <i class="fas fa-camera"></i> Kamera
            <input type="file" accept="image/*" capture="environment" onchange="previewMiniPhoto(this,'${uid}')" />
          </label>
          <label class="mini-photo-btn">
            <i class="fas fa-images"></i> Galeri
            <input type="file" accept="image/*" onchange="previewMiniPhoto(this,'${uid}')" />
          </label>
        </div>
        <div id="prev_${uid}" style="display:none; margin-top:8px; position:relative">
          <img class="tanaman-foto mini-photo-preview" src="${data.foto||''}" style="${data.foto?'':'display:none'}" />
          <button type="button" class="mini-photo-clear" onclick="clearMiniPhoto('${uid}','tanaman-foto')">✕</button>
        </div>
        <input type="hidden" class="tanaman-foto" value="${data.foto||''}" />
      </div>
    </div>
  `;
  list.appendChild(div);
  if (data.foto) {
    const prevDiv = div.querySelector(`#prev_${uid}`);
    const img = prevDiv.querySelector('img');
    img.style.display = 'block';
    prevDiv.style.display = 'block';
  }
  updateRowCounts();
}

/**
 * Tambah baris produksi ke form
 */
function addProduksiRow(data = {}) {
  const list = document.getElementById('produksiFormList');
  const idx = list.querySelectorAll('.inline-form-row').length + 1;
  const div = document.createElement('div');
  div.className = 'inline-form-row';
  div.dataset.id = data.id || '';
  div.innerHTML = `
    <div class="row-number">
      📦 Produksi #${idx}
      <button type="button" class="btn-remove-row" onclick="removeRow(this)">✕ Hapus</button>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">Komoditas <span class="required">*</span></label>
        <input type="text" class="form-control prod-komoditas" value="${data.komoditas||''}" placeholder="contoh: Kopi Arabika" />
      </div>
      <div class="form-group">
        <label class="form-label">Tahun</label>
        <input type="number" class="form-control prod-tahun" value="${data.tahun||new Date().getFullYear()}" />
      </div>
    </div>
    <div class="form-row cols-3">
      <div class="form-group">
        <label class="form-label">Musim Tanam</label>
        <select class="form-control prod-musim">
          ${['Tanam I','Tanam II','Tanam III'].map(s=>`<option ${data.musim===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Jumlah</label>
        <input type="number" class="form-control prod-jumlah" value="${data.jumlah||''}" step="0.01" oninput="calcTotalRow(this)" />
      </div>
      <div class="form-group">
        <label class="form-label">Satuan</label>
        <select class="form-control prod-satuan">
          ${['Kg','Ton','Ikat','Karung'].map(s=>`<option ${data.satuan===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">Harga/Satuan (Rp)</label>
        <input type="number" class="form-control prod-harga" value="${data.harga||''}" oninput="calcTotalRow(this)" />
      </div>
      <div class="form-group">
        <label class="form-label">Total Pendapatan (Rp)</label>
        <input type="number" class="form-control prod-total" value="${data.total||''}" readonly style="background:var(--gray-50)" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Pembeli/Pasar</label>
      <input type="text" class="form-control prod-pembeli" value="${data.pembeli||''}" placeholder="contoh: Koperasi Kopi Manggarai" />
    </div>
  `;
  list.appendChild(div);
  updateRowCounts();
}

/**
 * Preview foto di baris lahan/tanaman (mini)
 */
function previewMiniPhoto(input, uid) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    const wrap = document.getElementById('wrap_' + uid);
    const prevDiv = document.getElementById('prev_' + uid);
    const img = prevDiv.querySelector('img');
    // Simpan ke hidden input (ambil yang pertama — img class juga hidden input)
    const hiddenInputs = wrap.querySelectorAll('input[type="hidden"]');
    hiddenInputs.forEach(h => h.value = data);
    img.src = data;
    img.style.display = 'block';
    prevDiv.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

/**
 * Hapus foto di baris lahan/tanaman
 */
function clearMiniPhoto(uid, cls) {
  const wrap = document.getElementById('wrap_' + uid);
  const prevDiv = document.getElementById('prev_' + uid);
  const img = prevDiv.querySelector('img');
  img.src = '';
  img.style.display = 'none';
  prevDiv.style.display = 'none';
  wrap.querySelectorAll('input[type="hidden"]').forEach(h => h.value = '');
  wrap.querySelectorAll('input[type="file"]').forEach(f => f.value = '');
}

/**
 * Hitung total produksi otomatis per baris
 */
function calcTotalRow(input) {
  const row = input.closest('.inline-form-row');
  const jumlah = parseFloat(row.querySelector('.prod-jumlah')?.value) || 0;
  const harga = parseFloat(row.querySelector('.prod-harga')?.value) || 0;
  const totalEl = row.querySelector('.prod-total');
  if (totalEl) totalEl.value = jumlah * harga;
}

/**
 * Hapus satu baris inline
 */
function removeRow(btn) {
  btn.closest('.inline-form-row').remove();
  updateRowCounts();
}

// ============================================================
//  CETAK KARTU PETANI
// ============================================================

/**
 * Buka modal kartu petani dan generate QR code
 */
function cetakKartu(id) {
  const f = farmers.find(x => x.id === id);
  if (!f) return;

  const totalLahan = (f.lahan||[]).reduce((s,l) => s + (parseFloat(l.luas)||0), 0);
  const totalProduksi = (f.produksi||[]).reduce((s,p) => s + (parseFloat(p.total)||0), 0);

  // Tutup modal detail kalau terbuka
  closeModal('modalDetail');

  // Buat atau tampilkan modal kartu
  let modal = document.getElementById('modalKartu');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'modalKartu';
    modal.innerHTML = `
      <div class="modal" style="max-width:420px">
        <div class="modal-header">
          <div class="modal-title">Kartu Petani</div>
          <button class="modal-close" onclick="closeModal('modalKartu')">&times;</button>
        </div>
        <div class="modal-body" style="padding:16px">
          <div id="kartuPreview"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal('modalKartu')">Tutup</button>
          <button class="btn btn-primary" onclick="printKartu()">
            <i class="fas fa-print"></i> Cetak / Simpan
          </button>
        </div>
      </div>
    `;
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
    document.body.appendChild(modal);
  }

  // Warna komoditas
  const kommColors = {
    'Kopi Arabika':'#1b5e20','Kopi Robusta':'#2e7d32','Jagung':'#f57f17',
    'Padi':'#388e3c','Kakao':'#4e342e','Cabai':'#c62828',
    'Cengkeh':'#e64a19','Vanili':'#6a1b9a',
  };
  const warna = kommColors[f.komoditas] || '#2d6a35';

  // HTML kartu
  const kartuHTML = `
    <div id="kartuPetani" style="
      width:340px; margin:0 auto;
      border-radius:16px; overflow:hidden;
      box-shadow:0 4px 20px rgba(0,0,0,.15);
      font-family:'Plus Jakarta Sans',sans-serif;
      background:#fff;
    ">
      <!-- Header kartu -->
      <div style="background:${warna}; padding:14px 18px; display:flex; align-items:center; gap:10px">
        <div style="background:rgba(255,255,255,.2); border-radius:8px; padding:4px 10px">
          <span style="color:#fff; font-size:11px; font-weight:700; letter-spacing:1px">TANIMAP</span>
        </div>
        <span style="color:rgba(255,255,255,.8); font-size:11px; margin-left:auto">Kartu Petani</span>
      </div>

      <!-- Body kartu -->
      <div style="padding:18px; display:flex; gap:14px; align-items:flex-start">
        <!-- Foto -->
        <div style="flex-shrink:0">
          ${f.foto
            ? `<img src="${f.foto}" style="width:80px;height:80px;border-radius:10px;object-fit:cover;border:3px solid ${warna}" />`
            : `<div style="width:80px;height:80px;border-radius:10px;background:${warna}22;border:3px solid ${warna};display:flex;align-items:center;justify-content:center;font-size:36px">👨‍🌾</div>`
          }
        </div>
        <!-- Info -->
        <div style="flex:1;min-width:0">
          <div style="font-size:16px;font-weight:800;color:#1c1c1e;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.nama}</div>
          <div style="font-size:11px;color:#636366;margin-bottom:8px">${f.desa}, ${f.kecamatan}</div>
          <div style="display:inline-block;background:${warna}22;color:${warna};border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700;margin-bottom:8px">${f.komoditas}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
            <div style="background:#f2f2f7;border-radius:6px;padding:6px 8px">
              <div style="font-size:9px;color:#aeaeb2;font-weight:700;text-transform:uppercase">Lahan</div>
              <div style="font-size:13px;font-weight:700;color:#1c1c1e">${totalLahan.toFixed(2)} Ha</div>
            </div>
            <div style="background:#f2f2f7;border-radius:6px;padding:6px 8px">
              <div style="font-size:9px;color:#aeaeb2;font-weight:700;text-transform:uppercase">HP</div>
              <div style="font-size:11px;font-weight:700;color:#1c1c1e">${f.hp || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info baris bawah -->
      <div style="padding:0 18px 14px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px">
        <div style="background:#f2f2f7;border-radius:6px;padding:6px 8px;text-align:center">
          <div style="font-size:9px;color:#aeaeb2;font-weight:700;text-transform:uppercase">Kelompok</div>
          <div style="font-size:10px;font-weight:700;color:#1c1c1e">${f.kelompokTani || '-'}</div>
        </div>
        <div style="background:#f2f2f7;border-radius:6px;padding:6px 8px;text-align:center">
          <div style="font-size:9px;color:#aeaeb2;font-weight:700;text-transform:uppercase">Tgl Input</div>
          <div style="font-size:10px;font-weight:700;color:#1c1c1e">${f.tanggalInput || '-'}</div>
        </div>
        <div style="background:#f2f2f7;border-radius:6px;padding:6px 8px;text-align:center">
          <div style="font-size:9px;color:#aeaeb2;font-weight:700;text-transform:uppercase">Pendapatan</div>
          <div style="font-size:10px;font-weight:700;color:${warna}">Rp ${totalProduksi > 0 ? (totalProduksi/1000000).toFixed(1)+'jt' : '-'}</div>
        </div>
      </div>

      <!-- QR Code + footer -->
      <div style="background:${warna}11; border-top:1px solid ${warna}33; padding:12px 18px; display:flex; align-items:center; gap:12px">
        <div id="qrcode" style="background:#fff;padding:4px;border-radius:6px;flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-size:9px;color:#636366;line-height:1.5">
            ID: <strong>${f.id}</strong><br/>
            ${f.lat && f.lng ? `GPS: ${f.lat.toFixed(4)}, ${f.lng.toFixed(4)}` : 'GPS: Belum diatur'}
          </div>
          <div style="font-size:8px;color:#aeaeb2;margin-top:4px">TaniMap © 2026</div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('kartuPreview').innerHTML = kartuHTML;
  modal.classList.add('open');

  // Generate QR code
  setTimeout(() => {
    const qrEl = document.getElementById('qrcode');
    if (!qrEl) return;
    qrEl.innerHTML = '';
    const qrData = `TANIMAP|${f.id}|${f.nama}|${f.desa}|${f.komoditas}|${f.hp||''}|${f.lat||''}|${f.lng||''}`;
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrEl, {
        text: qrData, width: 64, height: 64,
        colorDark: warna, colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      // Fallback: tampilkan ID saja
      qrEl.innerHTML = `<div style="width:64px;height:64px;background:${warna}22;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${warna};text-align:center;padding:4px">${f.id}</div>`;
    }
  }, 100);
}

/**
 * Cetak kartu petani menggunakan window.print()
 */
function printKartu() {
  const kartu = document.getElementById('kartuPetani');
  if (!kartu) return;

  const printWin = window.open('', '_blank', 'width=500,height=650');
  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Kartu Petani - TaniMap</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#f5f5f5; display:flex; justify-content:center; align-items:flex-start; padding:20px; }
        @media print {
          body { background:#fff; padding:0; }
          .no-print { display:none; }
          @page { size: 90mm 55mm; margin:0; }
        }
        .actions { text-align:center; margin-bottom:16px; }
        .actions button {
          background:#2d6a35; color:#fff; border:none;
          padding:10px 24px; border-radius:8px; font-size:14px;
          font-weight:600; cursor:pointer; margin:0 4px;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .actions button.sec { background:#f2f2f7; color:#3a3a3c; }
      </style>
    </head>
    <body>
      <div>
        <div class="actions no-print">
          <button onclick="window.print()">🖨️ Cetak</button>
          <button class="sec" onclick="window.close()">Tutup</button>
        </div>
        ${kartu.outerHTML}
      </div>
    </body>
    </html>
  `);
  printWin.document.close();
  printWin.focus();
}

// ============================================================
//  UNDUH FOTO
// ============================================================

/**
 * Bersihkan nama untuk filename: spasi → underscore, hapus karakter spesial
 */
function cleanFileName(str) {
  return (str || '').trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
}

/**
 * Unduh foto petani → "Nama_Petani.jpg"
 */
function unduhFoto(farmerId, type) {
  const f = farmers.find(x => x.id === farmerId);
  if (!f || !f.foto) { showToast('Tidak ada foto', 'error'); return; }
  const nama = cleanFileName(f.nama);
  _triggerDownload(f.foto, `${nama}.jpg`);
  showToast(`Foto disimpan: ${nama}.jpg`, 'success');
}

/**
 * Unduh foto lahan → "Nama_Petani_lahan_Nama_Lahan.jpg"
 */
function unduhFotoLahan(farmerNama, lahanNama) {
  const f = farmers.find(x => x.nama === farmerNama);
  const l = (f?.lahan||[]).find(x => x.nama === lahanNama);
  if (!l || !l.foto) { showToast('Tidak ada foto lahan', 'error'); return; }
  const nama = cleanFileName(farmerNama);
  const lahan = cleanFileName(lahanNama);
  const filename = `${nama}_lahan_${lahan}.jpg`;
  _triggerDownload(l.foto, filename);
  showToast(`Foto disimpan: ${filename}`, 'success');
}

/**
 * Unduh foto tanaman → "Nama_Petani_Nama_Tanaman.jpg"
 */
function unduhFotoTanaman(farmerNama, tanamanJenis) {
  const f = farmers.find(x => x.nama === farmerNama);
  const t = (f?.tanaman||[]).find(x => x.jenis === tanamanJenis);
  if (!t || !t.foto) { showToast('Tidak ada foto tanaman', 'error'); return; }
  const nama = cleanFileName(farmerNama);
  const tanaman = cleanFileName(tanamanJenis);
  const filename = `${nama}_${tanaman}.jpg`;
  _triggerDownload(t.foto, filename);
  showToast(`Foto disimpan: ${filename}`, 'success');
}

/**
 * Trigger download dari base64 data URL
 */
function _triggerDownload(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function confirmDeleteFarmer(id) {
  const f = farmers.find(x => x.id === id);
  showConfirm('🗑️', 'Hapus Petani', `Hapus data <strong>${f?.nama}</strong>? Tindakan ini tidak bisa dibatalkan.`, () => {
    farmers = farmers.filter(x => x.id !== id);
    saveToStorage();
    refreshAll();
    showToast('Petani berhasil dihapus', 'success');
  });
}

// ---- GPS ----

function getGPSForForm() {
  if (!navigator.geolocation) { showToast('Geolokasi tidak didukung', 'error'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    document.getElementById('fLat').value = pos.coords.latitude.toFixed(6);
    document.getElementById('fLng').value = pos.coords.longitude.toFixed(6);
    showToast('Koordinat GPS berhasil diambil', 'success');
  }, () => showToast('Gagal mengambil lokasi', 'error'));
}

// ---- DETAIL ----

function openDetail(id) {
  const f = farmers.find(x => x.id === id);
  if (!f) return;

  const totalLahan = (f.lahan || []).reduce((s, l) => s + (parseFloat(l.luas) || 0), 0);
  const namaFile = f.nama.replace(/\s+/g, '_');
  const avatarHtml = f.foto
    ? `<div class="detail-avatar" style="position:relative">
        <img src="${f.foto}" alt="${f.nama}" />
        <button onclick="unduhFoto('${f.id}','petani')" title="Unduh foto" style="
          position:absolute;bottom:4px;right:4px;
          background:rgba(0,0,0,.6);color:#fff;border:none;
          border-radius:50%;width:26px;height:26px;font-size:12px;
          cursor:pointer;display:flex;align-items:center;justify-content:center">
          <i class='fas fa-download'></i>
        </button>
       </div>`
    : `<div class="detail-avatar">👨‍🌾</div>`;

  const html = `
    <div class="detail-header">
      ${avatarHtml}
      <div class="detail-info">
        <div class="detail-name">${f.nama}</div>
        <div class="detail-sub"><i class="fas fa-phone"></i> ${f.hp || '-'} &nbsp;|&nbsp; <i class="fas fa-venus-mars"></i> ${f.jenisKelamin}, ${f.umur} tahun</div>
        <div class="detail-badges">
          ${commodityBadge(f.komoditas)}
          <span class="badge badge-blue"><i class="fas fa-map-marker-alt"></i> ${f.desa}</span>
          <span class="badge badge-gray">${f.kelompokTani || 'Tanpa Kelompok'}</span>
        </div>
        <div class="flex mt-2" style="gap:8px;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="openEditFarmer('${f.id}');closeModal('modalDetail')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDeleteFarmer('${f.id}');closeModal('modalDetail')"><i class="fas fa-trash"></i> Hapus</button>
          <button class="btn btn-primary btn-sm" onclick="cetakKartu('${f.id}')"><i class="fas fa-id-card"></i> Cetak Kartu</button>
          ${f.lat && f.lng ? `<a href="https://www.google.com/maps?q=${f.lat},${f.lng}" target="_blank" class="btn btn-secondary btn-sm"><i class="fas fa-map"></i> Google Maps</a>` : ''}
        </div>
      </div>
    </div>

    <div class="detail-tabs">
      <button class="tab-btn active" onclick="switchTab(this,'tab-info')">📋 Info</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-lahan')">🗺️ Lahan (${(f.lahan||[]).length})</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-tanaman')">🌱 Tanaman (${(f.tanaman||[]).length})</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-kunjungan')">📋 Kunjungan (${(f.kunjungan||[]).length})</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-produksi')">📦 Produksi (${(f.produksi||[]).length})</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-hama')">🐛 Hama (${(f.hama||[]).length})</button>
    </div>

    <!-- Tab: Info Dasar -->
    <div class="tab-panel active" id="tab-info">
      <div class="info-grid">
        <div><div class="info-key">Alamat</div><div class="info-value">${f.alamat || '-'}</div></div>
        <div><div class="info-key">Desa</div><div class="info-value">${f.desa}</div></div>
        <div><div class="info-key">Kecamatan</div><div class="info-value">${f.kecamatan}</div></div>
        <div><div class="info-key">Kabupaten</div><div class="info-value">${f.kabupaten || '-'}</div></div>
        <div><div class="info-key">Total Lahan</div><div class="info-value">${totalLahan.toFixed(2)} Ha</div></div>
        <div><div class="info-key">Tgl Input</div><div class="info-value">${f.tanggalInput || '-'}</div></div>
      </div>
      ${f.lat && f.lng ? `<div class="gps-display"><i class="fas fa-map-pin"></i> GPS: ${f.lat}, ${f.lng}</div>` : ''}
    </div>

    <!-- Tab: Lahan -->
    <div class="tab-panel" id="tab-lahan">
      <div class="flex justify-between items-center mb-2">
        <div class="section-title" style="flex:1">Data Lahan</div>
        <button class="btn btn-primary btn-sm" onclick="openAddLahanModal('${f.id}')"><i class="fas fa-plus"></i> Tambah</button>
      </div>
      ${(f.lahan||[]).length ? (f.lahan||[]).map(l => `
        <div class="land-item">
          <div class="item-header">
            <div class="item-title">${l.nama}</div>
            <div class="flex gap-1">
              <span class="badge badge-green">${l.luas} Ha</span>
              <button class="btn-icon" onclick="deleteLahan('${f.id}','${l.id}')"><i class="fas fa-trash" style="color:var(--red-500);font-size:12px"></i></button>
            </div>
          </div>
          <div class="info-grid" style="grid-template-columns:repeat(3,1fr);gap:6px">
            <div><div class="info-key">Status</div><div class="info-value">${l.status}</div></div>
            <div><div class="info-key">Jenis</div><div class="info-value">${l.jenis}</div></div>
            <div><div class="info-key">Koordinat</div><div class="info-value">${l.lat ? l.lat+', '+l.lng : '-'}</div></div>
          </div>
          ${l.catatan ? `<div class="item-meta">${l.catatan}</div>` : ''}
          ${l.foto ? `
            <div style="margin-top:8px;position:relative;display:inline-block">
              <img src="${l.foto}" style="width:100%;max-height:140px;object-fit:cover;border-radius:8px;border:1px solid var(--gray-200)" />
              <button onclick="unduhFotoLahan('${f.nama}','${l.nama}')" title="Unduh foto lahan" style="
                position:absolute;bottom:6px;right:6px;
                background:rgba(0,0,0,.6);color:#fff;border:none;
                border-radius:6px;padding:4px 8px;font-size:11px;font-weight:600;
                cursor:pointer;display:flex;align-items:center;gap:4px">
                <i class='fas fa-download'></i> Unduh
              </button>
            </div>` : ''}
        </div>
      `).join('') : '<div class="empty-state"><div class="empty-icon">🗺️</div><p>Belum ada data lahan.</p></div>'}
    </div>

    <!-- Tab: Tanaman -->
    <div class="tab-panel" id="tab-tanaman">
      <div class="flex justify-between items-center mb-2">
        <div class="section-title" style="flex:1">Data Tanaman</div>
        <button class="btn btn-primary btn-sm" onclick="openAddTanamanModal('${f.id}')"><i class="fas fa-plus"></i> Tambah</button>
      </div>
      ${(f.tanaman||[]).length ? (f.tanaman||[]).map(t => `
        <div class="crop-item">
          <div class="item-header">
            <div class="item-title">🌿 ${t.jenis}</div>
            <div class="flex gap-1">
              ${cropStatusBadge(t.status)}
              <button class="btn-icon" onclick="deleteTanaman('${f.id}','${t.id}')"><i class="fas fa-trash" style="color:var(--red-500);font-size:12px"></i></button>
            </div>
          </div>
          <div class="info-grid" style="grid-template-columns:repeat(3,1fr);gap:6px">
            <div><div class="info-key">Luas Tanam</div><div class="info-value">${t.luasTanam} Ha</div></div>
            <div><div class="info-key">Umur</div><div class="info-value">${t.umurTanaman} bln</div></div>
            <div><div class="info-key">Perkiraan Panen</div><div class="info-value">${t.perkiraanPanen || '-'}</div></div>
          </div>
          ${t.catatan ? `<div class="item-meta">${t.catatan}</div>` : ''}
          ${t.foto ? `
            <div style="margin-top:8px;position:relative;display:inline-block">
              <img src="${t.foto}" style="width:100%;max-height:140px;object-fit:cover;border-radius:8px;border:1px solid var(--gray-200)" />
              <button onclick="unduhFotoTanaman('${f.nama}','${t.jenis}')" title="Unduh foto tanaman" style="
                position:absolute;bottom:6px;right:6px;
                background:rgba(0,0,0,.6);color:#fff;border:none;
                border-radius:6px;padding:4px 8px;font-size:11px;font-weight:600;
                cursor:pointer;display:flex;align-items:center;gap:4px">
                <i class='fas fa-download'></i> Unduh
              </button>
            </div>` : ''}
        </div>
      `).join('') : '<div class="empty-state"><div class="empty-icon">🌱</div><p>Belum ada data tanaman.</p></div>'}
    </div>

    <!-- Tab: Kunjungan -->
    <div class="tab-panel" id="tab-kunjungan">
      <div class="flex justify-between items-center mb-2">
        <div class="section-title" style="flex:1">Riwayat Kunjungan</div>
        <button class="btn btn-primary btn-sm" onclick="openAddVisitModal('${f.id}')"><i class="fas fa-plus"></i> Tambah</button>
      </div>
      ${(f.kunjungan||[]).length ? [...(f.kunjungan||[])].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal)).map(k => `
        <div class="visit-item">
          <div class="item-header">
            <div class="item-title">📅 ${k.tanggal}</div>
            <div class="flex gap-1">
              <span class="badge badge-blue">${k.kondisi}</span>
              <button class="btn-icon" onclick="deleteKunjungan('${f.id}','${k.id}')"><i class="fas fa-trash" style="color:var(--red-500);font-size:12px"></i></button>
            </div>
          </div>
          <div class="item-meta">👤 <strong>${k.petugas}</strong></div>
          ${k.masalah ? `<div class="item-meta">⚠️ ${k.masalah}</div>` : ''}
          ${k.rekomendasi ? `<div class="item-meta">✅ ${k.rekomendasi}</div>` : ''}
          ${k.catatan ? `<div class="item-meta">${k.catatan}</div>` : ''}
        </div>
      `).join('') : '<div class="empty-state"><div class="empty-icon">📋</div><p>Belum ada kunjungan.</p></div>'}
    </div>

    <!-- Tab: Produksi -->
    <div class="tab-panel" id="tab-produksi">
      <div class="flex justify-between items-center mb-2">
        <div class="section-title" style="flex:1">Riwayat Produksi</div>
        <button class="btn btn-primary btn-sm" onclick="openAddProduksiModal('${f.id}')"><i class="fas fa-plus"></i> Tambah</button>
      </div>
      ${(f.produksi||[]).length ? (f.produksi||[]).map(p => `
        <div class="production-item">
          <div class="item-header">
            <div class="item-title">📦 ${p.komoditas} — ${p.tahun}</div>
            <div class="flex gap-1">
              <span class="badge badge-orange">${p.musim}</span>
              <button class="btn-icon" onclick="deleteProduksi('${f.id}','${p.id}')"><i class="fas fa-trash" style="color:var(--red-500);font-size:12px"></i></button>
            </div>
          </div>
          <div class="info-grid" style="grid-template-columns:repeat(3,1fr);gap:6px">
            <div><div class="info-key">Jumlah</div><div class="info-value">${p.jumlah} ${p.satuan}</div></div>
            <div><div class="info-key">Harga</div><div class="info-value">Rp ${formatNumber(p.harga)}</div></div>
            <div><div class="info-key">Total</div><div class="info-value text-green">Rp ${formatNumber(p.total)}</div></div>
          </div>
          ${p.pembeli ? `<div class="item-meta">🏪 ${p.pembeli}</div>` : ''}
        </div>
      `).join('') : '<div class="empty-state"><div class="empty-icon">📦</div><p>Belum ada data produksi.</p></div>'}
    </div>

    <!-- Tab: Hama -->
    <div class="tab-panel" id="tab-hama">
      <div class="flex justify-between items-center mb-2">
        <div class="section-title" style="flex:1">Hama & Penyakit</div>
        <button class="btn btn-primary btn-sm" onclick="openAddHamaModal('${f.id}')"><i class="fas fa-plus"></i> Tambah</button>
      </div>
      ${(f.hama||[]).length ? (f.hama||[]).map(h => `
        <div class="pest-item">
          <div class="item-header">
            <div class="item-title">🐛 ${h.nama}</div>
            <div class="flex gap-1">
              ${pestLevelBadge(h.tingkat)}
              <button class="btn-icon" onclick="deleteHama('${f.id}','${h.id}')"><i class="fas fa-trash" style="color:var(--red-500);font-size:12px"></i></button>
            </div>
          </div>
          <div class="item-meta">🌿 ${h.tanaman} | Status: <strong>${h.status}</strong></div>
          ${h.solusi ? `<div class="item-meta">💊 ${h.solusi}</div>` : ''}
        </div>
      `).join('') : '<div class="empty-state"><div class="empty-icon">🐛</div><p>Tidak ada hama/penyakit.</p></div>'}
    </div>
  `;

  document.getElementById('modalDetailBody').innerHTML = html;
  openModal('modalDetail');
}

function switchTab(btn, tabId) {
  // Non-aktifkan semua tab button
  btn.closest('.detail-tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Non-aktifkan semua tab panel
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
}

// ============================================================
//  INLINE ADD FORMS (Lahan, Tanaman, Kunjungan, Produksi, Hama)
// ============================================================

function openAddLahanModal(farmerId) {
  closeModal('modalDetail');
  const html = `
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Nama Lahan <span class="required">*</span></label><input type="text" class="form-control" id="inNamaLahan" required /></div>
      <div class="form-group"><label class="form-label">Luas (Ha) <span class="required">*</span></label><input type="number" class="form-control" id="inLuasLahan" step="0.01" required /></div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Status</label><select class="form-control" id="inStatusLahan"><option>Milik Sendiri</option><option>Sewa</option><option>Garapan</option><option>Hibah</option></select></div>
      <div class="form-group"><label class="form-label">Jenis</label><select class="form-control" id="inJenisLahan"><option>Sawah</option><option>Kebun</option><option>Ladang</option><option>Pekarangan</option><option>Tegalan</option></select></div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Latitude</label><input type="number" class="form-control" id="inLatLahan" step="0.000001" /></div>
      <div class="form-group"><label class="form-label">Longitude</label><input type="number" class="form-control" id="inLngLahan" step="0.000001" /></div>
    </div>
    <div class="form-group"><label class="form-label">Catatan</label><textarea class="form-control" id="inCatatanLahan" rows="2"></textarea></div>
  `;
  showInlineModal('Tambah Lahan', html, () => {
    const f = farmers.find(x => x.id === farmerId);
    if (!f) return;
    if (!f.lahan) f.lahan = [];
    f.lahan.push({
      id: 'L'+Date.now(), nama: document.getElementById('inNamaLahan').value,
      luas: parseFloat(document.getElementById('inLuasLahan').value)||0,
      status: document.getElementById('inStatusLahan').value,
      jenis: document.getElementById('inJenisLahan').value,
      lat: parseFloat(document.getElementById('inLatLahan').value)||null,
      lng: parseFloat(document.getElementById('inLngLahan').value)||null,
      foto:'', catatan: document.getElementById('inCatatanLahan').value
    });
    saveToStorage(); refreshAll();
    showToast('Lahan ditambahkan','success');
    openDetail(farmerId);
  });
}

function deleteLahan(farmerId, lahanId) {
  const f = farmers.find(x => x.id === farmerId);
  if (f) { f.lahan = (f.lahan||[]).filter(l => l.id !== lahanId); saveToStorage(); refreshAll(); openDetail(farmerId); }
}

function openAddTanamanModal(farmerId) {
  closeModal('modalDetail');
  const html = `
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Jenis Tanaman <span class="required">*</span></label><input type="text" class="form-control" id="inJenisTanaman" required /></div>
      <div class="form-group"><label class="form-label">Luas Tanam (Ha)</label><input type="number" class="form-control" id="inLuasTanaman" step="0.01" /></div>
    </div>
    <div class="form-row cols-3">
      <div class="form-group"><label class="form-label">Umur (Bulan)</label><input type="number" class="form-control" id="inUmurTanaman" /></div>
      <div class="form-group"><label class="form-label">Status</label><select class="form-control" id="inStatusTanaman"><option>Baik</option><option>Perawatan</option><option>Terserang Hama</option><option>Siap Panen</option></select></div>
      <div class="form-group"><label class="form-label">Perkiraan Panen</label><input type="date" class="form-control" id="inPanenTanaman" /></div>
    </div>
    <div class="form-group"><label class="form-label">Catatan</label><textarea class="form-control" id="inCatatanTanaman" rows="2"></textarea></div>
  `;
  showInlineModal('Tambah Tanaman', html, () => {
    const f = farmers.find(x => x.id === farmerId);
    if (!f) return;
    if (!f.tanaman) f.tanaman = [];
    f.tanaman.push({
      id:'T'+Date.now(), jenis: document.getElementById('inJenisTanaman').value,
      foto:'', luasTanam: parseFloat(document.getElementById('inLuasTanaman').value)||0,
      umurTanaman: parseInt(document.getElementById('inUmurTanaman').value)||0,
      status: document.getElementById('inStatusTanaman').value,
      perkiraanPanen: document.getElementById('inPanenTanaman').value,
      catatan: document.getElementById('inCatatanTanaman').value
    });
    saveToStorage(); refreshAll();
    showToast('Tanaman ditambahkan','success');
    openDetail(farmerId);
  });
}

function deleteTanaman(farmerId, id) {
  const f = farmers.find(x => x.id === farmerId);
  if (f) { f.tanaman = (f.tanaman||[]).filter(t => t.id !== id); saveToStorage(); refreshAll(); openDetail(farmerId); }
}

function openAddProduksiModal(farmerId) {
  closeModal('modalDetail');
  const html = `
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Tahun <span class="required">*</span></label><input type="number" class="form-control" id="inTahunProd" value="${new Date().getFullYear()}" required /></div>
      <div class="form-group"><label class="form-label">Musim Tanam</label><select class="form-control" id="inMusimProd"><option>Tanam I</option><option>Tanam II</option><option>Tanam III</option></select></div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Komoditas <span class="required">*</span></label><input type="text" class="form-control" id="inKomoditasProd" required /></div>
      <div class="form-group"><label class="form-label">Jumlah</label><input type="number" class="form-control" id="inJumlahProd" step="0.01" oninput="calcTotal()" /></div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Satuan</label><select class="form-control" id="inSatuanProd"><option>Kg</option><option>Ton</option><option>Ikat</option><option>Karung</option></select></div>
      <div class="form-group"><label class="form-label">Harga/Satuan (Rp)</label><input type="number" class="form-control" id="inHargaProd" oninput="calcTotal()" /></div>
    </div>
    <div class="form-group"><label class="form-label">Total Pendapatan (Rp)</label><input type="number" class="form-control" id="inTotalProd" readonly style="background:var(--gray-50)" /></div>
    <div class="form-group"><label class="form-label">Pembeli/Pasar</label><input type="text" class="form-control" id="inPembeliProd" /></div>
    <div class="form-group"><label class="form-label">Catatan</label><textarea class="form-control" id="inCatatanProd" rows="2"></textarea></div>
  `;
  showInlineModal('Tambah Produksi', html, () => {
    const f = farmers.find(x => x.id === farmerId);
    if (!f) return;
    if (!f.produksi) f.produksi = [];
    const jumlah = parseFloat(document.getElementById('inJumlahProd').value)||0;
    const harga = parseFloat(document.getElementById('inHargaProd').value)||0;
    f.produksi.push({
      id:'P'+Date.now(), tahun: parseInt(document.getElementById('inTahunProd').value),
      musim: document.getElementById('inMusimProd').value,
      komoditas: document.getElementById('inKomoditasProd').value,
      jumlah, satuan: document.getElementById('inSatuanProd').value,
      harga, total: jumlah * harga,
      pembeli: document.getElementById('inPembeliProd').value,
      catatan: document.getElementById('inCatatanProd').value
    });
    saveToStorage(); refreshAll();
    showToast('Produksi ditambahkan','success');
    openDetail(farmerId);
  });
}

function calcTotal() {
  const j = parseFloat(document.getElementById('inJumlahProd')?.value)||0;
  const h = parseFloat(document.getElementById('inHargaProd')?.value)||0;
  const el = document.getElementById('inTotalProd');
  if (el) el.value = j * h;
}

function deleteProduksi(farmerId, id) {
  const f = farmers.find(x => x.id === farmerId);
  if (f) { f.produksi = (f.produksi||[]).filter(p => p.id !== id); saveToStorage(); refreshAll(); openDetail(farmerId); }
}

function openAddHamaModal(farmerId) {
  closeModal('modalDetail');
  const html = `
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Nama Hama/Penyakit <span class="required">*</span></label><input type="text" class="form-control" id="inNamaHama" required /></div>
      <div class="form-group"><label class="form-label">Tanaman Terdampak</label><input type="text" class="form-control" id="inTanamanHama" /></div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Tingkat Serangan</label><select class="form-control" id="inTingkatHama"><option>Ringan</option><option>Sedang</option><option>Berat</option></select></div>
      <div class="form-group"><label class="form-label">Status Penanganan</label><select class="form-control" id="inStatusHama"><option>Belum Ditangani</option><option>Dalam Penanganan</option><option>Ditangani</option></select></div>
    </div>
    <div class="form-group"><label class="form-label">Solusi/Rekomendasi</label><textarea class="form-control" id="inSolusiHama" rows="2"></textarea></div>
  `;
  showInlineModal('Tambah Hama/Penyakit', html, () => {
    const f = farmers.find(x => x.id === farmerId);
    if (!f) return;
    if (!f.hama) f.hama = [];
    f.hama.push({
      id:'H'+Date.now(), nama: document.getElementById('inNamaHama').value,
      tanaman: document.getElementById('inTanamanHama').value,
      tingkat: document.getElementById('inTingkatHama').value,
      foto:'', solusi: document.getElementById('inSolusiHama').value,
      status: document.getElementById('inStatusHama').value
    });
    saveToStorage(); refreshAll();
    showToast('Data hama ditambahkan','success');
    openDetail(farmerId);
  });
}

function deleteHama(farmerId, id) {
  const f = farmers.find(x => x.id === farmerId);
  if (f) { f.hama = (f.hama||[]).filter(h => h.id !== id); saveToStorage(); refreshAll(); openDetail(farmerId); }
}

// Generic inline modal helper
let inlineModalCallback = null;
function showInlineModal(title, bodyHtml, onSave) {
  inlineModalCallback = onSave;
  // Reuse modalFarmer modal structure
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'inlineModal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="modal-close" onclick="document.getElementById('inlineModal').remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="inlineForm" onsubmit="inlineFormSubmit(event)">${bodyHtml}</form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('inlineModal').remove()">Batal</button>
        <button class="btn btn-primary" onclick="document.getElementById('inlineForm').dispatchEvent(new Event('submit'))"><i class='fas fa-save'></i> Simpan</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}
function inlineFormSubmit(e) {
  e.preventDefault();
  if (inlineModalCallback) inlineModalCallback();
  document.getElementById('inlineModal')?.remove();
}

// ============================================================
//  VISITS PAGE
// ============================================================

function renderVisitsTable() {
  const tbody = document.getElementById('visitsTable');
  const empty = document.getElementById('visitsEmpty');
  const search = (document.getElementById('searchVisit')?.value || '').toLowerCase();

  // Kumpulkan semua kunjungan
  let all = [];
  farmers.forEach(f => (f.kunjungan||[]).forEach(k => all.push({...k, farmerName: f.nama, farmerVillage: f.desa, farmerId: f.id})));
  all.sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
  if (search) all = all.filter(k => k.farmerName.toLowerCase().includes(search) || k.petugas.toLowerCase().includes(search));

  if (!all.length) { tbody.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display='none';
  tbody.innerHTML = all.map(k => `
    <tr>
      <td>${k.tanggal}</td>
      <td><strong>${k.farmerName}</strong></td>
      <td>${k.farmerVillage}</td>
      <td>${k.petugas}</td>
      <td><span class="badge ${k.kondisi==='Baik'?'badge-green':k.kondisi==='Cukup'?'badge-blue':'badge-red'}">${k.kondisi}</span></td>
      <td><button class="btn btn-outline btn-sm" onclick="openDetail('${k.farmerId}')">Detail</button></td>
    </tr>
  `).join('');
}
function filterVisits() { renderVisitsTable(); }

function openAddVisitModal(farmerId) {
  // Set default tanggal hari ini
  document.getElementById('vTanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('visitId').value = '';
  populateFilters(); // refresh select petani
  if (farmerId) {
    document.getElementById('vFarmerSelect').value = farmerId;
    document.getElementById('visitFarmerId').value = farmerId;
  }
  openModal('modalVisit');
}

function saveVisit(e) {
  e.preventDefault();
  const farmerId = document.getElementById('vFarmerSelect').value;
  const f = farmers.find(x => x.id === farmerId);
  if (!f) { showToast('Petani tidak ditemukan','error'); return; }
  if (!f.kunjungan) f.kunjungan = [];
  f.kunjungan.push({
    id:'K'+Date.now(),
    tanggal: document.getElementById('vTanggal').value,
    petugas: document.getElementById('vPetugas').value,
    foto: '',
    kondisi: document.getElementById('vKondisi').value,
    masalah: document.getElementById('vMasalah').value,
    rekomendasi: document.getElementById('vRekomendasi').value,
    lat: parseFloat(document.getElementById('vLat').value)||null,
    lng: parseFloat(document.getElementById('vLng').value)||null,
    catatan: document.getElementById('vCatatan').value
  });
  saveToStorage(); refreshAll();
  closeModal('modalVisit');
  showToast('Kunjungan berhasil dicatat','success');
}

function deleteKunjungan(farmerId, id) {
  const f = farmers.find(x => x.id === farmerId);
  if (f) { f.kunjungan = (f.kunjungan||[]).filter(k => k.id !== id); saveToStorage(); refreshAll(); openDetail(farmerId); }
}

// ============================================================
//  CROPS PAGE
// ============================================================

function renderCropsTable() {
  const tbody = document.getElementById('cropsTable');
  const empty = document.getElementById('cropsEmpty');
  const search = (document.getElementById('searchCrop')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('filterCropStatus')?.value || '';

  let all = [];
  farmers.forEach(f => (f.tanaman||[]).forEach(t => all.push({...t, farmerName: f.nama, farmerVillage: f.desa})));
  if (search) all = all.filter(t => t.jenis.toLowerCase().includes(search) || t.farmerName.toLowerCase().includes(search));
  if (statusFilter) all = all.filter(t => t.status === statusFilter);

  if (!all.length) { tbody.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display='none';
  tbody.innerHTML = all.map(t => `
    <tr>
      <td><strong>${t.jenis}</strong></td>
      <td>${t.farmerName}</td>
      <td>${t.farmerVillage}</td>
      <td>${t.luasTanam} Ha</td>
      <td>${t.umurTanaman} bln</td>
      <td>${cropStatusBadge(t.status)}</td>
      <td>${t.perkiraanPanen || '-'}</td>
    </tr>
  `).join('');
}
function filterCrops() { renderCropsTable(); }

// ============================================================
//  PRODUCTION PAGE
// ============================================================

function renderProductionTable() {
  const tbody = document.getElementById('productionTable');
  const empty = document.getElementById('productionEmpty');
  const search = (document.getElementById('searchProd')?.value || '').toLowerCase();
  const commFilter = document.getElementById('filterProdCommodity')?.value || '';

  let all = [];
  farmers.forEach(f => (f.produksi||[]).forEach(p => all.push({...p, farmerName: f.nama})));
  if (search) all = all.filter(p => p.farmerName.toLowerCase().includes(search) || p.komoditas.toLowerCase().includes(search));
  if (commFilter) all = all.filter(p => p.komoditas === commFilter);
  all.sort((a,b) => b.tahun - a.tahun);

  if (!all.length) { tbody.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display='none';
  tbody.innerHTML = all.map(p => `
    <tr>
      <td>${p.tahun} (${p.musim})</td>
      <td>${p.farmerName}</td>
      <td>${commodityBadge(p.komoditas)}</td>
      <td>${p.jumlah} ${p.satuan}</td>
      <td>Rp ${formatNumber(p.harga)}</td>
      <td class="fw-bold text-green">Rp ${formatNumber(p.total)}</td>
      <td>${p.pembeli || '-'}</td>
    </tr>
  `).join('');
}
function filterProduction() { renderProductionTable(); }

// ============================================================
//  MAP
// ============================================================

/**
 * Warna marker berdasarkan komoditas
 */
function getMarkerColor(komoditas) {
  const map = {
    'Kopi Arabika': '#1b5e20', 'Kopi Robusta': '#2e7d32',
    'Jagung': '#f57f17', 'Padi': '#66bb6a',
    'Kakao': '#6d4c41', 'Cabai': '#e53935',
    'Cengkeh': '#ff7043', 'Vanili': '#8e24aa',
  };
  return map[komoditas] || '#1565c0';
}

function createColoredMarker(color) {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    className: '', iconSize: [14, 14], iconAnchor: [7, 7],
  });
}

function initMap() {
  if (map) return;
  map = L.map('map').setView([-8.6050, 120.4674], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);
}

function renderMapMarkers() {
  if (!map) return;
  // Hapus marker lama
  mapMarkers.forEach(m => map.removeLayer(m));
  mapMarkers = [];

  const search = (document.getElementById('searchMap')?.value || '').toLowerCase();
  const village = document.getElementById('mapFilterVillage')?.value || '';
  const commodity = document.getElementById('mapFilterCommodity')?.value || '';

  farmers.forEach(f => {
    if (!f.lat || !f.lng) return;
    if (search && !f.nama.toLowerCase().includes(search)) return;
    if (village && f.desa !== village) return;
    if (commodity && f.komoditas !== commodity) return;

    const color = getMarkerColor(f.komoditas);
    const icon = createColoredMarker(color);
    const totalLahan = (f.lahan||[]).reduce((s,l)=>s+(parseFloat(l.luas)||0),0);
    const avatarHtml = f.foto ? `<img src="${f.foto}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;display:block;margin:0 auto" />` : `<div style="font-size:32px;text-align:center">👨‍🌾</div>`;

    const marker = L.marker([f.lat, f.lng], { icon })
      .addTo(map)
      .bindPopup(`
        <div class="popup-content">
          ${avatarHtml}
          <div class="popup-farmer-name">${f.nama}</div>
          <div class="popup-info">📍 ${f.desa}, ${f.kecamatan}</div>
          <div class="popup-info">🌾 ${f.komoditas}</div>
          <div class="popup-info">🗺️ ${totalLahan.toFixed(2)} Ha</div>
          <div class="popup-actions">
            <button class="popup-btn popup-btn-primary" onclick="openDetail('${f.id}');map.closePopup()">Detail</button>
            <a href="https://www.google.com/maps?q=${f.lat},${f.lng}" target="_blank" class="popup-btn popup-btn-secondary" style="text-align:center">Maps</a>
          </div>
        </div>
      `, { maxWidth: 240 });

    mapMarkers.push(marker);
  });
}

function filterMapMarkers() { renderMapMarkers(); }

function getMyLocation() {
  if (!navigator.geolocation) { showToast('Geolokasi tidak didukung', 'error'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    if (map) map.setView([pos.coords.latitude, pos.coords.longitude], 14);
    showToast('Peta dipusatkan ke lokasi Anda', 'success');
  }, () => showToast('Gagal mengambil lokasi', 'error'));
}

function resetMap() {
  document.getElementById('searchMap').value = '';
  document.getElementById('mapFilterVillage').value = '';
  document.getElementById('mapFilterCommodity').value = '';
  if (map) map.setView([-8.6050, 120.4674], 11);
  renderMapMarkers();
}

// ============================================================
//  REPORTS
// ============================================================

function renderReports() {
  const el = document.getElementById('reportContent');
  if (!el) return;

  // Rekap per desa
  const byVillage = {};
  farmers.forEach(f => {
    if (!byVillage[f.desa]) byVillage[f.desa] = { count:0, lahan:0 };
    byVillage[f.desa].count++;
    byVillage[f.desa].lahan += (f.lahan||[]).reduce((s,l)=>s+(parseFloat(l.luas)||0),0);
  });

  // Rekap per komoditas
  const byComm = {};
  farmers.forEach(f => {
    if (!byComm[f.komoditas]) byComm[f.komoditas] = { count:0, produksi:0 };
    byComm[f.komoditas].count++;
    byComm[f.komoditas].produksi += (f.produksi||[]).reduce((s,p)=>s+(parseFloat(p.jumlah)||0),0);
  });

  // Hama rekap
  let allHama = [];
  farmers.forEach(f => (f.hama||[]).forEach(h => allHama.push({...h, farmerName:f.nama})));

  el.innerHTML = `
    <div class="report-section">
      <h3 class="card-title mb-2">📍 Rekap Petani per Desa</h3>
      <div class="card">
        <div class="card-body">
          <div class="table-wrap">
            <table class="report-table">
              <thead><tr><th>Desa</th><th>Jumlah Petani</th><th>Total Lahan (Ha)</th></tr></thead>
              <tbody>
                ${Object.entries(byVillage).map(([desa,d]) => `
                  <tr><td>${desa}</td><td>${d.count}</td><td>${d.lahan.toFixed(2)}</td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="report-section">
      <h3 class="card-title mb-2">🌾 Rekap per Komoditas</h3>
      <div class="card">
        <div class="card-body">
          <div class="table-wrap">
            <table class="report-table">
              <thead><tr><th>Komoditas</th><th>Jumlah Petani</th><th>Total Produksi</th></tr></thead>
              <tbody>
                ${Object.entries(byComm).map(([k,d]) => `
                  <tr><td>${commodityBadge(k)}</td><td>${d.count}</td><td>${d.produksi > 0 ? d.produksi.toFixed(2)+' Kg/Ton' : '-'}</td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="report-section">
      <h3 class="card-title mb-2">🐛 Rekap Hama & Penyakit</h3>
      <div class="card">
        <div class="card-body">
          ${allHama.length ? `
          <div class="table-wrap">
            <table class="report-table">
              <thead><tr><th>Petani</th><th>Hama/Penyakit</th><th>Tanaman</th><th>Tingkat</th><th>Status</th></tr></thead>
              <tbody>
                ${allHama.map(h => `
                  <tr>
                    <td>${h.farmerName}</td>
                    <td>${h.nama}</td>
                    <td>${h.tanaman}</td>
                    <td>${pestLevelBadge(h.tingkat)}</td>
                    <td>${h.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>` : '<div class="empty-state"><div class="empty-icon">✅</div><p>Tidak ada laporan hama/penyakit.</p></div>'}
        </div>
      </div>
    </div>
  `;
}

// ============================================================
//  EXPORT / IMPORT
// ============================================================

/**
 * Export ke Excel (.xlsx) — multi sheet:
 * Sheet 1: Data Petani
 * Sheet 2: Data Lahan
 * Sheet 3: Data Tanaman
 * Sheet 4: Kunjungan
 * Sheet 5: Produksi
 * Sheet 6: Hama & Penyakit
 */
function exportExcel() {
  // SheetJS bisa terdaftar sebagai XLSX di window
  const XLSXlib = window.XLSX;
  if (!XLSXlib) {
    showToast('Library Excel belum termuat. Coba refresh halaman.', 'error');
    return;
  }

  const wb = XLSXlib.utils.book_new();
  const tgl = new Date().toLocaleDateString('id-ID');

  // ---- Sheet 1: Data Petani ----
  const petaniData = [
    ['ID','Nama','HP','Jenis Kelamin','Umur','Desa','Kecamatan','Kabupaten','Alamat','Kelompok Tani','Komoditas','Total Lahan (Ha)','Latitude','Longitude','Tgl Input']
  ];
  farmers.forEach(f => {
    petaniData.push([
      f.id, f.nama, f.hp, f.jenisKelamin, f.umur,
      f.desa, f.kecamatan, f.kabupaten, f.alamat, f.kelompokTani, f.komoditas,
      (f.lahan||[]).reduce((s,l)=>s+(parseFloat(l.luas)||0),0).toFixed(2),
      f.lat, f.lng, f.tanggalInput
    ]);
  });
  const wsPetani = XLSXlib.utils.aoa_to_sheet(petaniData);
  // Lebar kolom
  wsPetani['!cols'] = [6,20,14,12,6,14,14,12,24,18,14,10,10,10,12].map(w=>({wch:w}));
  XLSXlib.utils.book_append_sheet(wb, wsPetani, 'Data Petani');

  // ---- Sheet 2: Data Lahan ----
  const lahanData = [['ID Lahan','Nama Petani','Nama Lahan','Luas (Ha)','Status','Jenis','Latitude','Longitude','Catatan']];
  farmers.forEach(f => (f.lahan||[]).forEach(l => {
    lahanData.push([l.id, f.nama, l.nama, l.luas, l.status, l.jenis, l.lat, l.lng, l.catatan]);
  }));
  const wsLahan = XLSXlib.utils.aoa_to_sheet(lahanData);
  wsLahan['!cols'] = [10,20,18,8,14,12,10,10,24].map(w=>({wch:w}));
  XLSXlib.utils.book_append_sheet(wb, wsLahan, 'Data Lahan');

  // ---- Sheet 3: Data Tanaman ----
  const tanamanData = [['ID','Nama Petani','Desa','Jenis Tanaman','Luas Tanam (Ha)','Umur (Bln)','Status','Perkiraan Panen','Catatan']];
  farmers.forEach(f => (f.tanaman||[]).forEach(t => {
    tanamanData.push([t.id, f.nama, f.desa, t.jenis, t.luasTanam, t.umurTanaman, t.status, t.perkiraanPanen, t.catatan]);
  }));
  const wsTanaman = XLSXlib.utils.aoa_to_sheet(tanamanData);
  wsTanaman['!cols'] = [10,20,14,16,12,10,14,14,24].map(w=>({wch:w}));
  XLSXlib.utils.book_append_sheet(wb, wsTanaman, 'Data Tanaman');

  // ---- Sheet 4: Kunjungan ----
  const kunjunganData = [['ID','Nama Petani','Desa','Tanggal','Petugas','Kondisi','Masalah','Rekomendasi','Catatan']];
  farmers.forEach(f => (f.kunjungan||[]).forEach(k => {
    kunjunganData.push([k.id, f.nama, f.desa, k.tanggal, k.petugas, k.kondisi, k.masalah, k.rekomendasi, k.catatan]);
  }));
  const wsKunjungan = XLSXlib.utils.aoa_to_sheet(kunjunganData);
  wsKunjungan['!cols'] = [10,20,14,12,16,10,24,24,24].map(w=>({wch:w}));
  XLSXlib.utils.book_append_sheet(wb, wsKunjungan, 'Kunjungan');

  // ---- Sheet 5: Produksi ----
  const produksiData = [['ID','Nama Petani','Desa','Tahun','Musim','Komoditas','Jumlah','Satuan','Harga/Satuan (Rp)','Total (Rp)','Pembeli','Catatan']];
  farmers.forEach(f => (f.produksi||[]).forEach(p => {
    produksiData.push([p.id, f.nama, f.desa, p.tahun, p.musim, p.komoditas, p.jumlah, p.satuan, p.harga, p.total, p.pembeli, p.catatan]);
  }));
  const wsProduksi = XLSXlib.utils.aoa_to_sheet(produksiData);
  wsProduksi['!cols'] = [10,20,14,8,10,14,8,8,14,16,18,20].map(w=>({wch:w}));
  XLSXlib.utils.book_append_sheet(wb, wsProduksi, 'Produksi');

  // ---- Sheet 6: Hama & Penyakit ----
  const hamaData = [['ID','Nama Petani','Desa','Nama Hama/Penyakit','Tanaman','Tingkat','Solusi','Status']];
  farmers.forEach(f => (f.hama||[]).forEach(h => {
    hamaData.push([h.id, f.nama, f.desa, h.nama, h.tanaman, h.tingkat, h.solusi, h.status]);
  }));
  const wsHama = XLSXlib.utils.aoa_to_sheet(hamaData);
  wsHama['!cols'] = [10,20,14,20,14,10,28,16].map(w=>({wch:w}));
  XLSXlib.utils.book_append_sheet(wb, wsHama, 'Hama & Penyakit');

  // Simpan file
  XLSXlib.writeFile(wb, `TaniMap_Laporan_${tgl.replace(/\//g,'-')}.xlsx`);
  showToast('Excel berhasil diexport (6 sheet)', 'success');
}

/**
 * Export ke PDF — berisi semua rekap laporan
 */
function exportPDF() {
  const jsPDFLib = window.jspdf?.jsPDF || window.jsPDF;
  if (!jsPDFLib) {
    showToast('Library PDF belum termuat. Coba refresh halaman.', 'error');
    return;
  }

  const doc = new jsPDFLib({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const tgl = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 0;

  // ---- Helper judul section (tanpa emoji) ----
  function sectionTitle(title) {
    if (y > 250) { doc.addPage(); y = 16; }
    doc.setFillColor(232, 245, 233);
    doc.rect(10, y - 4, pageW - 20, 8, 'F');
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 106, 53);
    doc.text(title, 13, y + 1);
    doc.setTextColor(0, 0, 0);
    y += 10;
  }

  // ---- Header ----
  doc.setFillColor(45, 106, 53);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18); doc.setFont('helvetica', 'bold');
  doc.text('TANIMAP', 14, 13);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Sistem Informasi Pendataan, Pemetaan, dan Monitoring Petani', 14, 20);
  doc.text('Dicetak: ' + tgl, 14, 26);

  const totalLahan = farmers.reduce((s,f) => s + (f.lahan||[]).reduce((a,l) => a + (parseFloat(l.luas)||0), 0), 0);
  const totalProd  = farmers.reduce((s,f) => s + (f.produksi||[]).reduce((a,p) => a + (parseFloat(p.total)||0), 0), 0);
  doc.text('Total Petani: ' + farmers.length, pageW - 55, 13);
  doc.text('Total Lahan: ' + totalLahan.toFixed(2) + ' Ha', pageW - 55, 20);
  doc.text('Total Pendapatan: Rp ' + formatNumber(totalProd), pageW - 55, 26);
  doc.setTextColor(0, 0, 0);
  y = 38;

  // ---- 1. Rekap Petani per Desa ----
  sectionTitle('REKAP PETANI PER DESA');
  const byVillage = {};
  farmers.forEach(f => {
    if (!byVillage[f.desa]) byVillage[f.desa] = { count: 0, lahan: 0, komoditas: new Set() };
    byVillage[f.desa].count++;
    byVillage[f.desa].lahan += (f.lahan||[]).reduce((s,l) => s + (parseFloat(l.luas)||0), 0);
    byVillage[f.desa].komoditas.add(f.komoditas);
  });
  doc.autoTable({
    startY: y,
    head: [['No','Desa','Jumlah Petani','Total Lahan (Ha)','Komoditas']],
    body: Object.entries(byVillage).map(([desa,d], i) => [
      i+1, desa, d.count, d.lahan.toFixed(2), [...d.komoditas].join(', ')
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [45,106,53], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245,250,245] },
    margin: { left: 10, right: 10 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // ---- 2. Rekap per Komoditas ----
  sectionTitle('REKAP PER KOMODITAS');
  const byComm = {};
  farmers.forEach(f => {
    if (!byComm[f.komoditas]) byComm[f.komoditas] = { count: 0, produksi: 0, pendapatan: 0 };
    byComm[f.komoditas].count++;
    byComm[f.komoditas].produksi  += (f.produksi||[]).reduce((s,p) => s + (parseFloat(p.jumlah)||0), 0);
    byComm[f.komoditas].pendapatan += (f.produksi||[]).reduce((s,p) => s + (parseFloat(p.total)||0), 0);
  });
  doc.autoTable({
    startY: y,
    head: [['No','Komoditas','Jumlah Petani','Total Produksi','Total Pendapatan (Rp)']],
    body: Object.entries(byComm).map(([k,d], i) => [
      i+1, k, d.count,
      d.produksi > 0 ? d.produksi.toFixed(2) : '-',
      d.pendapatan > 0 ? formatNumber(d.pendapatan) : '-'
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [45,106,53], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245,250,245] },
    margin: { left: 10, right: 10 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // ---- 3. Rekap Produksi ----
  const allProduksi = [];
  farmers.forEach(f => (f.produksi||[]).forEach(p => allProduksi.push({...p, farmerName: f.nama, desa: f.desa})));
  if (allProduksi.length) {
    sectionTitle('REKAP PRODUKSI');
    doc.autoTable({
      startY: y,
      head: [['Petani','Desa','Tahun','Komoditas','Jumlah','Satuan','Total (Rp)','Pembeli']],
      body: allProduksi.map(p => [p.farmerName, p.desa, p.tahun, p.komoditas, p.jumlah, p.satuan, formatNumber(p.total), p.pembeli||'-']),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [45,106,53], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245,250,245] },
      margin: { left: 10, right: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // ---- 4. Rekap Hama & Penyakit ----
  const allHama = [];
  farmers.forEach(f => (f.hama||[]).forEach(h => allHama.push({...h, farmerName: f.nama, desa: f.desa})));
  if (allHama.length) {
    sectionTitle('REKAP HAMA DAN PENYAKIT');
    doc.autoTable({
      startY: y,
      head: [['Petani','Desa','Hama/Penyakit','Tanaman','Tingkat','Status']],
      body: allHama.map(h => [h.farmerName, h.desa, h.nama, h.tanaman, h.tingkat, h.status]),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [45,106,53], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [255,245,245] },
      margin: { left: 10, right: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // ---- 5. Daftar Lengkap Petani ----
  sectionTitle('DAFTAR LENGKAP PETANI');
  doc.autoTable({
    startY: y,
    head: [['No','Nama','HP','Desa','Kecamatan','Komoditas','Lahan (Ha)','Tgl Input']],
    body: farmers.map((f,i) => [
      i+1, f.nama, f.hp||'-', f.desa, f.kecamatan, f.komoditas,
      (f.lahan||[]).reduce((s,l) => s + (parseFloat(l.luas)||0), 0).toFixed(2),
      f.tanggalInput||'-'
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [45,106,53], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245,250,245] },
    margin: { left: 10, right: 10 },
  });

  // ---- Footer tiap halaman ----
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text('TaniMap - Sistem Informasi Petani | Halaman ' + i + ' dari ' + pageCount, pageW / 2, 292, { align: 'center' });
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 289, pageW - 10, 289);
  }

  const namaFile = 'TaniMap_Laporan_' + new Date().toLocaleDateString('id-ID').replace(/\//g, '-') + '.pdf';
  doc.save(namaFile);
  showToast('PDF berhasil diexport', 'success');
}

function downloadFile(filename, mime, content) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function confirmReset() {
  showConfirm('🗑️', 'Reset Data', 'Hapus SEMUA data petani dari aplikasi? Tindakan ini tidak bisa dibatalkan!', () => {
    farmers = [];
    saveToStorage(); refreshAll();
    showToast('Semua data berhasil dihapus', 'success');
  });
}

// ============================================================
//  MODAL HELPERS
// ============================================================

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ============================================================
//  CONFIRM DIALOG
// ============================================================

function showConfirm(icon, title, msg, onOk) {
  document.getElementById('confirmIcon').textContent = icon;
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').innerHTML = msg;
  document.getElementById('confirmOkBtn').onclick = () => { closeConfirm(); onOk(); };
  document.getElementById('confirm-overlay').classList.add('open');
}
function closeConfirm() { document.getElementById('confirm-overlay').classList.remove('open'); }

// ============================================================
//  TOAST
// ============================================================

function showToast(msg, type='info') {
  const container = document.getElementById('toast-container');
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ============================================================
//  BADGE HELPERS
// ============================================================

function commodityBadge(k) {
  const map = {
    'Kopi Arabika': 'badge-green','Kopi Robusta': 'badge-green',
    'Jagung': 'badge-yellow','Padi': 'badge-green',
    'Kakao': 'badge-brown','Cabai': 'badge-red',
    'Cengkeh': 'badge-orange','Vanili': 'badge-blue',
  };
  return `<span class="badge ${map[k]||'badge-gray'}">${k}</span>`;
}

function cropStatusBadge(status) {
  const map = {
    'Baik': 'badge-green', 'Perawatan': 'badge-orange',
    'Terserang Hama': 'badge-red', 'Siap Panen': 'badge-yellow',
  };
  return `<span class="badge ${map[status]||'badge-gray'}">${status}</span>`;
}

function pestLevelBadge(level) {
  const map = { 'Ringan':'badge-yellow','Sedang':'badge-orange','Berat':'badge-red' };
  return `<span class="badge ${map[level]||'badge-gray'}">${level}</span>`;
}

// ============================================================
//  NUMBER FORMAT
// ============================================================

function formatNumber(n) {
  if (!n && n !== 0) return '0';
  return Number(n).toLocaleString('id-ID');
}

// ============================================================
//  FALLBACK DATA (jika fetch gagal / offline)
// ============================================================

function getFallbackData() {
  return [
    { id:'F001', nama:'Yohanes Beo', hp:'081234567890', jenisKelamin:'Laki-laki', umur:45,
      desa:'Golo Loni', kecamatan:'Ruteng', kabupaten:'Manggarai',
      alamat:'Jl. Raya Golo Loni No. 12', kelompokTani:'Tani Maju',
      komoditas:'Kopi Arabika', lat:-8.6102, lng:120.4674, tanggalInput:'2024-01-15',
      foto:'', lahan:[{id:'L001',nama:'Kebun Kopi Utara',luas:2.5,status:'Milik Sendiri',jenis:'Kebun',lat:-8.6100,lng:120.4670,foto:'',catatan:''}],
      tanaman:[{id:'T001',jenis:'Kopi Arabika',foto:'',luasTanam:2.5,umurTanaman:3,status:'Baik',perkiraanPanen:'2024-06-01',catatan:''}],
      kunjungan:[], hama:[], produksi:[{id:'P001',tahun:2023,musim:'Tanam I',komoditas:'Kopi Arabika',jumlah:800,satuan:'Kg',harga:45000,total:36000000,pembeli:'Koperasi',catatan:''}]
    },
    { id:'F002', nama:'Maria Nona', hp:'082345678901', jenisKelamin:'Perempuan', umur:38,
      desa:'Wae Laba', kecamatan:"Wae Ri'i", kabupaten:'Manggarai',
      alamat:'Kampung Wae Laba RT 03', kelompokTani:'Wanita Tani Sejahtera',
      komoditas:'Jagung', lat:-8.5980, lng:120.4820, tanggalInput:'2024-01-20',
      foto:'', lahan:[{id:'L002',nama:'Sawah Wae Laba',luas:1.2,status:'Milik Sendiri',jenis:'Sawah',lat:-8.5985,lng:120.4825,foto:'',catatan:''}],
      tanaman:[{id:'T002',jenis:'Jagung',foto:'',luasTanam:1.2,umurTanaman:2,status:'Siap Panen',perkiraanPanen:'2024-04-15',catatan:''}],
      kunjungan:[], hama:[], produksi:[]
    },
    { id:'F003', nama:'Petrus Moa', hp:'083456789012', jenisKelamin:'Laki-laki', umur:52,
      desa:'Compang', kecamatan:'Ruteng', kabupaten:'Manggarai',
      alamat:'Dusun Compang Timur', kelompokTani:'Tani Bersatu',
      komoditas:'Padi', lat:-8.6250, lng:120.4550, tanggalInput:'2024-02-01',
      foto:'', lahan:[{id:'L003',nama:'Sawah Compang',luas:0.75,status:'Sewa',jenis:'Sawah',lat:-8.6255,lng:120.4555,foto:'',catatan:''}],
      tanaman:[], kunjungan:[], hama:[], produksi:[]
    },
  ];
}
