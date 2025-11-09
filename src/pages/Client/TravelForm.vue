<template>
  <form>
    <md-card>

      <!-- Slot para insertar la barra -->
      <slot name="barra-viaje"></slot>

      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">¿En donde estás?¿A donde quieres ir?</h4>
        <p class="category">Llena el formulario para solicitar tu servicio</p>
      </md-card-header>

      <md-card-content>
        
        <!-- Origen -->
        <div class="md-layout-item md-medium-size-100 md-size-100">
          <md-field>
            <label for="origen">Origen</label>
            <md-select 
              v-if="locations.length"
              v-model="selectedOrigin" 
              name="origen" 
              id="origen"
              @change="onOriginChange"
            >
              <md-option 
                v-for="location in locations" 
                :key="location.id" 
                :value="String(location.id)"
              >
                {{ location.name }}
              </md-option>
            </md-select>
          </md-field>
          <div v-if="selectedOrigin" class="selected-value">
            Origen seleccionado: {{ obtainLocationName(selectedOrigin) }}
          </div>
        </div>

        <!-- Destino -->
        <div class="md-layout-item md-medium-size-100 md-size-100">
          <md-field>
            <label for="destino">Destino</label>
            <md-select 
              v-model="selectedDestination" 
              name="destino" 
              id="destino"
              :disabled="!selectedOrigin"
            >
              <md-option 
                v-for="location in availableDestinations" 
                :key="location.id" 
                :value="String(location.id)"
              >
                {{ location.name }}
              </md-option>
            </md-select>
            <span class="md-error" v-if="!selectedOrigin">
              Primero selecciona un origen
            </span>
          </md-field>
          <div v-if="selectedDestination" class="selected-value">
            Destino seleccionado: {{ obtainLocationName(selectedDestination) }}
          </div>
        </div>

        <!-- Información del viaje -->
        <div v-if="selectedOrigin && selectedDestination" class="trip-info">
          <md-card class="md-primary">
            <md-card-content>
              <h4>Resumen de tu viaje</h4>
              <p><strong>Origen:</strong> {{ obtainLocationName(selectedOrigin) }}</p>
              <p><strong>Destino:</strong> {{ obtainLocationName(selectedDestination) }}</p>
              <p><strong>Distancia aproximada:</strong> {{ calculateDistance() }}</p>
            </md-card-content>
          </md-card>
        </div>

        <div class="md-layout">
          <div class="md-layout-item md-size-100 text-right">
            <md-button 
              class="md-raised md-success" 
              :disabled="!selectedOrigin || !selectedDestination"
              @click.prevent="create_travel_request"
            >
              Solicitar servicio
            </md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>

<script>
import { useTravelRequestStore } from "../../storages/travelRequestStorage";
export default {
  name: "travel-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectedOrigin: '',
      selectedDestination: '',
      loading: false,
      error: null,
      locations: [
        { id: 1, name: "Portal Del Quindío" },
        { id: 2, name: "Unicentro" },
        { id: 3, name: "Universidad del Quindío" },
        { id: 4, name: "Parque Sucre" },
        { id: 5, name: "Plaza Bolivar" },
        { id: 6, name: "Plaza Flora" },
        { id: 7, name: "Estadio Centenario" },
        { id: 8, name: "Coliseo del café" },
        { id: 9, name: "Terminal" },
        { id: 10, name: "EAM" },
        { id: 11, name: "Gran Colombia" },
        { id: 12, name: "Aeropuerto el eden" }
      ],
    };
  },
  computed: {
    availableDestinations() {
    if (!this.selectedOrigin) return [];
    // Convertir selectedOrigin a número para comparar
    const originId = Number(this.selectedOrigin);
    return this.locations.filter(l => l.id !== originId);
  }
},
  methods: {

    async create_travel_request() {
      const store = useTravelRequestStore();
      this.error = null;
      this.loading = true;

      try {

        const requestPayload = {
          passenger_id: store.user_id,
          origin_location_id: this.selectedOrigin,
          destination_location_id: this.selectedDestination,
        };

        console.log("Enviando payload:", requestPayload);

        const result = await store.create_travel_request(requestPayload);
        console.log("Result en TravelForm.vue:", result);

        // 🔹 Si el store devuelve los datos correctamente
        if (result && result.id) {
          this.$notifications.notify({
            message: "✅ Solicitud de viaje creada correctamente.",
            type: "success",
            horizontalAlign: "center",
            verticalAlign: "top",
          });

          this.$emit('solicitud-enviada', {            
            origen: this.obtainLocationName(this.selectedOrigin),
            destino: this.obtainLocationName(this.selectedDestination),
            id: result.id
          });
          console.log("this.obtainLocationName:", this.obtainLocationName(this.selectedOrigin));

        } else {
          this.error = store.error || "❌ No se pudo crear la solicitud de viaje.";
          this.$notifications.notify({
            message: this.error,
            type: "danger",
            horizontalAlign: "center",
            verticalAlign: "top",
          });
        }
      } catch (err) {
        console.error("Error en TravelForm.vue:", err);
        this.error = "⚠️ Ocurrió un error inesperado durante la creacion de su solicitud de viaje.";
        this.$notifications.notify({
          message: this.error,
          type: "warning",
          horizontalAlign: "center",
          verticalAlign: "top",
        });
      } finally {
        this.loading = false;
      }
    },
    
    onOriginChange() {
      // Resetear destino cuando cambia el origen
      this.selectedDestination = '';
      if (!this.locations.find(l => l.id === this.selectedOrigin)) {
        this.selectedOrigin = '';
      }
    },
    
    obtainLocationName(id) {
      const location = this.locations.find(l => l.id === Number(id));
      return location ? location.name : '';
    },
    
    calculateDistance() {
      // Aquí puedes implementar lógica real de cálculo de distancias
      // Por ahora es un ejemplo simple
      const distances = {
        'corta': '2-5 km',
        'media': '5-10 km', 
        'larga': '10+ km'
      };
      
      // Simular cálculo basado en los lugares seleccionados
      if (this.selectedOrigin && this.selectedDestination) {
        return distances.media; // Ejemplo
      }
      return '';
    },
    
    requestService() {
      if (!this.selectedOrigin || !this.selectedDestination) {
        alert('Por favor selecciona origen y destino');
        return;
      }

      const serviceData = {
        origin: this.obtainLocationName(this.selectedOrigin),
        destination: this.obtainLocationName(this.selectedDestination),
      };
      
      console.log('Solicitando servicio:', serviceData);
      
      // Aquí iría la llamada a tu API
      // this.$http.post('/api/servicios/solicitar', servicioData)
      
      alert(`Servicio solicitado:\nOrigen: ${serviceData.origin}\nDestino: ${serviceData.destination}`);
      
      // Opcional: Resetear el formulario
      this.selectedOrigin = null;
      this.selectedDestination = null;
    }
  }
};
</script>

<style scoped>
.selected-value {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
}

.trip-info {
  margin: 20px 0;
}

.trip-info .md-card {
  background: linear-gradient(60deg, #26c6da, #00acc1);
}

.trip-info .md-card-content {
  color: white;
}

.trip-info h4 {
  margin-bottom: 15px;
  color: white;
}

.trip-info p {
  margin: 5px 0;
  color: white;
}

.md-error {
  font-size: 12px;
  color: #f44336;
}

.text-right {
  text-align: right;
  margin-top: 20px;
}
</style>