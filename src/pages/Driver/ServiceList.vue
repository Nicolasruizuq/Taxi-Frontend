<template>
  <div class="service-list">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Solicitudes de Servicio</h4>
        <p class="category">Lista de clientes pendientes</p>
      </md-card-header>

      <md-card-content>
        <!-- Lista de servicios -->
        <md-table v-model="servicios" class="service-table">
          <md-table-row slot="md-table-row" slot-scope="{ item }" class="service-row">
            <!-- Usuario -->
            <md-table-cell md-label="Usuario" md-sort-by="usuario">
              <div class="user-info">
                <span class="user-name">{{ item.usuario }}</span>
              </div>
            </md-table-cell>

            <!-- Origen -->
            <md-table-cell md-label="Origen" md-sort-by="origen">
              <div class="location-info">
                <md-icon>place</md-icon>
                <span>{{ item.origen }}</span>
              </div>
            </md-table-cell>

            <!-- Destino -->
            <md-table-cell md-label="Destino" md-sort-by="destino">
              <div class="location-info">
                <md-icon>flag</md-icon>
                <span>{{ item.destino }}</span>
              </div>
            </md-table-cell>

            <!-- Acciones -->
            <md-table-cell md-label="Acciones">
              <div class="action-buttons">
                <md-button 
                  class="md-raised md-success"
                  @click="aceptarServicio(item)"
                >
                  <md-icon>check</md-icon>
                  Aceptar
                </md-button>

                <md-button 
                  class="md-raised md-danger"
                  @click="rechazarServicio(item)"
                >
                  <md-icon>close</md-icon>
                  Rechazar
                </md-button>
              </div>
            </md-table-cell>
          </md-table-row>
        </md-table>

        <!-- Mensaje si no hay servicios -->
        <div v-if="servicios.length === 0" class="empty-state">
          <md-icon class="empty-icon">assignment</md-icon>
          <h3>No hay solicitudes pendientes</h3>
          <p>Las nuevas solicitudes aparecerán aquí</p>
        </div>
      </md-card-content>
    </md-card>

    <!-- Snackbar para notificaciones -->
    <md-snackbar 
      :md-active.sync="showSnackbar" 
      :md-duration="4000"
      md-position="center"
    >
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Cerrar</md-button>
    </md-snackbar>
  </div>
</template>

<script>
export default {
  name: "service-list",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      servicios: [
        {
          id: 1,
          usuario: 'juan_perez',
          origen: 'Av. Principal #123, Centro',
          destino: 'Plaza Central, Zona Norte',
          estado: 'pendiente'
        },
        {
          id: 2,
          usuario: 'maria_garcia',
          origen: 'Calle Secundaria #456, Sur',
          destino: 'Aeropuerto Internacional',
          estado: 'pendiente'
        },
        {
          id: 3,
          usuario: 'carlos_lopez',
          origen: 'Residencial Las Flores #789',
          destino: 'Centro Comercial Mega',
          estado: 'pendiente'
        }
      ],
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    aceptarServicio(servicio) {
      console.log('Servicio aceptado:', servicio)
      this.servicios = this.servicios.filter(s => s.id !== servicio.id)
      this.snackbarMessage = `Servicio de ${servicio.usuario} aceptado`
      this.showSnackbar = true
    },

    rechazarServicio(servicio) {
      console.log('Servicio rechazado:', servicio)
      this.servicios = this.servicios.filter(s => s.id !== servicio.id)
      this.snackbarMessage = `Servicio de ${servicio.usuario} rechazado`
      this.showSnackbar = true
    }
  }
}
</script>

<style scoped>
.service-list {
  padding: 20px;
}

.service-table {
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-info md-icon {
  color: #999;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px !important;
  margin-bottom: 16px;
}

.service-row:hover {
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .service-list {
    padding: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
}
</style>