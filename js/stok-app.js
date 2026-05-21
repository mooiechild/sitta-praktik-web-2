const { createApp, ref, computed, watch } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify();

const app = createApp({
  setup() {
    const drawer = ref(false);

    // Original Data
    const upbjjList = ref(["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"]);
    const kategoriList = ref(["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"]);

    const getKategoriColor = (kategori) => {
      const colors = {
        "MK Wajib": "primary",
        "MK Pilihan": "info",
        "Praktikum": "success",
        "Problem-Based": "warning"
      };
      return colors[kategori] || "grey";
    };

    const stok = ref([
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
      }
    ]);

    // Fungsi untuk menentukan status stok berdasarkan qty dan safety stock
    const getStatusInfo = (qty, safety) => {
      if (qty === 0) {
        return { text: 'Kosong', color: 'error', icon: 'mdi-alert-circle' };
      } else if (qty < safety) {
        return { text: 'Menipis', color: 'warning', icon: 'mdi-alert' };
      } else {
        return { text: 'Aman', color: 'success', icon: 'mdi-check-circle' };
      }
    };


    // Filters
    const filterUpbjj = ref(null);
    const filterKategori = ref(null);
    const filterReorder = ref(false);

    // Sort
    const sortBy = ref(null); // 'judul', 'qty', 'harga'
    const sortDesc = ref(false);

    const sortOptions = ref([
      { title: 'Judul (A-Z)', value: 'judul-asc' },
      { title: 'Judul (Z-A)', value: 'judul-desc' },
      { title: 'Stok Terendah', value: 'qty-asc' },
      { title: 'Stok Tertinggi', value: 'qty-desc' },
      { title: 'Harga Termurah', value: 'harga-asc' },
      { title: 'Harga Termahal', value: 'harga-desc' }
    ]);

    const sortSelection = ref(null);

    // Fungsi Computed untuk menhasilkan data untuk tablel yg sudah difilter dan disortir
    const filteredStok = computed(() => {
      let result = stok.value;

      if (filterUpbjj.value) {
        result = result.filter(item => item.upbjj === filterUpbjj.value);
      }

      if (filterUpbjj.value && filterKategori.value) {
        result = result.filter(item => item.kategori === filterKategori.value);
      }

      if (filterReorder.value) {
        result = result.filter(item => item.qty < item.safety || item.qty === 0);
      }

      if (sortSelection.value) {
        const [key, order] = sortSelection.value.split('-');
        result = [...result].sort((a, b) => {
          let valA = a[key];
          let valB = b[key];

          if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
          }

          if (valA < valB) return order === 'asc' ? -1 : 1;
          if (valA > valB) return order === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return result;
    });

    const alertStokMenipis = ref(false);
    const alertStokKosong = ref(false);
    // Watcher untuk memantau jika ada stok yang menipis
    watch(stok, (newVal) => {
      alertStokMenipis.value = newVal.some(item => item.qty < item.safety && item.qty > 0);
    }, { deep: true });

    watch(stok, (newVal) => {
      alertStokKosong.value = newVal.some(item => item.qty === 0);
    }, { deep: true });

    // Fungsi untuk mereset semua filter dan sort ke default
    const resetFilters = () => {
      filterUpbjj.value = null;
      filterKategori.value = null;
      filterReorder.value = false;
      sortSelection.value = null;
    };

    // Dialog & Form State
    const dialog = ref(false);
    const isEdit = ref(false);
    const editIndex = ref(-1);
    const formIsInvalid = ref(false);

    const formData = ref({
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ''
    });

    const openAddDialog = () => {
      isEdit.value = false;
      formData.value = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
      };
      dialog.value = true;
    };

    const openEditDialog = (item) => {
      isEdit.value = true;
      editIndex.value = stok.value.findIndex(s => s.kode === item.kode);
      formData.value = { ...item };
      dialog.value = true;
    };

    const saveForm = () => {
      // Simple validation
      if (!formData.value.kode || !formData.value.judul) {
        formIsInvalid.value = true;
        return;
      }

      if (isEdit.value && editIndex.value !== -1) {
        stok.value[editIndex.value] = { ...formData.value };
      } else {
        stok.value.push({ ...formData.value });
      }
      dialog.value = false;
    };

    return {
      drawer,
      filterUpbjj,
      filterKategori,
      filterReorder,
      sortOptions,
      sortSelection,
      filteredStok,
      resetFilters,
      dialog,
      isEdit,
      formData,
      formIsInvalid,
      openAddDialog,
      openEditDialog,
      saveForm,
      upbjjList,
      kategoriList,
      stok,
      getKategoriColor,
      getStatusInfo,
      alertStokMenipis,
      alertStokKosong
    };
  }
});

app.use(vuetify).mount('#app');
