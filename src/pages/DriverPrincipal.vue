<template>
  <div class="content">
    <div class="md-layout">
      
      <!-- Barra de progreso del conductor - SIEMPRE VISIBLE -->
      <div class="md-layout-item md-size-100">
        <driver-progress
          :origen="servicioActivo.origen"
          :destino="servicioActivo.destino"
          :estado-servicio-externo="estadoServicio"
          header-color="blue"
          @servicio-completado="onServicioCompletado"
          @servicio-cancelado="onServicioCancelado"
        />
      </div>

      <!-- Lista de servicios - SOLO VISIBLE SIN SERVICIO ACTIVO -->
      <div v-if="estadoServicio === 'esperando'" class="md-layout-item md-size-100">
        <service-list 
          data-background-color="green"
          @servicio-aceptado="onServicioAceptado"
        > </service-list>
      </div>

      <!-- Espacio vacío cuando hay servicio activo -->
      <div v-if="estadoServicio !== 'esperando'" class="md-layout-item md-size-100">
        <div class="active-service-space">
          <md-icon>engineering</md-icon>
          <h4>Servicio en Curso</h4>
          <p>Completando el viaje hacia {{ servicioActivo.destino }}</p>
          <p>Puedes cancelar el servicio desde la barra superior</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ServiceList } from "@/pages";
import DriverProgress from "@/pages/Driver/DriverProgress.vue";

export default {
  name: "DriverPrincipal",
  components: {
    ServiceList,
    DriverProgress
  },
  data() {
    return {
      estadoServicio: "esperando",
      servicioActivo: {
        origen: "",
        destino: ""
      }
    };
  },
  methods: {
    onServicioAceptado(servicio) {
      this.estadoServicio = "en_progreso";
      this.servicioActivo = {
        origen: servicio.origen,
        destino: servicio.destino
      };
      
      console.log("Servicio aceptado:", servicio);
    },
    
    onServicioCompletado() {
      console.log("Servicio completado automáticamente");
      
      // Después de 5 segundos, resetear el estado
      setTimeout(() => {
        this.estadoServicio = "esperando";
        this.servicioActivo = { origen: "", destino: "" };
      }, 5000);
    },
    
    onServicioCancelado() {
      this.estadoServicio = "esperando";
      this.servicioActivo = { origen: "", destino: "" };
      console.log("Servicio cancelado por el conductor");
    }
  }
};
</script>

<style scoped>
.active-service-space {
  text-align: center;
  padding: 80px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.active-service-space md-icon {
  font-size: 80px !important;
  color: #2196f3;
  margin-bottom: 20px;
}

.active-service-space h4 {
  color: #333;
  margin-bottom: 10px;
}
</style>