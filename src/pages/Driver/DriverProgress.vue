<template>
  <div class="driver-progress-container">
    <md-card>
      <md-card-header :data-background-color="headerColor">
        <h4 class="title">Estado del Servicio</h4>
        <p class="category" v-if="estadoServicio === 'esperando'">Esperando servicio</p>
        <p class="category" v-else-if="estadoServicio === 'en_progreso'">Servicio en progreso</p>
        <p class="category" v-else-if="estadoServicio === 'completado'">Servicio finalizado</p>
      </md-card-header>

      <md-card-content>
        <div class="service-info">
          <!-- Rutas -->
          <div v-if="estadoServicio !== 'esperando'" class="route-display">
            <div class="location">
              <md-icon class="location-icon start">place</md-icon>
              <span class="location-text">{{ origen }}</span>
            </div>
            <div class="location">
              <md-icon class="location-icon end">flag</md-icon>
              <span class="location-text">{{ destino }}</span>
            </div>
          </div>

          <!-- Estados -->
          <div class="service-states">
            <div class="state-item" :class="{ active: estadoServicio !== 'esperando' }">
              <div class="state-marker">
                <md-icon v-if="estadoServicio !== 'esperando'">check</md-icon>
                <span v-else>1</span>
              </div>
              <span class="state-label">Esperando Servicio</span>
            </div>

            <div class="state-item" :class="{ active: ['en_progreso', 'completado'].includes(estadoServicio) }">
              <div class="state-marker">
                <md-icon v-if="['en_progreso', 'completado'].includes(estadoServicio)">check</md-icon>
                <span v-else>2</span>
              </div>
              <span class="state-label">Servicio en Progreso</span>
            </div>

            <div class="state-item" :class="{ active: estadoServicio === 'completado' }">
              <div class="state-marker">
                <md-icon v-if="estadoServicio === 'completado'">check</md-icon>
                <span v-else>3</span>
              </div>
              <span class="state-label">Servicio Finalizado</span>
            </div>
          </div>

          <!-- Progreso -->
          <div v-if="estadoServicio === 'en_progreso'" class="progress-section">
            <div class="progress-header">
              <span>Progreso del viaje</span>
              <span>{{ progresoViaje }}%</span>
            </div>
            <md-progress-bar 
              md-mode="determinate" 
              :md-value="progresoViaje"
              class="md-accent main-progress"
            ></md-progress-bar>
            <div class="progress-stats">
              <span>Tiempo transcurrido: {{ tiempoTranscurrido }}</span>
            </div>
          </div>

          <!-- Botón cancelar -->
          <div class="driver-controls" v-if="estadoServicio === 'en_progreso'">
            <md-button 
              class="md-danger md-raised" 
              @click="cancelarServicio"
            >
              <md-icon>cancel</md-icon>
              Cancelar Servicio
            </md-button>
          </div>

          <!-- Estado esperando -->
          <div v-if="estadoServicio === 'esperando'" class="waiting-service">
            <md-icon class="waiting-icon">directions_car</md-icon>
            <h4>Esperando servicio</h4>
            <p>Los servicios disponibles aparecerán en la lista</p>
          </div>

          <!-- Estado completado -->
          <div v-if="estadoServicio === 'completado'" class="completed-service">
            <md-icon class="completed-icon">check_circle</md-icon>
            <h4>¡Servicio Completado!</h4>
            <p>El viaje ha finalizado exitosamente</p>
            <p class="tarifa-final">Tarifa final: ${{ tarifaCalculada }}</p>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { useTravelRequestStore } from "@/storages/travelRequestStorage";
import { useRankingStore } from "@/storages/rankingStorage";
import { API_URL } from "../../constants/api";


