import { defineStore } from "pinia";

export const useTravelRequestStore = defineStore("travel_request", {
  state: () => ({
    user_id: sessionStorage.getItem("user_id") || null,
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Envía una solicitud de viaje al backend
     * @param {Object} formData - Datos de origen y destino (desde el formulario)
     */
    async create_travel_request(formData) {
      this.loading = true;
      this.error = null;

      try {          
        // ✅ Hacemos la petición POST
        const response = await fetch("http://localhost:4000/api/solicitude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.error = errorText || "Error en la creación de la solicitud";
          console.error("Error en la creación de la solicitud:", this.error);
          return null;
        }

        // ✅ Procesar respuesta
        const result = await response.json();
        console.log("Respuesta del backend (clientprincipal):", result);

        const solicitudeData = result?.data?.[0]?.attributes || null;

        if (solicitudeData?.id) {
          // Actualizar estado en Pinia
          this.origin_location = solicitudeData.origin_location;
          this.destination_location = solicitudeData.destination_location;

          return solicitudeData;
        } else {
          this.error = "La respuesta del servidor no contiene datos válidos.";
          console.warn(this.error);
          return null;
        }
      } catch (err) {
        console.error("Error en la creación de la solicitud:", err);
        this.error = "Ocurrió un error inesperado durante la creación de la solicitud.";
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
