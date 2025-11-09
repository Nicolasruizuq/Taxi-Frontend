import { defineStore } from "pinia";

export const useHistoryStore = defineStore("history", {
  state: () => ({
    user_id: sessionStorage.getItem("user_id") || null,
    travels: [],
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * 🔹 Carga historial de viajes del pasajero
     */
    async loadTravelHistoryByPassenger() {
      this.loading = true;
      this.error = null;

      try {
        if (!this.user_id) {
          this.error = "No se encontró el ID del usuario en la sesión.";
          return;
        }

        const response = await fetch(
          `http://localhost:4000/api/solicitudesByPassenger/${this.user_id}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          const errorText = await response.text();
          this.error = errorText || "Error al obtener el historial de viajes.";
          console.error("Error al obtener historial:", this.error);
          return;
        }

        const result = await response.json();
        console.log("Historial de viajes (pasajero):", result);
        this.travels = Array.isArray(result?.data) ? result.data : [];
      } catch (err) {
        console.error("Error al cargar historial:", err);
        this.error = "Ocurrió un error inesperado al cargar el historial.";
      } finally {
        this.loading = false;
      }
    },

    /**
     * 🔹 Carga historial de viajes del conductor
     */
    async loadHistoryByDriver() {
      this.loading = true;
      this.error = null;

      try {
        if (!this.user_id) {
          this.error = "No se encontró el ID del conductor en la sesión.";
          return;
        }

        const response = await fetch(
          `http://localhost:4000/api/solicitudesByDriver/${this.user_id}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          const errorText = await response.text();
          this.error = errorText || "Error al obtener el historial del conductor.";
          console.error("Error al obtener historial del conductor:", this.error);
          return;
        }

        const result = await response.json();
        console.log("Historial de viajes (conductor):", result);
        this.travels = Array.isArray(result?.data) ? result.data : [];
      } catch (err) {
        console.error("Error al cargar historial del conductor:", err);
        this.error = "Ocurrió un error inesperado al cargar el historial.";
      } finally {
        this.loading = false;
      }
    },
  },
});
