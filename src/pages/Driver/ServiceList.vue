<template>
  <div class="service-list">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Solicitudes de Servicio</h4>
        <p class="category">Solicitudes pendientes</p>
      </md-card-header>

      <md-card-content>
        <!-- Lista de servicios -->
        <md-table v-model="servicios" class="service-table">
          <md-table-row
            v-for="item in servicios"
            :key="item.travel_id"
            class="service-row"
          >
            <md-table-cell md-label="Usuario">
              <div class="user-info">
                <span class="user-name">{{ item.passenger || item.usuario }}</span>
              </div>
            </md-table-cell>

            <md-table-cell md-label="Origen">
              <div class="location-info">
                <md-icon>place</md-icon>
                <span>{{ item.origin || item.origen }}</span>
              </div>
            </md-table-cell>

            <md-table-cell md-label="Destino">
              <div class="location-info">
                <md-icon>flag</md-icon>
                <span>{{ item.destination || item.destino }}</span>
              </div>
            </md-table-cell>

            <md-table-cell md-label="Acciones">
              <div class="action-buttons">
                <md-button
                  class="md-raised md-success"
                  @click="aceptarServicio(item)"
                >
                  <md-icon>check</md-icon> Aceptar
                </md-button>
                <md-button
                  class="md-raised md-danger"
                  @click="rechazarServicio(item)"
                >
                  <md-icon>close</md-icon> Rechazar
                </md-button>
              </div>
            </md-table-cell>
          </md-table-row>
        </md-table>

        <!-- Estado vacío -->
        <div v-if="servicios.length === 0" class="empty-state">
          <md-icon class="empty-icon">assignment</md-icon>
          <h3>No hay solicitudes pendientes</h3>
          <p>Las nuevas solicitudes aparecerán aquí</p>
        </div>
      </md-card-content>
    </md-card>

    <!-- Snackbar -->
    <md-snackbar
      :md-active.sync="showSnackbar"
      :md-duration="4000"
      md-position="center"
    >
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Cerrar</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import { useTravelRequestStore } from "../../storages/travelRequestStorage";

export default {
  name: "service-list",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      servicios: [],
      showSnackbar: false,
      snackbarMessage: "",
    };
  },
  async mounted() {
    this.travelRequestStore = useTravelRequestStore(); // 🔹 Inicializa el store

    try {
      // 🔹 Solo conductor: carga solicitudes pendientes
      this.servicios = await this.travelRequestStore.getSolicitudesByStatus("Pendiente");
      console.log("📦 Solicitudes pendientes cargadas:", this.servicios);
    } catch (error) {
      console.error("❌ Error al cargar solicitudes:", error);
      this.snackbarMessage = "No se pudieron cargar las solicitudes.";
      this.showSnackbar = true;
    }
  },
  methods: {
    async aceptarServicio(servicio) {
      try {
        await this.travelRequestStore.acceptSolicitude(servicio.travel_id);

        // Actualiza la lista local
        this.servicios = this.servicios.filter(
          s => s.travel_id !== servicio.travel_id
        );

        this.snackbarMessage = `Servicio de ${servicio.passenger} aceptado`;
        this.showSnackbar = true;

        this.$emit("servicio-aceptado", servicio);
      } catch (error) {
        console.error("❌ Error al aceptar el servicio:", error);
        this.snackbarMessage = "No se pudo aceptar el servicio.";
        this.showSnackbar = true;
      }
    },

    async rechazarServicio(servicio) {
  try {
    await this.travelRequestStore.rejectSolicitude(servicio.travel_id);

    // 🔹 Actualiza lista local
    this.servicios = this.servicios.filter(
      s => s.travel_id !== servicio.travel_id
    );

    this.snackbarMessage = `Servicio de ${servicio.passenger} rechazado`;
    this.showSnackbar = true;

    // 🔹 Emite evento al padre
    this.$emit("servicio-rechazado", servicio);

  } catch (error) {
    console.error("❌ Error al rechazar el servicio:", error);
    this.snackbarMessage = "No se pudo rechazar el servicio.";
    this.showSnackbar = true;
  }
    },
  },
};
</script>

<style scoped>
.service-list {
  padding: 20px;
}

.service-table {
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-info md-icon {
  color: #999;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px !important;
  margin-bottom: 16px;
}

.service-row:hover {
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

@media (max-width: 768px) {
  .service-list {
    padding: 10px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
