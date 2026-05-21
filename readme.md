# Penjelasan Kode SITTA

Dokumen ini menjelaskan kode Vue dan JavaScript yang digunakan pada tiga halaman HTML di aplikasi SITTA.

## 1. index.html

Halaman `index.html` adalah beranda aplikasi.

- Menggunakan Vue 3 dan Vuetify 3 melalui CDN.
- `createApp` dari Vue dipakai untuk membuat aplikasi.
- `ref(false)` membuat state reaktif `drawer` untuk membuka/menutup drawer navigasi.
- `v-app-bar`, `v-navigation-drawer`, dan `v-card` adalah komponen Vuetify yang membentuk tampilan.
- Tombol `v-app-bar-nav-icon` mengubah `drawer` dengan `@click.stop="drawer = !drawer"`.
- Menu navigasi di drawer menautkan ke halaman `index.html`, `stok.html`, dan `tracking.html`.

Hanya ada satu state reaktif:
- `drawer`: boolean yang mengontrol apakah sidebar navigasi terbuka.

Setelah `app.use(vuetify).mount('#app')`, Vue mengikat elemen `#app` ke data di `setup()`.

## 2. stok.html

Halaman `stok.html` menampilkan daftar stok bahan ajar dan formulir untuk menambah/edit data.

### Struktur tampilan
- `v-app-bar` dengan tombol kembali ke beranda.
- `v-navigation-drawer` untuk navigasi internal.
- `v-card` utama berisi tabel stok, filter, dan tombol `Tambah Stok`.
- Filter di bagian atas menggunakan `v-select`, `v-checkbox`, dan tombol reset.
- Tabel menggunakan `v-for="item in filteredStok"` untuk merender setiap baris stok.
- Dialog (`v-dialog`) menampilkan form tambah/edit stok.

### Interaksi data
- `js/stok-app.js` berisi semua logika Vue untuk halaman ini.
- Data utama:
  - `upbjjList`: daftar UT-Daerah.
  - `kategoriList`: daftar kategori mata kuliah.
  - `stok`: array objek stok dengan properti seperti `kode`, `judul`, `kategori`, `upbjj`, `lokasiRak`, `harga`, `qty`, `safety`, dan `catatanHTML`.

### Fungsi penting
- `getKategoriColor(kategori)`: mengembalikan warna chip berdasarkan kategori.
- `getStatusInfo(qty, safety)`: menentukan status stok:
  - `Kosong` jika `qty === 0`
  - `Menipis` jika `qty < safety`
  - `Aman` jika stok cukup.

### Filter dan sorting
- `filterUpbjj`, `filterKategori`, `filterReorder`, `sortSelection` adalah refs untuk kontrol filter.
- `filteredStok` adalah computed yang:
  - memfilter data berdasarkan UPBJJ,
  - memfilter kategori hanya jika UPBJJ sudah dipilih,
  - memfilter kondisi reorder bila diaktifkan,
  - mengurutkan data sesuai pilihan (`judul`, `qty`, `harga`).
- `resetFilters()` mengembalikan semua filter ke kondisi awal.

### Dialog dan form
- `dialog`: membuka/tutup dialog tambah/edit.
- `isEdit`: menentukan apakah mode edit atau tambah baru.
- `editIndex`: posisi item yang diedit di array `stok`.
- `formData`: object reaktif yang menyimpan nilai form.

### Aksi
- `openAddDialog()`: menyiapkan form kosong untuk menambah stok baru.
- `openEditDialog(item)`: mengisi form dengan data item yang dipilih dan mengaktifkan mode edit.
- `saveForm()`: menyimpan data baru atau memperbarui data lama.
  - Jika `isEdit` aktif, item yang sesuai di array `stok` diganti.
  - Jika menambah baru, data didorong ke array `stok`.
  - Validasi sederhana memastikan `kode` dan `judul` tidak kosong.

## 3. tracking.html

Halaman `tracking.html` adalah halaman pembuatan dan tampilan Delivery Order (DO).

### Struktur tampilan
- Bagian kiri berisi form pembuatan DO.
- Bagian kanan menampilkan tabel daftar DO yang sudah dibuat.
- Form menggunakan `v-text-field` dan `v-select` untuk input.
- `v-alert` menampilkan detail paket yang dipilih.
- `v-btn` submit memicu fungsi `submitDO()`.

### Logika di `js/tracking-app.js`
- `upbjjList`: daftar lokasi UT-Daerah.
- `pengirimanList`: daftar opsi ekspedisi.
- `paketList`: daftar paket bahan ajar dengan `kode`, `nama`, `isi`, dan `harga`.
- `trackingData`: object yang menyimpan data DO berdasar nomor DO.

### Computed dan data
- `trackingList`: computed yang mengubah `trackingData` menjadi array untuk dirender pada tabel.
- `formData`: object reaktif berisi data input DO.
- `generateDO`: computed yang membuat nomor DO otomatis berdasarkan tahun saat ini dan nomor terakhir di `trackingData`.
  - Format: `DO{tahun}-{nomor urut 3 digit}`.
- `selectedPaketInfo`: computed yang mengambil informasi paket terpilih.
- `totalHarga`: computed yang menampilkan harga paket saat ini.

### Submit DO
- `submitDO()` melakukan validasi sederhana pada semua field wajib.
- Jika valid, data DO baru ditambahkan ke `trackingData` dengan status `Dibuat`.
- Form kemudian direset dan nomor DO baru dihasilkan otomatis pada render berikutnya.

## Catatan Umum
- Semua halaman memanfaatkan Vue 3 Composition API (`createApp`, `ref`, `computed`).
- Vuetify digunakan untuk menyediakan komponen UI Material Design.
- `index.html` menggunakan skrip inline sederhana.
- `stok.html` dan `tracking.html` memisahkan logika JavaScript ke berkas `js/stok-app.js` dan `js/tracking-app.js`.
