<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue">
            <h4 class="title">Historial de viajes</h4>
            <p class="category">¿No recuerdas algo de tu viaje?</p>
          </md-card-header>

          <md-card-content>
            <simple-table :table-header-color="'blue'"></simple-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { SimpleTable } from "@/components";

export default {
  name: "TableList",
  components: {
    SimpleTable,
  },
  data() {
    return {
      viajes: [],
      usuarioId: null,
      roleId: null,
    };
  },
  methods: {
    /**
     * Carga el historial de viajes según el rol:
     * - role_id = 1 → pasajero
     * - role_id = 2 → conductor
     */
    async loadTravelHistoryByPassenger() {
      try {
        console.log("🚀 Iniciando carga automática del historial...");

        // 🔹 Obtener valores directamente del sessionStorage
        this.usuarioId = sessionStorage.getItem("user_id");
        this.roleId = sessionStorage.getItem("role_id");

        if (!this.usuarioId || !this.roleId) {
          console.warn("⚠️ No se encontró user_id o role_id en la sesión.");
          return;
        }

        // 🔹 Seleccionar el endpoint correcto según el rol
        let url = "";
        if (this.roleId === "1") {
          url = `http://localhost:4000/api/solicitudesByPassenger/${encodeURIComponent(this.usuarioId)}`;
          console.log("🧍 Rol pasajero detectado → cargando viajes como pasajero...");
        } else if (this.roleId === "2") {
          url = `http://localhost:4000/api/solicitudesByDriver/${encodeURIComponent(this.usuarioId)}`;
          console.log("🚗 Rol conductor detectado → cargando viajes como conductor...");
        } else {
          console.warn(`⚠️ Rol desconocido (${this.roleId}), no se puede determinar el endpoint.`);
          return;
        }

        // 🔹 Petición al backend
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const text = await response.text().catch(() => null);
          throw new Error(`Error HTTP ${response.status} ${text ? "- " + text : ""}`);
        }

        const result = await response.json();
        console.log("📦 Respuesta cruda del backend:", result);

        // 🔹 Normalizar la respuesta
        const payload = Array.isArray(result)
          ? result
          : (result && result.data) || [];

        this.viajes = payload;

        console.log("✅ Historial normalizado:", this.viajes);

        // 🔹 Emitir al hijo (SimpleTable)
        this.$root.$emit("viajes-cargados", this.viajes);
      } catch (error) {
        console.error("❌ Error en loadTravelHistoryByPassenger:", error);
      }
    },
  },

  mounted() {
    // Llamada automática al cargar la vista
    this.loadTravelHistoryByPassenger();
  },
};
</script>
