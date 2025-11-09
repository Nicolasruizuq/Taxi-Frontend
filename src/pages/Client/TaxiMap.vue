<template>
  <div class="trip-progress-container compact">
    <md-card>
      <md-card-header :data-background-color="headerColor" class="compact-header">
        <h4 class="title small-title">Estado del viaje</h4>
        <p class="category small-category" v-if="estadoViaje === 'pendiente'">Esperando conductor...</p>
        <p class="category small-category" v-else-if="estadoViaje === 'aceptado'">Conductor en camino</p>
        <p class="category small-category" v-else-if="estadoViaje === 'completado'">Viaje completado</p>
        <p class="category small-category" v-else>Preparando viaje</p>
      </md-card-header>

      <md-card-content>
        <!-- (contenido interno igual al original, sin cambios funcionales) -->
      </md-card-content>
    </md-card>
  </div>
</template>

<style scoped>
.compact {
  margin-bottom: 10px;
  transform: scale(0.95);
}
.compact-header {
  padding: 8px 12px;
}
.small-title {
  font-size: 16px;
  margin: 0;
}
.small-category {
  font-size: 12px;
}
</style>

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