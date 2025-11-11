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

          <!-- Indicadores de estado -->
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

          <!-- Progreso del viaje -->
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
          <div class="driver-controls">
            <md-button 
              class="md-danger md-raised" 
              @click="cancelarServicio"
              v-if="estadoServicio === 'en_progreso'"
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

export default {
  name: "DriverProgress",
  props: {
    origen: { type: String, default: "" },
    destino: { type: String, default: "" },
    headerColor: { type: String, default: "blue" },
    estadoServicioExterno: { type: String, default: "esperando" },
    travelId: { type: [Number, String], default: null }
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
      travelStore: null
    };
  },
  watch: {
    estadoServicioExterno: {
      immediate: true,
      handler(nuevoEstado) {
        this.estadoServicio = nuevoEstado;
        this.manejarCambioEstado(nuevoEstado);
      }
    }
  },
  created() {
    this.travelStore = useTravelRequestStore();
  },
  methods: {
    manejarCambioEstado(estado) {
      this.finalizarTemporizadores();

      if (estado === "en_progreso") {
        this.iniciarServicio();
        this.iniciarProgresoAutomatico();
      } else if (estado === "completado") {
        this.progresoViaje = 100;
        this.finalizarTemporizadores();
        this.calcularTarifaFinal();
        this.$emit("servicio-completado", { travel_id: this.travelId });
      } else {
        this.progresoViaje = 0;
        this.tiempoTranscurrido = "0:00";
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

        if (this.progresoViaje < 100) {
          this.progresoViaje = Math.min(this.progresoViaje + 5, 100);
        }

        if (this.progresoViaje >= 100) {
          this.finalizarTemporizadores();

          try {
            if (this.travelId) {
              // ✅ actualiza estado en backend (usa "completado" para Elixir)
              await this.travelStore.updateSolicitudeStatus(this.travelId, "completado");
            }

            this.estadoServicio = "completado";
            this.calcularTarifaFinal();
            this.$emit("servicio-completado", { travel_id: this.travelId });
          } catch (error) {
            console.error("❌ Error al actualizar el estado del viaje:", error);
            this.progresoViaje = 95;
          }
        }
      }, 3000);
    },

    calcularTarifaFinal() {
      const minutos = parseInt(this.tiempoTranscurrido.split(":")[0]) || 0;
      const tarifaBase = 8000;
      const tarifaPorMinuto = 300;
      this.tarifaCalculada = (tarifaBase + minutos * tarifaPorMinuto).toLocaleString();
    },

    cancelarServicio() {
      this.finalizarTemporizadores();
      this.estadoServicio = "esperando";
      this.progresoViaje = 0;
      this.$emit("servicio-cancelado", { travel_id: this.travelId });
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

/* Estados del servicio */
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

/* Sección de progreso */
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

/* Controles del conductor */
.driver-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

/* Estados especiales */
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

/* Responsive */
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