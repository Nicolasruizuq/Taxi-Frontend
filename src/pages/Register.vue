<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-card">
        <h1>Crear cuenta</h1>

        <form @submit.prevent="register">
          <!-- Nombre -->
          <div class="input-group">
            <label>Nombre completo</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Ingresa tu nombre completo" 
              required
            />
          </div>

          <!-- Usuario -->
          <div class="input-group">
            <label>Usuario</label>
            <input 
              v-model="form.username" 
              type="text" 
              placeholder="Ingresa tu nombre de usuario" 
              required
            />
          </div>

          <!-- Contraseña -->
          <div class="input-group">
            <label>Contraseña</label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="Crea una contraseña" 
              required
            />
          </div>

          <!-- Tipo de usuario -->
          <div class="input-group">
            <label>Tipo de usuario</label>
            <select v-model="form.userType" required>
              <option disabled value="">Selecciona un tipo</option>
              <option value="Pasajero">Pasajero</option>
              <option value="Conductor">Conductor</option>
            </select>
          </div>

          <!-- Campos adicionales si es Conductor -->
          <div v-if="form.userType === 'Conductor'">
            <div class="input-group">
              <label>Modelo del vehículo</label>
              <input 
                v-model="form.vehicleModel" 
                type="text" 
                placeholder="Ej: Toyota Corolla" 
                required
              />
            </div>

            <div class="input-group">
              <label>Placa</label>
              <input 
                v-model="form.plate" 
                type="text" 
                placeholder="Ej: ABC123" 
                required
              />
            </div>
          </div>

          <button type="submit" :disabled="loading">
            <span v-if="!loading">Registrarse</span>
            <span v-else class="loading-text">Creando cuenta...</span>
          </button>

          <!-- Mensaje de error -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <!-- Enlace al login -->
        <div class="register-link">
          ¿Ya tienes una cuenta?
          <router-link to="/login">Inicia sesión</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      loading: false,
      error: null,
      form: {
        name: "",
        username: "",
        password: "",
        userType: "",
        vehicleModel: "",
        plate: "",
      },
    };
  },
  methods: {
    async register() {
      this.error = null;
      this.loading = true;

      try {
        // Simulación de registro
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Datos del registro:", this.form);
        alert("Registro exitoso 🎉");
        this.$router.push("/login");
      } catch (err) {
        this.error = "Ocurrió un error al registrar el usuario.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Reutiliza el mismo estilo del Login.vue */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f4f4;
}

.login-container {
  width: 100%;
  max-width: 520px;
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 40px 35px;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 25px;
  font-weight: bold;
  color: #333;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 11px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: all 0.2s ease;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #9c27b0;
  box-shadow: 0 0 3px rgba(156, 39, 176, 0.4);
  outline: none;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #9c27b0;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background-color: #7b1fa2;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

.register-link a {
  color: #9c27b0;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
