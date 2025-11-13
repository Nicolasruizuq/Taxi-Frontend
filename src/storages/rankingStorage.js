import { defineStore } from "pinia";
import { useTravelRequestStore } from "@/storages/travelRequestStorage"; // ajusta la ruta



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


    /**
     * 🔹 Carga ranking de conductores
     */
    async updatePointsOnTripComplete(travelData) {
  try {
    const travelStore = useTravelRequestStore();

    // Obtener passenger_id almacenado en el store (de acceptSolicitude)
    const passengerId = travelStore.passenger_id;
    if (!passengerId) throw new Error("❌ No se encontró passenger_id almacenado.");

    // Obtener driver_id desde travelData (el que envías en el objeto)
    const driverId = travelData.driver_id || Number(this.user_id);
    if (!driverId) throw new Error("❌ No se encontró driver_id.");

    // Construir el payload con passenger_id desde store, y resto desde travelData
    const payload = {
      date_trip: travelData.date_trip || new Date().toISOString(),
      passenger_id: passengerId,
      passenger_points: travelData.passenger_points || 10,
      driver_id: driverId,
      driver_points: travelData.driver_points || 15,
      origin: travelData.origin || "Desconocido",
      destination: travelData.destination || "Desconocido",
      status: "Completado",
    };

    console.log("📡 Enviando datos para completar viaje:", payload);

    const response = await fetch("http://localhost:4000/api/ranking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al registrar puntos del viaje.");
    }

    const result = await response.json();
    console.log("✅ Puntos registrados correctamente:", result);
    return result;

  } catch (err) {
    console.error("❌ Error en updatePointsOnTripComplete:", err);
    this.error = err.message;
    throw err;
  }
},

  async updatePointsOnTripCancel(travelData) {
  try {
    const travelStore = useTravelRequestStore();

    // Obtener passenger_id almacenado en el store
    const passengerId = travelStore.passenger_id;
    if (!passengerId) throw new Error("❌ No se encontró passenger_id almacenado.");

    // Obtener driver_id desde travelData o fallback a user_id de sesión
    const driverId = travelData.driver_id || Number(this.user_id);
    if (!driverId) throw new Error("❌ No se encontró driver_id.");

    // Construir payload con datos de viaje recibidos
    const payload = {
      date_trip: travelData.date_trip || new Date().toISOString(),
      passenger_id: passengerId,
      passenger_points: travelData.passenger_points || 5,   // puntos para pasajero en cancelación
      driver_id: driverId,
      driver_points: travelData.driver_points || -20,       // puntos para conductor en cancelación
      origin: travelData.origin || "Desconocido",
      destination: travelData.destination || "Desconocido",
      status: "Cancelado",
    };

    console.log("📡 Enviando datos para cancelar viaje:", payload);

    const response = await fetch("http://localhost:4000/api/ranking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al registrar puntos del viaje cancelado.");
    }

    const result = await response.json();
    console.log("✅ Puntos registrados correctamente para viaje cancelado:", result);
    return result;

  } catch (err) {
    console.error("❌ Error en updatePointsOnTripCancel:", err);
    this.error = err.message;
    throw err;
  }
}
  },
});
