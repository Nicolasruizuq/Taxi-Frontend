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

    async register (request) {
      this.loading = true;
      this.error = null;

      this.loading = true;
      this.error = null;

      try {            
          const response = await fetch("http://localhost:4000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            this.error = errorText || "Error en el registro";
            return null;  
          }

          const result = await response.json();
          console.log("Backend response:", result);

          if (result.data && result.data.length > 0) {
            const userData = result.data[0].attributes;        
            // Actualizar estado en Pinia
            this.id = userData.id;
            this.name = userData.name;
            this.username = userData.username;
            this.roleId = userData.role_id;
            this.createdAt = userData.created_at;

            return userData;
          } else {
            this.error = "No se pudo crear el usuario";
            return null;
          }
      } catch (err) {
          this.error = err.message;
          this.user = null;
          return null;
      } finally {
          this.loading = false;
      }      
    }
  },
});
