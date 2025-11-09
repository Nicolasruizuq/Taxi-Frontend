<template>
  <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Fecha">{{ formatDate(item.created_at) }}</md-table-cell>
        <md-table-cell md-label="Cliente">{{ item.passenger }}</md-table-cell>
        <md-table-cell md-label="Conductor">{{ item.driver }}</md-table-cell>
        <md-table-cell md-label="Origen">{{ item.origin }}</md-table-cell>
        <md-table-cell md-label="Destino">{{ item.destination }}</md-table-cell>
        <md-table-cell md-label="Estado">{{ item.status }}</md-table-cell>
      </md-table-row>
    </md-table>

    <div v-if="!users.length" class="text-center mt-3">
      <p>No se encontraron viajes registrados.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "simple-table",

  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      users: [],
    };
  },

  methods: {
    /**
     * 📥 Recibe los viajes emitidos por el componente padre
     * y normaliza los datos antes de mostrarlos.
     */
    updateTable(viajes) {
      console.log("📥 Hijo: Recibiendo viajes desde el padre:", viajes);

      if (!Array.isArray(viajes)) {
        console.warn("⚠️ Datos de viajes inválidos, se esperaba un array.");
        this.users = [];
        return;
      }

      this.users = viajes.map((v) => ({
        travel_id: v.travel_id ?? "—",
        passenger: v.passenger ?? "—",
        driver: v.driver ?? "—",
        origin: v.origin ?? "—",
        destination: v.destination ?? "—",
        status: v.status ?? "—",
        created_at: v.created_at ?? null,
      }));

      console.log("✅ Tabla actualizada:", this.users);
    },

    /**
     * 📅 Formatea la fecha de creación al formato local.
     */
    formatDate(dateStr) {
      if (!dateStr) return "—";
      const date = new Date(dateStr);
      return date.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },

  mounted() {
    // 🟢 Escucha el evento global emitido por el padre
    this.$root.$on("viajes-cargados", this.updateTable);
  },

  beforeDestroy() {
    // 🔴 Limpia el listener al destruirse
    this.$root.$off("viajes-cargados", this.updateTable);
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.mt-3 {
  margin-top: 1rem;
}
</style>
