<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-card">
        <h1>Iniciar Sesión</h1>
        <form @submit.prevent="login">
          <div class="input-group">
            <label>Usuario</label>
            <input 
              v-model="credentials.username" 
              type="text" 
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div class="input-group">
            <label>Contraseña</label>
            <input 
              v-model="credentials.password" 
              type="password" 
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button type="submit" :disabled="loading">
            <span v-if="!loading">Entrar</span>
            <span v-else class="loading-text">Iniciando sesión...</span>
          </button>

          <!-- Mensaje de error -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <!-- Usuarios de prueba -->
        <div class="test-users">
          <h3>Usuarios de Prueba</h3>
          <div class="test-user" @click="fillCredentials('nicorusa', 'cliente123')">
            <strong>Cliente:</strong> nicorusa / cliente123
          </div>
          <div class="test-user" @click="fillCredentials('driver01', 'conductor123')">
            <strong>Conductor:</strong> driver01 / conductor123
          </div>
          <div class="test-user" @click="fillCredentials('admin', '1234')">
            <strong>Admin:</strong> admin / 1234
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      credentials: {
        username: "",
        password: ""
      },
      loading: false,
      error: "",
      users: [
        {
          id: 1,
          username: "nicorusa",
          password: "cliente123",
          name: "Nicolás Ruiz",
          role_id: 1,
          type: "user"
        },
        {
          id: 2,
          username: "driver01",
          password: "conductor123", 
          name: "Carlos López",
          role_id: 2,
          type: "user"
        },
        {
          id: 3,
          username: "admin",
          password: "1234",
          name: "Administrador",
          role_id: 1,
          type: "user"
        }
      ]
    };
  },
  methods: {
    async login() {
      if (!this.credentials.username || !this.credentials.password) {
        this.error = "Por favor completa todos los campos";
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = this.authenticateUser(this.credentials.username, this.credentials.password);
        
        if (user) {
          this.loginSuccess(user);
        } else {
          this.loginError("Usuario o contraseña incorrectos");
        }
      } catch (error) {
        this.loginError("Error al conectar con el servidor");
      }
    },

    authenticateUser(username, password) {
      return this.users.find(user => 
        user.username === username && user.password === password
      );
    },

    loginSuccess(user) {
      // Guardar usuario en localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role_id.toString());
      localStorage.setItem('userName', user.name);

      console.log('Login exitoso:', user);

      // Redirigir según el rol
      this.redirectByRole(user.role_id);
    },

    loginError(message) {
      this.loading = false;
      this.error = message;
    },

    redirectByRole(roleId) {
      this.loading = false;
      
      let targetRoute = '';
      
      switch(roleId) {
        case 1: // Cliente
          targetRoute = '/admin/clientprincipal';
          break;
        case 2: // Conductor
          targetRoute = '/admin/driverprincipal';
          break;
        default:
          targetRoute = '/admin/dashboard';
      }

      // Solo navegar si no estamos ya en esa ruta
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },

    fillCredentials(username, password) {
      this.credentials.username = username;
      this.credentials.password = password;
      this.error = "";
    }
  },

  mounted() {
    // Si ya está autenticado, redirigir automáticamente
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      const userRole = parseInt(localStorage.getItem('userRole') || '0');
      this.redirectByRole(userRole);
    }
  }
};
</script>

<style scoped>
/* Tus estilos existentes se mantienen igual */
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 10px;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-text {
  display: inline-block;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  border-left: 4px solid #c62828;
  text-align: left;
}

.test-users {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.test-users h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.test-user {
  background: #f8f9fa;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  text-align: left;
  border: 1px solid #e9ecef;
}

.test-user:hover {
  background: #e9ecef;
  border-color: #667eea;
}

.test-user strong {
  color: #667eea;
  display: block;
  margin-bottom: 4px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  input {
    padding: 10px 14px;
  }
  
  button {
    padding: 12px;
  }
}
</style>