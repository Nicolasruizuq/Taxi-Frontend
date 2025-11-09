<template>
  <div class="content">
    <div class="md-layout">
      
      <!-- Formulario de viaje con la barra integrada -->
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <travel-form 
          data-background-color="orange"
          @solicitud-enviada="onSolicitudEnviada"
          :disabled="estadoViajeActual !== 'inicial'"
        >
          <!-- Aquí insertamos la barra como contenido hijo -->
          <template #barra-viaje>
            <taxi-map
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
  components: {
    TravelForm,
    TaxiMap
  },
  data() {
    return {
      estadoViajeActual: "inicial",
      origenViaje: '',
      destinoViaje: ''
    };
  },
  methods: {
    onSolicitudEnviada(solicitud) {
      this.estadoViajeActual = "pendiente";
      this.origenViaje = solicitud.origen;
      this.destinoViaje = solicitud.destino;
      
      // Aquí conectarías con tu backend para buscar conductor
      console.log('Viaje solicitado:', solicitud);
    },
    
    onConductorLlegoOrigen() {
      console.log("El conductor llegó al origen");
    },
    
    onViajeCompletado() {
      console.log("Viaje completado exitosamente");
      
      // Mostrar resumen final por unos segundos antes de resetear
      setTimeout(() => {
        this.estadoViajeActual = "inicial";
        this.origenViaje = '';
        this.destinoViaje = '';
      }, 5000);
    },
    
    onViajeCancelado() {
      this.estadoViajeActual = "inicial";
      this.origenViaje = '';
      this.destinoViaje = '';
      console.log("Viaje cancelado por el usuario");
    }
  }
};
</script>

<style scoped>
/* Transiciones suaves para el layout */
.md-layout-item {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .md-layout-item {
    min-width: 100% !important;
    max-width: 100% !important;
    flex-basis: 100% !important;
  }
}
</style>