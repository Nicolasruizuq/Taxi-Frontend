import { defineStore } from "pinia";

export const useTravelRequestStore = defineStore("travel_request", {
  state: () => ({
    user_id: sessionStorage.getItem("user_id") || null,
    travels: [], // 🧳 Solicitudes filtradas (por estado)
    loading: false,
    error: null,
    passenger_id: sessionStorage.getItem("user_id") || null,
  }),

  actions: {
    /**
     * 🔹 Envía una solicitud de viaje al backend
     * @param {Object} formData - Datos del formulario (origen y destino)
     */
    async create_travel_request(formData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch("http://localhost:4000/api/solicitude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.error = errorText || "Error en la creación de la solicitud";
          console.error("❌ Error en la creación de la solicitud:", this.error);
          return null;
        }

        const result = await response.json();
        console.log("✅ Respuesta del backend (clientprincipal):", result);

        const solicitudeData = result?.data?.[0]?.attributes || null;

        if (solicitudeData?.id) {
          this.origin_location = solicitudeData.origin_location;
          this.destination_location = solicitudeData.destination_location;
          return solicitudeData;
        } else {
          this.error = "La respuesta del servidor no contiene datos válidos.";
          console.warn(this.error);
          return null;
        }
      } catch (err) {
        console.error("❌ Error en la creación de la solicitud:", err);
        this.error =
          "Ocurrió un error inesperado durante la creación de la solicitud.";
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 🔹 Obtiene todas las solicitudes filtradas por estado (solo para el driver)
     * @param {string} status - Estado de las solicitudes a consultar
     */
    async getSolicitudesByStatus(status = "Pendiente") {
      this.loading = true;
      this.error = null;

      try {
        // 🔹 Lista de estados válidos según tu backend
        const validStatuses = ["Pendiente", "Aceptado", "Completado", "Cancelado"];

        // 🔹 Normalizamos la primera letra en mayúscula y el resto en minúscula
        status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        if (!validStatuses.includes(status)) {
          this.error = `Estado inválido: ${status}`;
          console.error("❌ Error: estado inválido");
          return [];
        }

        // 🔹 Construimos la URL correctamente
        const url = `http://localhost:4000/api/solicitudesByStatus/${status}`;
        console.log(`📡 Consultando solicitudes con estado: ${status}`);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.error = errorText || "Error al obtener las solicitudes por estado.";
          console.error("❌ Error al obtener solicitudes:", this.error);
          return [];
        }

        const result = await response.json();
        console.log("📦 Solicitudes por estado recibidas:", result);

        // 🧩 Normalizamos la respuesta
        this.travels = Array.isArray(result?.data) ? result.data : result;

        console.log("✅ Solicitudes normalizadas:", this.travels);
        return this.travels;

      } catch (err) {
        console.error("❌ Error al cargar solicitudes por estado:", err);
        this.error =
          "Ocurrió un error inesperado al cargar las solicitudes.";
        return [];
      } finally {
        this.loading = false;
      }
        },
  
  async acceptSolicitude(travelId) {
  try {
    const response = await fetch(
      `http://localhost:4000/api/solicitudeDataById/${travelId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_id: this.user_id,
          status: "Aceptado"
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al aceptar la solicitud");
    }

    const result = await response.json();
    console.log("Solicitud aceptada en el store:", result);

    // GUARDAR datos importantes en el store para usar luego
    this.currentTravel = result.data.attributes;
    this.passenger_id = result.data.attributes.passenger_id;

    // 🔹 Guardamos también los nombres de origen y destino
    this.origin_name = result.data.attributes.origin_name || "";
    this.destination_name = result.data.attributes.destination_name || "";

    return result; // Devuelve la respuesta para quien llamó
  } catch (error) {
    console.error("Error en acceptSolicitude:", error);
    throw error;
  }
},

  async rejectSolicitude(travelId) {
  try {
    const response = await fetch(
      `http://localhost:4000/api/solicitudeDataById/${travelId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_id: this.user_id,
          status: "Cancelado", // 🔹 status válido
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al rechazar la solicitud");
    }

    const result = await response.json();
    console.log("Solicitud rechazada en el store:", result);

    // 🚫 IMPORTANTE: Elimina cualquier línea con `.filter()`
    // No toques this.servicios ni this.travels aquí
    // El componente que llama se encarga de actualizar la vista

    return result;
  } catch (error) {
    console.error("Error en rejectSolicitude:", error);
    throw error;
  }
},

  async updateSolicitudeStatus(travelId) {
  try {
    const response = await fetch(
      `http://localhost:4000/api/solicitudeDataById/${travelId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_id: this.user_id,
          status: "Completado", // 🔹 status válido
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al completar la solicitud");
    }

    const result = await response.json();
    console.log("Solicitud completada en el store:", result);

    // 🚫 IMPORTANTE: Elimina cualquier línea con `.filter()`
    // No toques this.servicios ni this.travels aquí
    // El componente que llama se encarga de actualizar la vista

    return result;
  } catch (error) {
    console.error("Error en completar solicitud:", error);
    throw error;
  }
},


  },
});
