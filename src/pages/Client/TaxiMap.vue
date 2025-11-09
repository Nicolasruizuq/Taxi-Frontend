<template>
  <div class="progress-container">
    <h3 class="progress-title">Estado del viaje: {{ estadoViajeLabel }}</h3>

    <div class="progress-bar">
      <div
        v-for="(etapa, index) in etapas"
        :key="index"
        class="progress-step"
        :class="{
          active: index <= indiceEstadoActual,
          current: index === indiceEstadoActual
        }"
      >
        <div class="step-circle">{{ index + 1 }}</div>
        <div class="step-label">{{ etapa.label }}</div>
      </div>
    </div>

    <div class="actions">
      <button
        v-if="estadoViajeExterno === 'pendiente'"
        class="btn info"
        @click="$emit('conductor-llego-origen')"
      >
        🚖 Conductor llegó al origen
      </button>

      <button
        v-if="estadoViajeExterno === 'en_curso'"
        class="btn success"
        @click="$emit('viaje-completado')"
      >
        ✅ Completar viaje
      </button>

      <button
        v-if="estadoViajeExterno !== 'inicial'"
        class="btn danger"
        @click="$emit('viaje-cancelado')"
      >
        ❌ Cancelar viaje
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaxiMap",
  props: {
    estadoViajeExterno: { type: String, default: "inicial" },
    headerColor: { type: String, default: "orange" },
  },
  data() {
    return {
      etapas: [
        { estado: "inicial", label: "Solicitud creada" },
        { estado: "pendiente", label: "Buscando conductor" },
        { estado: "en_curso", label: "Viaje en curso" },
        { estado: "completado", label: "Completado" },
      ],
    };
  },
  computed: {
    indiceEstadoActual() {
      return this.etapas.findIndex(
        (etapa) => etapa.estado === this.estadoViajeExterno
      );
    },
    estadoViajeLabel() {
      const etapa = this.etapas.find(
        (e) => e.estado === this.estadoViajeExterno
      );
      return etapa ? etapa.label : "Desconocido";
    },
  },
};
</script>

<style scoped>
.progress-container {
  text-align: center;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.progress-title {
  font-weight: bold;
  margin-bottom: 1rem;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 2rem 0;
}

.progress-bar::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 10%;
  width: 80%;
  height: 4px;
  background-color: #ccc;
  z-index: 0;
  transform: translateY(-50%);
}

.progress-step {
  position: relative;
  text-align: center;
  z-index: 1;
  flex: 1;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 0 auto;
  line-height: 30px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step-label {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.progress-step.active .step-circle {
  background-color: #4caf50;
  color: white;
}

.progress-step.current .step-circle {
  background-color: #ff9800;
  transform: scale(1.1);
}

.actions {
  margin-top: 1.5rem;
}

button {
  margin: 0.25rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.info {
  background-color: #2196f3;
  color: white;
}

.btn.success {
  background-color: #4caf50;
  color: white;
}

.btn.danger {
  background-color: #f44336;
  color: white;
}

button:hover {
  opacity: 0.85;
}
</style>
