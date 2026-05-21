const { createApp, ref, computed } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify();

const app = createApp({
  setup() {
    const drawer = ref(false);

    const upbjjList = ref(["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"]);
    const pengirimanList = ref([
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" }
    ]);
    const paketList = ref([
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
    ]);

    const trackingData = ref({
      "DO2025-001": {
        noDO: "DO2025-001",
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "REG",
        tanggalKirim: "2025-08-25",
        paketKode: "PAKET-UT-001",
        total: 120000,
        upbjj: "Jakarta"
      }
    });


    const trackingList = computed(() => {
      return Object.values(trackingData.value);
    });

    // Form Data
    const formData = ref({
      nim: '',
      nama: '',
      upbjj: null,
      ekspedisi: null,
      paketKode: null,
      tanggalKirim: new Date().toISOString().substr(0, 10)
    });


    const currentYear = new Date().getFullYear();
    // generator nomor DO otomatis berdasarkan tahun dan urutan
    const generateDO = computed(() => {
      const keys = Object.keys(trackingData.value);
      const prefix = `DO${currentYear}-`;
      let maxSeq = 0;

      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          const seqStr = key.substring(prefix.length);
          const seq = parseInt(seqStr, 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      });

      const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
      return `${prefix}${nextSeq}`;
    });


    const selectedPaketInfo = computed(() => {
      if (!formData.value.paketKode) return null;
      return paketList.value.find(p => p.kode === formData.value.paketKode);
    });

    const totalHarga = computed(() => {
      return selectedPaketInfo.value ? selectedPaketInfo.value.harga : 0;
    });

    const formIsInvalid = ref(false);
    // handler tombol submit DO
    const submitDO = () => {
      // Validasi form
      if (!formData.value.nim || !formData.value.nama || !formData.value.upbjj || !formData.value.ekspedisi || !formData.value.paketKode || !formData.value.tanggalKirim) {
        formIsInvalid.value = true;
        return;
      }

      const newDO = generateDO.value;

      trackingData.value[newDO] = {
        noDO: newDO,
        nim: formData.value.nim,
        nama: formData.value.nama,
        status: "Dibuat",
        ekspedisi: formData.value.ekspedisi,
        tanggalKirim: formData.value.tanggalKirim,
        paketKode: formData.value.paketKode,
        total: totalHarga.value,
        upbjj: formData.value.upbjj
      };

      alert(`Delivery Order ${newDO} berhasil dibuat!`);

      // Reset form
      formData.value = {
        nim: '',
        nama: '',
        upbjj: null,
        ekspedisi: null,
        paketKode: null,
        tanggalKirim: new Date().toISOString().substr(0, 10)
      };
    };

    return {
      drawer,
      upbjjList,
      pengirimanList,
      paketList,
      trackingList,
      formData,
      generateDO,
      selectedPaketInfo,
      totalHarga,
      formIsInvalid,
      submitDO
    };
  }
});

app.use(vuetify).mount('#app');
