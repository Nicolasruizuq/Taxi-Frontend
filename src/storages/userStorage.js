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
    async login(username, password) {
        this.loading = true;
        this.error = null;

        try {
            // ✅ Simulamos una llamada HTTP con delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Usuarios de prueba
            const testUsers = [
            {
                username: "nico",
                password: "12345",
                response: {
                data: {
                    type: "user",
                    id: "1",
                    attributes: {
                    role_id: 1,
                    name: "Nicolás Ruiz",
                    username: "nico",
                    },
                    links: { self: "/api/v1/users/1" },
                },
                },
            },
            {
                username: "juanpa",
                password: "123456",
                response: {
                data: {
                    type: "user",
                    id: "2",
                    attributes: {
                    role_id: 2,
                    name: "Juan Pablo",
                    username: "juanpa",
                    },
                    links: { self: "/api/v1/users/2" },
                },
                },
            },
            {
                username: "parra",
                password: "1234567",
                response: {
                data: {
                    type: "user",
                    id: "3",
                    attributes: {
                    role_id: 99,
                    name: "Andres Parra",
                    username: "parra",
                    },
                    links: { self: "/api/v1/users/3" },
                },
                },
            },
            ];

            // Buscar usuario de prueba
            const userFound = testUsers.find(
            (u) => u.username === username && u.password === password
            );

            if (!userFound) {
            throw new Error("Usuario o contraseña incorrectos");
            }

            // Simula la respuesta del backend
            const response = userFound.response.data;
            console.log('UserStorage response: ', response)
            sessionStorage.setItem("role_id", response.attributes.role_id);
            sessionStorage.setItem("name", response.attributes.name);
            sessionStorage.setItem("username", response.attributes.username);
            return response;
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

    register () {
        this.loading = true;
        this.error = null;

        try {
        // Simulación de registro
        new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Datos del registro:", this.form);
        alert("Registro exitoso 🎉");
        this.$router.push("/login");
      } catch (err) {
        this.error = "Ocurrió un error al registrar el usuario.";
      } finally {
        this.loading = false;
      }
    }
  },
});
