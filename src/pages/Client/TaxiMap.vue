<template>
  <div class="trip-progress-container">
    <md-card>
      <md-card-header :data-background-color="headerColor">
        <h4 class="title">Estado de tu viaje</h4>
        <p class="category" v-if="estadoViaje === 'pendiente'">Esperando conductor...</p>
        <p class="category" v-else-if="estadoViaje === 'aceptado'">Conductor en camino</p>
        <p class="category" v-else-if="estadoViaje === 'completado'">Viaje completado</p>
        <p class="category" v-else>Preparando tu viaje</p>
      </md-card-header>

      <md-card-content>
        <!-- Información del viaje -->
        <div class="trip-info">
          <div class="route-display">
            <div class="location">
              <md-icon class="location-icon start">place</md-icon>
              <span class="location-text">{{ origen }}</span>
            </div>
            <div class="location">
              <md-icon class="location-icon end">flag</md-icon>
              <span class="location-text">{{ destino }}</span>
            </div>
          </div>

          <!-- Estados del viaje -->
          <div class="trip-states">
            <div class="state-item" :class="{ active: estadoViaje !== 'inicial' }">
              <div class="state-marker">
                <md-icon v-if="estadoViaje !== 'inicial'">check</md-icon>
                <span v-else>1</span>
              </div>
              <span class="state-label">Solicitado</span>
            </div>

            <div class="state-item" :class="{ active: ['aceptado', 'en_camino', 'completado'].includes(estadoViaje) }">
              <div class="state-marker">
                <md-icon v-if="['aceptado', 'en_camino', 'completado'].includes(estadoViaje)">check</md-icon>
                <span v-else>2</span>
              </div>
              <span class="state-label">Aceptado</span>
            </div>

            <div class="state-item" :class="{ active: ['en_camino', 'completado'].includes(estadoViaje) }">
              <div class="state-marker">
                <md-icon v-if="['en_camino', 'completado'].includes(estadoViaje)">check</md-icon>
                <span v-else>3</span>
              </div>
              <span class="state-label">En camino</span>
            </div>

            <div class="state-item" :class="{ active: estadoViaje === 'completado' }">
              <div class="state-marker">
                <md-icon v-if="estadoViaje === 'completado'">check</md-icon>
                <span v-else>4</span>
              </div>
              <span class="state-label">Completado</span>
            </div>
          </div>

          <!-- Barra de progreso (solo visible cuando el viaje es aceptado) -->
          <div v-if="estadoViaje === 'aceptado' || estadoViaje === 'en_camino'" class="progress-section">
            <div class="progress-header">
              <span>Progreso del recorrido</span>
              <span>{{ progresoViaje }}%</span>
            </div>
            <md-progress-bar 
              md-mode="determinate" 
              :md-value="progresoViaje"
              class="md-accent main-progress"
            ></md-progress-bar>
            <div class="progress-stats">
              <span>Tiempo estimado: {{ tiempoRestante }}</span>
              <span>Distancia: {{ distanciaRecorrida }} km</span>
            </div>
          </div>

          <!-- Información del conductor (solo cuando es aceptado) -->
          <div v-if="estadoViaje === 'aceptado' || estadoViaje === 'en_camino'" class="driver-info">
            <h5>Tu conductor</h5>
            <div class="driver-details">
              <div class="driver-avatar">
                <md-avatar class="md-large">
                  {{ nombreConductor.charAt(0) }}
                </md-avatar>
              </div>
              <div class="driver-data">
                <p><strong>{{ nombreConductor }}</strong></p>
                <p>Vehículo: {{ vehiculoModelo }}</p>
                <p>Placa: {{ placaTaxi }}</p>
                <p>Calificación: ⭐{{ calificacionConductor }}/5</p>
              </div>
            </div>
          </div>

          <!-- Estado pendiente -->
          <div v-if="estadoViaje === 'pendiente'" class="waiting-state">
            <div class="waiting-animation">
              <md-icon class="search-icon">search</md-icon>
            </div>
            <h4>Buscando conductor disponible</h4>
            <p>Estamos localizando el conductor más cercano a tu ubicación</p>
            <div class="waiting-time">
              <md-icon>schedule</md-icon>
              <span>Tiempo de espera: {{ tiempoEspera }}</span>
            </div>
          </div>

          <!-- Estado inicial (antes de solicitar) -->
          <div v-if="estadoViaje === 'inicial'" class="initial-state">
            <md-icon class="info-icon">info</md-icon>
            <p>Tu progreso de viaje aparecerá aquí cuando solicites un servicio</p>
          </div>

          <!-- Controles -->
          <div class="progress-controls">
            <md-button 
              class="md-danger md-raised" 
              @click="cancelarViaje"
              :disabled="estadoViaje === 'completado' || estadoViaje === 'inicial'"
            >
              <md-icon>cancel</md-icon>
              {{ estadoViaje === 'completado' ? 'Viaje Finalizado' : 'Cancelar Viaje' }}
            </md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  name: "TripProgress",
  props: {
    origen: {
      type: String,
      default: "Selecciona origen"
    },
    destino: {
      type: String,
      default: "Selecciona destino"
    },
    headerColor: {
      type: String,
      default: "green"
    },
    // Nueva prop para controlar el estado desde el componente padre
    estadoViajeExterno: {
      type: String,
      default: "inicial" // inicial, pendiente, aceptado, en_camino, completado
    }
  },
  data() {
    return {
      estadoViaje: "inicial",
      progresoViaje: 0,
      intervaloProgreso: null,
      tiempoEspera: "0:00",
      tiempoInicioEspera: null,
      placaTaxi: "ABC-123",
      nombreConductor: "Juan Pérez",
      vehiculoModelo: "Toyota Corolla 2022",
      calificacionConductor: "4.8",
      distanciaTotal: 8.5
    };
  },
  computed: {
    tiempoRestante() {
      if (this.estadoViaje !== 'en_camino') return "Calculando...";
      const minutosTotales = 15;
      const minutosTranscurridos = (minutosTotales * this.progresoViaje) / 100;
      const minutosRestantes = Math.max(0, minutosTotales - minutosTranscurridos);
      return `${Math.ceil(minutosRestantes)} min`;
    },
    distanciaRecorrida() {
      return (this.distanciaTotal * this.progresoViaje / 100).toFixed(1);
    }
  },
  watch: {
    estadoViajeExterno: {
      immediate: true,
      handler(nuevoEstado) {
        this.estadoViaje = nuevoEstado;
        this.manejarCambioEstado(nuevoEstado);
      }
    },
    estadoViaje(nuevoEstado) {
      this.manejarCambioEstado(nuevoEstado);
    }
  },
  methods: {
    manejarCambioEstado(estado) {
      // Limpiar intervalo anterior
      if (this.intervaloProgreso) {
        clearInterval(this.intervaloProgreso);
        this.intervaloProgreso = null;
      }

      switch(estado) {
        case 'pendiente':
          this.iniciarTemporizadorEspera();
          break;
        case 'aceptado':
          this.progresoViaje = 0;
          // Simular que el conductor se dirige al origen
          this.simularProgreso(10, 2000); // 10% cada 2 segundos
          break;
        case 'en_camino':
          // Continuar el progreso hacia el destino
          this.simularProgreso(100, 1500); // Hasta 100% cada 1.5 segundos
          break;
        case 'completado':
          this.progresoViaje = 100;
          this.$emit('viaje-completado');
          break;
        default:
          this.progresoViaje = 0;
      }
    },

    iniciarTemporizadorEspera() {
      this.tiempoInicioEspera = new Date();
      const intervalo = setInterval(() => {
        if (this.estadoViaje === 'pendiente') {
          const ahora = new Date();
          const diferencia = Math.floor((ahora - this.tiempoInicioEspera) / 1000);
          const minutos = Math.floor(diferencia / 60);
          const segundos = diferencia % 60;
          this.tiempoEspera = `${minutos}:${segundos.toString().padStart(2, '0')}`;
        } else {
          clearInterval(intervalo);
        }
      }, 1000);
    },

    simularProgreso(meta, intervaloMs) {
      this.intervaloProgreso = setInterval(() => {
        if (this.progresoViaje < meta) {
          this.progresoViaje += 2;
          // Si alcanza ciertos puntos, cambiar estado automáticamente
          if (this.estadoViaje === 'aceptado' && this.progresoViaje >= 30) {
            this.estadoViaje = 'en_camino';
            this.$emit('conductor-llego-origen');
          }
        } else {
          clearInterval(this.intervaloProgreso);
          if (this.estadoViaje === 'en_camino' && this.progresoViaje >= 100) {
            this.estadoViaje = 'completado';
          }
        }
      }, intervaloMs);
    },

    cancelarViaje() {
      if (this.intervaloProgreso) {
        clearInterval(this.intervaloProgreso);
      }
      this.estadoViaje = 'inicial';
      this.progresoViaje = 0;
      this.$emit('viaje-cancelado');
    }
  },

  beforeDestroy() {
    if (this.intervaloProgreso) {
      clearInterval(this.intervaloProgreso);
    }
  }
};
</script>

<style scoped>
.trip-progress-container {
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

/* Estados del viaje */
.trip-states {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  position: relative;
}

.trip-states::before {
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
  background: #4caf50;
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
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

/* Información del conductor */
.driver-info {
  margin: 20px 0;
  padding: 20px;
  background: #e8f5e8;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.driver-details {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 15px;
}

.driver-data p {
  margin: 5px 0;
}

/* Estados especiales */
.waiting-state, .initial-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.waiting-animation {
  margin-bottom: 20px;
}

.search-icon {
  font-size: 48px !important;
  color: #ff9800;
  animation: pulse 2s infinite;
}

.info-icon {
  font-size: 48px !important;
  color: #2196f3;
  margin-bottom: 15px;
}

.waiting-time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
  font-weight: 500;
}

.progress-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .trip-states {
    flex-direction: column;
    gap: 15px;
  }
  
  .trip-states::before {
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
  
  .driver-details {
    flex-direction: column;
    text-align: center;
  }
}
</style>