import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    roleId: sessionStorage.getItem("role_id") || null,
    name: sessionStorage.getItem("name") || null,
    username: sessionStorage.getItem("username") || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    roleId: (state) => state.user?.attributes?.role_id || null,
    username: (state) => state.user?.attributes?.username || null,
    name: (state) => state.user?.attributes?.name || null,
  },

  actions: {
    // Login
    async login(username, password) {
        this.loading = true;
        this.error = null;

        try {            
            const response = await fetch("http://localhost:4000/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
            });
            
            if (!response.ok) {
              if (response.status === 401) {
                throw new Error("Usuario o contraseña incorrectos");
              } else {
                throw new Error(`Error del servidor: ${response.status}`);
              }
            }

            const result = await response.json();
            console.log("Backend response:", result);
   
            const userData = result.data[0].attributes;
            sessionStorage.setItem("user_id", userData.id);
            sessionStorage.setItem("role_id", userData.role_id);
            sessionStorage.setItem("name", userData.name);
            sessionStorage.setItem("username", userData.username);

            // Actualizar estado en Pinia
            this.name = userData.name;
            this.username = userData.username;
            this.roleId = userData.role_id;

            return userData;
        } catch (err) {
            this.error = err.message;
            this.user = null;
            return null;
        } finally {
            this.loading = false;
        }
    },

    logout() {
        
        this.user = null;
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role_id");
        
    },

    async register(requestPayload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch("http://localhost:4000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.error = errorText || "Error en el registro";
          console.error("Error en el registro:", this.error);
          return null;
        }

        const result = await response.json();
        console.log("Backend response (register):", result);

        // Validamos el formato esperado
        const userData = result?.data?.[0]?.attributes;
        if (userData?.id) {
          // Guardar datos en sessionStorage
          sessionStorage.setItem("role_id", userData.role_id);
          sessionStorage.setItem("name", userData.name);
          sessionStorage.setItem("username", userData.username);

          // Actualizar estado en Pinia
          this.name = userData.name;
          this.username = userData.username;
          this.roleId = userData.role_id;

          return userData; // 👈 importante para que register.vue lo reciba
        } else {
          console.warn("La respuesta del servidor no contiene datos válidos.");
          this.error = "La respuesta del servidor no contiene datos válidos.";
          return null;
        }
      } catch (err) {
        console.error("Error en el registro:", err);
        this.error = "Ocurrió un error inesperado durante el registro.";
        return null;
      } finally {
        this.loading = false;
      }
    }

  },
});
