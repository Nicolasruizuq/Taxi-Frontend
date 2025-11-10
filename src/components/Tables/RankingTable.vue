<template>
  <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID">{{ item.passenger_id }}</md-table-cell>
        <md-table-cell md-label="Usuario">{{ item.username }}</md-table-cell>
        <md-table-cell md-label="Puntos">{{ item.total_passenger_points }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { useRankingStore } from "../../storages/rankingStorage"; // ajusta la ruta si tu store está en otra carpeta
import { onMounted, ref } from "vue";

export default {
  name: "ranking-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  setup() {
    const rankingStore = useRankingStore();
    const users = ref([]);

    onMounted(async () => {
      await rankingStore.LoadPassengerRankings();

      // 🔹 Carga los datos desde el store (ya normalizados)
      users.value = rankingStore.rankings || [];
    });

    return {
      users,
    };
  },
};
</script>
