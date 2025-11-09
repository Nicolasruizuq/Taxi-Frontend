<template>
  <div class="content">
    <div class="md-layout">
      
      <!-- Formulario de viaje -->
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <travel-form 
          data-background-color="orange"
          @solicitud-enviada="onSolicitudEnviada"
          :disabled="estadoViajeActual !== 'inicial'"
        >
          <!-- Slot: Barra de progreso del viaje -->
          <template #barra-viaje>
            <taxi-map
              v-if="mostrarBarraViaje"
              :origen="origenViaje"
              :destino="destinoViaje"
              :estado-viaje-externo="estadoViajeActual"
              header-color="orange"
              @viaje-completado="onViajeCompletado"
              @viaje-cancelado="onViajeCancelado"
              @conductor-llego-origen="onConductorLlegoOrigen"
            />
          </template>
        </travel-form>
      </div>

    </div>
  </div>
</template>

<script>
import TravelForm from "@/pages/Client/TravelForm.vue";
import TaxiMap from "@/pages/Client/TaxiMap.vue";

export default {
  name: "ClientPrincipal",
  components: { TravelForm, TaxiMap },
  data() {
    return {
      estadoViajeActual: "inicial", // inicial | pendiente | aceptado | en_camino | completado
      origenViaje: "",
      destinoViaje: "",
      mostrarBarraViaje: false,
    };
  },
  methods: {
    onSolicitudEnviada(solicitud) {
      console.log("🟠 Solicitud recibida:", solicitud);

      this.origenViaje = solicitud.origen;
      this.destinoViaje = solicitud.destino;
      this.estadoViajeActual = "pendiente";
      this.mostrarBarraViaje = true;

      // Simula flujo del viaje (solo para pruebas)
      this.simularFlujoDeViaje();
    },

    onConductorLlegoOrigen() {
      console.log("🚗 El conductor llegó al origen");
      this.estadoViajeActual = "en_camino";
    },

    onViajeCompletado() {
      console.log("✅ Viaje completado exitosamente");
      this.estadoViajeActual = "completado";

      // Espera 5 segundos antes de reiniciar
      setTimeout(this.resetearViaje, 5000);
    },

    onViajeCancelado() {
      console.log("❌ Viaje cancelado por el usuario");
      this.resetearViaje();
    },

    resetearViaje() {
      this.estadoViajeActual = "inicial";
      this.origenViaje = "";
      this.destinoViaje = "";
      this.mostrarBarraViaje = false;
    },

    // 🔄 Simulación del flujo del viaje (solo para desarrollo)
    simularFlujoDeViaje() {
      setTimeout(() => {
        this.estadoViajeActual = "aceptado";
        console.log("🟢 Conductor aceptó el viaje");

        setTimeout(() => {
          this.estadoViajeActual = "en_camino";
          console.log("🚕 El viaje está en camino");

          setTimeout(() => {
            this.onViajeCompletado();
          }, 5000);
        }, 4000);
      }, 3000);
    },
  },
};
</script>

<style scoped>
.md-layout-item {
  transition: all 0.3s ease;
}

@media (max-width: 960px) {
  .md-layout-item {
    min-width: 100% !important;
    max-width: 100% !important;
    flex-basis: 100% !important;
  }
}
</style>
