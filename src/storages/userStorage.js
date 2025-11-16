import { defineStore } from "pinia";
import { API_URL } from "../constants/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    roleId: sessionStorage.getItem("role_id") || null,
    name: sessionStorage.getItem("name") || null,
    username: sessionStorage.getItem("username") || null,
    profile: null,
    loading: false,
    error: null,
  }),

  /*getters: {
    isAuthenticated: (state) => !!state.user,
    roleId: (state) => state.user?.attributes?.role_id || null,
    username: (state) => state.user?.attributes?.username || null,
    name: (state) => state.user?.attributes?.name || null,
  },*/

  getters: {
    // Mantén nombres distintos a los del state
    isAuthenticated: (state) => !!state.name,
    userRoleId: (state) => state.roleId,
    userUsername: (state) => state.username,
    userName: (state) => state.name,
  },

  actions: {
    // Login
    async login(username, password) {
        this.loading = true;
        this.error = null;

        try {            
            const response = await fetch(`${API_URL}/login`, {
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
        
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role_id");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("name");
        this.name = null;
        this.username = null;
        this.roleId = null;
        this.userId = null;
    },

    async register(requestPayload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_URL}/register`, {
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

          return userData; 
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
    },

    async load(userId) {
      try {
        console.log("📦 Cargando perfil del usuario con ID:", userId);
        const response = await fetch(`${API_URL}/profile/${userId}`);
        const result = await response.json();

        console.log("📦 Respuesta cruda del backend:", result);

        const user =
          Array.isArray(result.data) && result.data.length > 0
            ? result.data[0]
            : result.data || result;

        if (user) {
          this.id = user.id;
          this.name = user.name || "";
          this.username = user.username || "";
          this.roleId = user.role_id || null;
          this.created_at = user.created_at || "";
          this.emailadress = user.emailadress || "";
          this.country = user.country || "";
          this.vehicle_model = user.vehicle_model || "";
          this.vehicle_plate = user.vehicle_plate || "";
          this.points = user.points || 0;

          console.log("💾 Usuario guardado correctamente en el store:", this.$state);
          return { ...user };
        } else {
          console.warn("⚠️ No se encontró información para el usuario con ID:", userId);
          return null;
        }
      } catch (error) {
        console.error("❌ Error cargando el perfil:", error);
        return null;
      }
    }
  },
});
