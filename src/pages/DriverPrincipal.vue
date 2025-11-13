<template>
  <div class="content">
    <div class="md-layout">
      <!-- 🔹 Barra de progreso del conductor -->
      <div class="md-layout-item md-size-100">
        <driver-progress
          :servicio-seleccionado="servicioActivo"
          :estado-servicio-externo="estadoServicio"
          header-color="blue"
          @servicio-completado="onServicioCompletado"
          @servicio-cancelado="onServicioCancelado"
        />
      </div>

      <!-- 🔹 Lista de servicios (visible cuando no hay activo) -->
      <div
        v-if="estadoServicio === 'esperando'"
        class="md-layout-item md-size-100"
      >
        <service-list
          data-background-color="green"
          @servicio-aceptado="onServicioAceptado"
          @servicio-rechazado="onServicioRechazado"
        />
      </div>

      <!-- 🔹 Mensaje cuando hay servicio activo -->
      <div v-else class="md-layout-item md-size-100">
        <div class="active-service-space">
          <md-icon>engineering</md-icon>
          <h4>Servicio en curso</h4>
          <p>Conduciendo hacia {{ servicioActivo.destination || servicioActivo.destino }}</p>
          <p>Puedes cancelar el servicio desde la barra superior</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceList from "@/pages/Driver/ServiceList.vue";
import DriverProgress from "@/pages/Driver/DriverProgress.vue";
import { useTravelRequestStore } from "@/storages/travelRequestStorage";

export default {
  name: "DriverPrincipal",
  components: {
    ServiceList,
    DriverProgress,
  },
  data() {
    return {
      estadoServicio: "esperando", // "esperando" | "en_progreso" | "completado"
      servicioActivo: null, // ahora puede ser null
      travelRequestStore: null,
    };
  },
  mounted() {
    this.travelRequestStore = useTravelRequestStore();
  },
  methods: {
    /** =============================
     *  🔹 ACEPTAR SERVICIO
     *  ============================= */
    async onServicioAceptado(servicio) {
      console.log("Evento recibido desde ServiceList (aceptado):", servicio);

      try {
        await this.travelRequestStore.acceptSolicitude(servicio.travel_id);

        this.estadoServicio = "en_progreso";
        this.servicioActivo = {
          travel_id: servicio.travel_id,
          origin: servicio.origin || servicio.origen,
          destination: servicio.destination || servicio.destino,
          passenger_id: servicio.passenger_id || servicio.usuario_id,
          driver_id: servicio.driver_id || null,
        };

        this.$notifications.notify({
          message: `🚗 Has aceptado la solicitud de ${servicio.passenger || servicio.usuario}`,
          type: "success",
          horizontalAlign: "center",
          verticalAlign: "top",
        });
      } catch (error) {
        console.error("❌ Error al aceptar la solicitud:", error);
        this.$notifications.notify({
          message: "Error al actualizar la solicitud en el servidor.",
          type: "danger",
          horizontalAlign: "center",
          verticalAlign: "top",
        });
      }
    },

    /** =============================
     *  🔹 RECHAZAR SERVICIO
     *  ============================= */
    async onServicioRechazado(servicio) {
      console.log("🚫 Evento recibido desde ServiceList (rechazado):", servicio);

      try {
        await this.travelRequestStore.rejectSolicitude(servicio.travel_id);

        this.$notifications.notify({
          message: `❌ Has rechazado la solicitud de ${servicio.passenger || servicio.usuario}`,
          type: "warning",
          horizontalAlign: "center",
          verticalAlign: "top",
        });
      } catch (error) {
        console.error("❌ Error al rechazar la solicitud:", error);
        this.$notifications.notify({
          message: "Error al rechazar la solicitud en el servidor.",
          type: "danger",
          horizontalAlign: "center",
          verticalAlign: "top",
        });
      }
    },

    /** =============================
     *  🔹 SERVICIO COMPLETADO
     *  ============================= */
    onServicioCompletado({ travel_id }) {
      console.log("✅ Evento recibido: servicio completado", travel_id);

      this.$notifications.notify({
        message: "🎉 ¡Servicio completado exitosamente! Puntos asignados.",
        type: "success",
        horizontalAlign: "center",
        verticalAlign: "top",
      });

      this.estadoServicio = "esperando";
      this.servicioActivo = null;
    },

    /** =============================
     *  🔹 SERVICIO CANCELADO
     *  ============================= */
    onServicioCancelado({ travel_id }) {
      console.log("🚫 Servicio cancelado por el conductor", travel_id);

      this.estadoServicio = "esperando";
      this.servicioActivo = null;

      this.$notifications.notify({
        message: "🚫 Has cancelado el servicio actual.",
        type: "warning",
        horizontalAlign: "center",
        verticalAlign: "top",
      });
    },
  },
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
