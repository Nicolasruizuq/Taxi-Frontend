<template>
  <form>
    <md-card>
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
              v-model="origenSeleccionado" 
              name="origen" 
              id="origen"
              @change="onOrigenChange"
            >
              <md-option 
                v-for="lugar in lugares" 
                :key="lugar.id" 
                :value="lugar.id"
              >
                {{ lugar.nombre }}
              </md-option>
            </md-select>
          </md-field>
          <div v-if="origenSeleccionado" class="selected-value">
            Origen seleccionado: {{ obtenerNombreLugar(origenSeleccionado) }}
          </div>
        </div>

        <!-- Destino -->
        <div class="md-layout-item md-medium-size-100 md-size-100">
          <md-field>
            <label for="destino">Destino</label>
            <md-select 
              v-model="destinoSeleccionado" 
              name="destino" 
              id="destino"
              :disabled="!origenSeleccionado"
            >
              <md-option 
                v-for="lugar in destinosDisponibles" 
                :key="lugar.id" 
                :value="lugar.id"
              >
                {{ lugar.nombre }}
              </md-option>
            </md-select>
            <span class="md-error" v-if="!origenSeleccionado">
              Primero selecciona un origen
            </span>
          </md-field>
          <div v-if="destinoSeleccionado" class="selected-value">
            Destino seleccionado: {{ obtenerNombreLugar(destinoSeleccionado) }}
          </div>
        </div>

        <!-- Información del viaje -->
        <div v-if="origenSeleccionado && destinoSeleccionado" class="trip-info">
          <md-card class="md-primary">
            <md-card-content>
              <h4>Resumen de tu viaje</h4>
              <p><strong>Origen:</strong> {{ obtenerNombreLugar(origenSeleccionado) }}</p>
              <p><strong>Destino:</strong> {{ obtenerNombreLugar(destinoSeleccionado) }}</p>
              <p><strong>Distancia aproximada:</strong> {{ calcularDistancia() }}</p>
            </md-card-content>
          </md-card>
        </div>

        <div class="md-layout">
          <div class="md-layout-item md-size-100 text-right">
            <md-button 
              class="md-raised md-success" 
              :disabled="!origenSeleccionado || !destinoSeleccionado"
              @click.prevent="solicitarServicio"
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
      origenSeleccionado: null,
      destinoSeleccionado: null,
      lugares: [
        { id: "portal_quindio", nombre: "Portal Del Quindío" },
        { id: "unicentro", nombre: "Unicentro" },
        { id: "universidad_quindio", nombre: "Universidad del Quindío" },
        { id: "parque_sucre", nombre: "Parque Sucre" },
        { id: "plaza_bolivar", nombre: "Plaza Bolivar" },
        { id: "plaza_flora", nombre: "Plaza Flora" },
        { id: "estadio", nombre: "Estadio" },
        { id: "coliseo_cafe", nombre: "Coliseo del café" },
        { id: "terminal", nombre: "Terminal" },
        { id: "eam", nombre: "EAM" },
        { id: "gran_colombia", nombre: "Gran Colombia" }
      ],
      // Campos opcionales (mantenidos por si los necesitas)
      username: null,
      disabled: null,
      points: null,
      emailadress: null,
      lastname: null,
      firstname: null,
      address: null,
      city: null,
      country: null,
      code: null,
      aboutme: "Escribo estas palabras en acero, para que aquel que lo encuentre sepa de mi valor.",
    };
  },
  computed: {
    destinosDisponibles() {
      if (!this.origenSeleccionado) {
        return [];
      }
      // Filtrar todos los lugares excepto el origen seleccionado
      return this.lugares.filter(lugar => lugar.id !== this.origenSeleccionado);
    }
  },
  methods: {
    onOrigenChange() {
      // Resetear destino cuando cambia el origen
      this.destinoSeleccionado = null;
    },
    
    obtenerNombreLugar(id) {
      const lugar = this.lugares.find(l => l.id === id);
      return lugar ? lugar.nombre : '';
    },
    
    calcularDistancia() {
      // Aquí puedes implementar lógica real de cálculo de distancias
      // Por ahora es un ejemplo simple
      const distancias = {
        'corta': '2-5 km',
        'media': '5-10 km', 
        'larga': '10+ km'
      };
      
      // Simular cálculo basado en los lugares seleccionados
      if (this.origenSeleccionado && this.destinoSeleccionado) {
        return distancias.media; // Ejemplo
      }
      return '';
    },
    
    solicitarServicio() {
      if (!this.origenSeleccionado || !this.destinoSeleccionado) {
        alert('Por favor selecciona origen y destino');
        return;
      }
      
      const servicioData = {
        origen: this.obtenerNombreLugar(this.origenSeleccionado),
        destino: this.obtenerNombreLugar(this.destinoSeleccionado),
        origenId: this.origenSeleccionado,
        destinoId: this.destinoSeleccionado,
        timestamp: new Date().toISOString()
      };
      
      console.log('Solicitando servicio:', servicioData);
      
      // Aquí iría la llamada a tu API
      // this.$http.post('/api/servicios/solicitar', servicioData)
      
      alert(`Servicio solicitado:\nOrigen: ${servicioData.origen}\nDestino: ${servicioData.destino}`);
      
      // Opcional: Resetear el formulario
      // this.origenSeleccionado = null;
      // this.destinoSeleccionado = null;
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