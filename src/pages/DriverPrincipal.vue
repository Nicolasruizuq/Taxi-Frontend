<template>
  <div class="content">
    <div class="md-layout">
      <!-- 🔹 Barra de progreso del conductor -->
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
          <p>Conduciendo hacia {{ servicioActivo.destino }}</p>
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
      estadoServicio: "esperando", // "esperando" | "en_progreso"
      servicioActivo: {
        id: null,
        origen: "",
        destino: "",
      },
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
        const response = await this.travelRequestStore.acceptSolicitude(servicio.travel_id);
        console.log("✅ Solicitud actualizada correctamente:", response);

        this.estadoServicio = "en_progreso";
        this.servicioActivo = {
          id: servicio.travel_id,
          origen: servicio.origin || servicio.origen,
          destino: servicio.destination || servicio.destino,
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
        const response = await this.travelRequestStore.rejectSolicitude(servicio.travel_id);
        console.log("✅ Solicitud rechazada correctamente:", response);

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
    async onServicioCompletado() {
      console.log("✅ Servicio completado (evento recibido)");

      if (!this.servicioActivo.id) {
        console.warn("⚠️ No hay servicio activo para marcar como completado.");
        return;
      }

      try {
        const response = await this.travelRequestStore.updateSolicitudeStatus(
          this.servicioActivo.id,
          "completado"
        );
        console.log("📦 Estado de solicitud actualizado a completado:", response);

        this.$notifications.notify({
          message: "✅ El servicio fue marcado como completado.",
          type: "success",
          horizontalAlign: "center",
          verticalAlign: "top",
        });

        // 🔄 Reset visual después de breve delay
        setTimeout(() => {
          this.estadoServicio = "esperando";
          this.servicioActivo = { id: null, origen: "", destino: "" };
        }, 3000);
      } catch (error) {
        console.error("❌ Error al actualizar estado de la solicitud:", error);
        this.$notifications.notify({
          message: "Error al marcar la solicitud como completada.",
          type: "danger",
          horizontalAlign: "center",
          verticalAlign: "top",
        });
      }
    },

    /** =============================
     *  🔹 SERVICIO CANCELADO
     *  ============================= */
    onServicioCancelado() {
      console.log("🚫 Servicio cancelado por el conductor");
      this.estadoServicio = "esperando";
      this.servicioActivo = { id: null, origen: "", destino: "" };
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
