<template>
  <div>
    <md-table v-model="drivers" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID">{{ item.driver_id }}</md-table-cell>
        <md-table-cell md-label="Usuario">{{ item.username }}</md-table-cell>
        <md-table-cell md-label="Puntos">{{ item.total_driver_points }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { useRankingStore } from "../../storages/rankingStorage"; // ajusta la ruta si tu store está en otra carpeta
import { onMounted, ref } from "vue";

export default {
  name: "ordered-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  setup() {
    const rankingStore = useRankingStore();
    const drivers = ref([]);

    onMounted(async () => {
      await rankingStore.LoadDriversRankings();

      // 🔹 Carga los datos desde el store (ya normalizados)
      drivers.value = rankingStore.rankings || [];
    });

    return {
      drivers,
    };
  },
};
</script>