export default {
  name: "DriverProgress",
  props: {
    servicioSeleccionado: { type: Object, default: null },
    estadoServicioExterno: { type: String, default: "esperando" },
    headerColor: { type: String, default: "blue" }
  },
  data() {
    return {
      estadoServicio: "esperando",
      progresoViaje: 0,
      intervaloTiempo: null,
      tiempoInicioServicio: null,
      tiempoTranscurrido: "0:00",
      tarifaCalculada: "0",
      intervaloProgreso: null,
      travelStore: null,
      rankingStore: null,
      origen: "",
      destino: "",
      travelId: null,
      error: null
    };
  },
  watch: {
    estadoServicioExterno(nuevo) {
      this.estadoServicio = nuevo;
      this.manejarCambioEstado(nuevo);
    },
    servicioSeleccionado: {
      deep: true,
      handler(servicio) {
        if (servicio && servicio.travel_id) {
          this.origen = servicio.origin || "";
          this.destino = servicio.destination || "";
          this.travelId = servicio.travel_id;
          this.estadoServicio = "en_progreso";
          this.manejarCambioEstado("en_progreso");
        }
      }
    }
  },
  created() {
    this.travelStore = useTravelRequestStore();
    this.rankingStore = useRankingStore();
  },
  methods: {
    manejarCambioEstado(estado) {
      this.finalizarTemporizadores();

      if (estado === "en_progreso") {
        this.iniciarServicio();
        this.iniciarProgresoAutomatico();
      } else if (estado === "completado") {
        this.progresoViaje = 100;
        this.calcularTarifaFinal();
        this.$emit("servicio-completado", { travel_id: this.travelId });
        setTimeout(() => this.resetVisual(), 2000);
      } else {
        this.resetVisual();
      }
    },

    iniciarServicio() {
      this.tiempoInicioServicio = new Date();
      this.progresoViaje = 0;

      this.intervaloTiempo = setInterval(() => {
        const ahora = new Date();
        const diferencia = Math.floor((ahora - this.tiempoInicioServicio) / 1000);
        const minutos = Math.floor(diferencia / 60);
        const segundos = diferencia % 60;
        this.tiempoTranscurrido = `${minutos}:${segundos.toString().padStart(2, "0")}`;
      }, 1000);
    },

    async iniciarProgresoAutomatico() {
      this.intervaloProgreso = setInterval(async () => {
        if (this.estadoServicio !== "en_progreso") return;

        this.progresoViaje = Math.min(this.progresoViaje + 5, 100);

        if (this.progresoViaje >= 100) {
          this.finalizarTemporizadores();

          try {
            if (this.travelId) {
              await this.travelStore.updateSolicitudeStatus(this.travelId, "completado");
            }

            this.calcularTarifaFinal();

            const activeTrip = this.servicioSeleccionado || this.travelStore.activeTrip || {};
            const travelData = {
              travel_id: this.travelId || activeTrip.travel_id || activeTrip.id || null,
              date_trip: new Date().toISOString().slice(0, 19).replace("T", " "),
              passenger_id: (sessionStorage.getItem("role_id") == 1) ? sessionStorage.getItem("user_id") : null,
              driver_id: (sessionStorage.getItem("role_id") == 2) ? sessionStorage.getItem("user_id") : null,
              origin: this.origen || activeTrip.origin || "",
              destination: this.destino || activeTrip.destination || "",
              status: "Completado"
            };

            await this.rankingStore.updatePointsOnTripComplete(travelData);

            this.estadoServicio = "completado";
            this.$emit("servicio-completado", { travel_id: this.travelId });
            setTimeout(() => this.resetVisual(), 2000);
          } catch (error) {
            console.error("❌ Error al finalizar el servicio:", error);
          }
        }
      }, 1000);
    },

    calcularTarifaFinal() {
      const minutos = parseInt(this.tiempoTranscurrido.split(":")[0]) || 0;
      const tarifaBase = 8000;
      const tarifaPorMinuto = 300;
      this.tarifaCalculada = (tarifaBase + minutos * tarifaPorMinuto).toLocaleString();
    },

    async cancelarServicio() {
      try {
        // Rechazar solicitud en el store
        if (this.travelId) {
          await this.travelStore.rejectSolicitude(this.travelId);
        }

        // Construir travelData para registrar puntos por cancelación
        const travelData = {
          travel_id: this.travelId,
          date_trip: new Date().toISOString(),
          passenger_points: 5,
          driver_points: -20,
          origin: this.origen,
          destination: this.destino,
          driver_id: (sessionStorage.getItem("role_id") == 2) ? sessionStorage.getItem("user_id") : null
        };

        // Registrar puntos por cancelación
        await this.updatePointsOnTripCancel(travelData);

        // Limpiamos temporizadores y reiniciamos la UI
        this.finalizarTemporizadores();
        this.resetVisual();

        // Emitimos al padre que el servicio fue cancelado
        this.$emit("servicio-cancelado", { travel_id: this.travelId });

      } catch (error) {
        console.error("❌ Error al cancelar el servicio:", error);
      }
    },

    async updatePointsOnTripCancel(travelData) {
      try {
        const travelStore = useTravelRequestStore();

        const passengerId = travelStore.passenger_id;
        if (!passengerId) throw new Error("❌ No se encontró passenger_id almacenado.");

        const driverId = travelData.driver_id || Number(sessionStorage.getItem("user_id"));
        if (!driverId) throw new Error("❌ No se encontró driver_id.");

        const payload = {
          date_trip: travelData.date_trip || new Date().toISOString(),
          passenger_id: passengerId,
          passenger_points: travelData.passenger_points || 5,
          driver_id: driverId,
          driver_points: travelData.driver_points || -20,
          origin: travelData.origin || "Desconocido",
          destination: travelData.destination || "Desconocido",
          status: "Cancelado",
        };

        console.log("📡 Enviando datos para cancelar viaje:", payload);

        const response = await fetch(`${API_URL}/ranking`, {
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
    },

    resetVisual() {
      this.estadoServicio = "esperando";
      this.progresoViaje = 0;
      this.tiempoTranscurrido = "0:00";
      this.tarifaCalculada = "0";
      this.origen = "";
      this.destino = "";
      this.travelId = null;
    },

    finalizarTemporizadores() {
      clearInterval(this.intervaloTiempo);
      clearInterval(this.intervaloProgreso);
      this.intervaloTiempo = null;
      this.intervaloProgreso = null;
    }
  },
  beforeDestroy() {
    this.finalizarTemporizadores();
  }
};
</script>

<style scoped>
.driver-progress-container {
  margin: 20px 0;
}

.route-display {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.location {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-icon.start {
  color: #4caf50;
}

.location-icon.end {
  color: #ff9800;
}

.location-text {
  font-weight: 500;
}

.service-states {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  position: relative;
}

.service-states::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.state-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.state-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  border: 3px solid white;
  font-weight: bold;
  color: #666;
}

.state-item.active .state-marker {
  background: #2196f3;
  color: white;
}

.state-label {
  font-size: 12px;
  text-align: center;
  font-weight: 500;
}

.progress-section {
  margin: 25px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.main-progress {
  height: 8px;
  border-radius: 4px;
}

.progress-stats {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.driver-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.waiting-service, .completed-service {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.waiting-icon {
  font-size: 64px !important;
  color: #9e9e9e;
  margin-bottom: 15px;
}

.completed-icon {
  font-size: 64px !important;
  color: #4caf50;
  margin-bottom: 15px;
}

.tarifa-final {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .service-states {
    flex-direction: column;
    gap: 15px;
  }
  
  .service-states::before {
    display: none;
  }
  
  .state-item {
    flex-direction: row;
    justify-content: flex-start;
    gap: 15px;
  }
  
  .state-marker {
    margin-bottom: 0;
  }
  
  .driver-controls {
    flex-direction: column;
  }
  
  .route-display {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
