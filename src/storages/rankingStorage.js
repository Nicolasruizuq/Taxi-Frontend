import { defineStore } from "pinia";

export const useRankingStore = defineStore("ranking", {
  state: () => ({
    user_id: sessionStorage.getItem("user_id") || null,
    rankings: [], // Renombrado para mayor claridad
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * 🔹 Carga el ranking de los 10 pasajeros con más puntos
     */
    async LoadPassengerRankings() {
      this.loading = true;
      this.error = null;

      try {
        console.log("📡 Solicitando ranking de pasajeros...");

        const response = await fetch(`http://localhost:4000/api/rankingsByPassengers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.error = errorText || "Error al obtener el ranking de pasajeros.";
          console.error("❌ Error al obtener ranking:", this.error);
          return [];
        }

        const result = await response.json();
        console.log("📦 Datos de ranking recibidos:", result);

        // 🧩 Normaliza el resultado si el backend devuelve { data: [...] } o un array directo
        this.rankings = Array.isArray(result?.data) ? result.data : result;

        console.log("✅ Ranking de pasajeros cargado:", this.rankings);
        return this.rankings;

      } catch (err) {
        console.error("❌ Error al cargar ranking:", err);
        this.error = "Ocurrió un error inesperado al cargar el ranking.";
        return [];
      } finally {
        this.loading = false;
      }
    },


    /**
     * 🔹 Carga ranking de conductores
     */
    async LoadDriversRankings() {
      this.loading = true;
      this.error = null;

      try {
        console.log("📡 Solicitando ranking de conductores...");

        const response = await fetch(`http://localhost:4000/api/rankingsByDrivers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.error = errorText || "Error al obtener el ranking de conductores.";
          console.error("❌ Error al obtener ranking:", this.error);
          return [];
        }

        const result = await response.json();
        console.log("📦 Datos de ranking recibidos:", result);

        // 🧩 Normaliza el resultado si el backend devuelve { data: [...] } o un array directo
        this.rankings = Array.isArray(result?.data) ? result.data : result;

        console.log("✅ Ranking de conductores cargado:", this.rankings);
        return this.rankings;

      } catch (err) {
        console.error("❌ Error al cargar ranking:", err);
        this.error = "Ocurrió un error inesperado al cargar el ranking.";
        return [];
      } finally {
        this.loading = false;
      }
    },
  },
});
