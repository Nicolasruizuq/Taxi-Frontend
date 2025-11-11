<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Tu Perfil</h4>
        <p class="category">¿Necesitas saber algo sobre ti mismo?</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Rol</label>
              <md-input v-model="role" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Usuario</label>
              <md-input v-model="username" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Contraseña</label>
              <md-input type="password" disabled value="********"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Puntos</label>
              <md-input v-model="points" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Correo (Opcional)</label>
              <md-input v-model="emailadress" type="email"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Nombre</label>
              <md-input v-model="firstname" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Redes sociales (opcional)</label>
              <md-input v-model="lastname" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>País (Opcional)</label>
              <md-input v-model="country" type="text"></md-input>
            </md-field>
          </div>

          <!-- 🔹 Campos adicionales solo si roleId === 2 -->
          <template v-if="roleId === 2">
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>Modelo del Vehículo</label>
                <md-input v-model="vehicleModel" type="text"></md-input>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>Placa del Vehículo</label>
                <md-input v-model="vehiclePlate" type="text"></md-input>
              </md-field>
            </div>
          </template>

          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>Cuéntanos un poco sobre ti</label>
              <md-textarea v-model="aboutme"></md-textarea>
            </md-field>
          </div>

          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click.prevent="updateProfile">
              Actualizar Perfil
            </md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>

<script>
import { useUserStore } from "../../storages/userStorage";

export default {
  name: "edit-profile-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
    profileData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      username: null,
      role: null,
      points: null,
      emailadress: null,
      lastname: null,
      firstname: null,
      address: null,
      city: null,
      country: null,
      code: null,
      vehicleModel: null,
      vehiclePlate: null,
      roleId: null,
      aboutme:
        "Escribo estas palabras en acero, para que aquel que lo encuentre sepa de mi valor.",
    };
  },
  created() {
    // Detectamos roleId desde sessionStorage al crear el componente
    const storedRole = sessionStorage.getItem("role_id");
    this.roleId = storedRole ? parseInt(storedRole) : null;
  },
  watch: {
    profileData: {
      handler(newVal) {
        if (!newVal || Object.keys(newVal).length === 0) return;

        console.log("✅ Recibido profileData actualizado:", newVal);

        const data = newVal.attributes ? newVal.attributes : newVal;
        this.loadProfileData(data);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    loadProfileData(data) {
      this.username = data.username || "";
      this.firstname = data.name || "";
      this.role = data.role_id || "";
      this.vehicleModel = data.vehicle_model || "";
      this.vehiclePlate = data.vehicle_plate || "";
      this.points = data.points || "";
      this.emailadress = data.emailadress || data.email || "";
      this.country = data.country || "";
      this.aboutme = data.aboutme || "";
    },
    async updateProfile() {
      const userStore = useUserStore();
      try {
        const updated = {
          username: this.username,
          name: this.firstname,
          email: this.emailadress,
          country: this.country,
          aboutme: this.aboutme,
          vehicle_model: this.vehicleModel,
          vehicle_plate: this.vehiclePlate,
        };

        await userStore.updateProfile(updated);
        alert("✅ Perfil actualizado correctamente");
      } catch (error) {
        console.error("❌ Error al actualizar perfil:", error);
        alert("❌ No se pudo actualizar el perfil");
      }
    },
  },
};
</script>
