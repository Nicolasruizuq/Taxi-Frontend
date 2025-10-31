<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">¿En donde estás?¿A donde quieres ir?</h4>
        <p class="category">Llena el formulario para solicitar tu servicio</p>
      </md-card-header>
      <md-card-content>
        <div class="md-layout-item md-medium-size-100 md-size-100">
            <md-field>
              <label for="opciones">Origen</label>
                <md-select v-model="selectedOption" name="opciones" id="opciones">
                <md-option value="opcion1">Portal Del Quindío</md-option>
                <md-option value="opcion2">Unicentro</md-option>
                <md-option value="opcion3">Universidad del Quindío</md-option>
                <md-option value="opcion4">Parque Sucre</md-option>
                <md-option value="opcion5">Plaza Bolivar</md-option>
                <md-option value="opcion6">Plaza Flora</md-option>
                <md-option value="opcion7">Estadio</md-option>
                <md-option value="opcion8">Coliseo del café</md-option>
                <md-option value="opcion9">Terminal</md-option>
                <md-option value="opcion9">EAM</md-option>
                <md-option value="opcion10">Gran Colombia</md-option>
              </md-select>
            </md-field>
            <div v-if="selectedOption" class="selected-value">
              Seleccionaste: {{ selectedOption }}
            </div>
        </div>
          <div class="md-layout-item md-medium-size-100 md-size-100">
            <md-field>
              <label for="opciones">Destino</label>
                <md-select v-model="selectedOption" name="opciones" id="opciones">
                <md-option value="opcion1">Portal Del Quindío</md-option>
                <md-option value="opcion2">Unicentro</md-option>
                <md-option value="opcion3">Universidad del Quindío</md-option>
                <md-option value="opcion4">Parque Sucre</md-option>
                <md-option value="opcion5">Plaza Bolivar</md-option>
                <md-option value="opcion6">Plaza Flora</md-option>
                <md-option value="opcion7">Estadio</md-option>
                <md-option value="opcion8">Coliseo del café</md-option>
                <md-option value="opcion9">Terminal</md-option>
                <md-option value="opcion9">EAM</md-option>
                <md-option value="opcion10">Gran Colombia</md-option>
              </md-select>
            </md-field>
            <div v-if="selectedOption" class="selected-value">
              Seleccionaste: {{ selectedOption }}
            </div>
        </div>
        <div class="md-layout">
          <!--div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Rol</label>
              <md-input v-model="disabled" disabled></md-input>
            </md-field>
          </div-->
          <!--div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Usuario</label>
              <md-input v-model="username" type="text"></md-input>
            </md-field>
          </div-->
          <!--div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Contraseña</label>
              <md-input v-model="username" type="text"></md-input>
            </md-field>
          </div-->
          <!--div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Puntos</label>
              <md-input v-model="points" disabled></md-input>
            </md-field>
          </div-->
          <!--div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Correo (Opcional)</label>
              <md-input v-model="emailadress" type="email"></md-input>
            </md-field>
          </div-->
          <!--div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Nombre (Opcional)</label>
              <md-input v-model="firstname" type="text"></md-input>
            </md-field>
          </div-->
          <!--div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Redes sociales (opcional)</label>
              <md-input v-model="lastname" type="text"></md-input>
            </md-field>
          </div-->
          <!--div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>País (Opcional)</label>
              <md-input v-model="country" type="text"></md-input>
            </md-field>
          </div-->
          <!--div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>Cuentanos un poco sobre ti</label>
              <md-textarea v-model="aboutme"></md-textarea>
            </md-field>
          </div-->
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success">Solicitar servicio</md-button>
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
      aboutme:
        "Escribo estas palabras en acero, para que aquel que lo encuentre sepa de mi valor.",
    };
  },
};
</script>
<style></style>
