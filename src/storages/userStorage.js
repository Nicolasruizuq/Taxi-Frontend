import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

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
        this.user = userFound.response.data;
        return this.user;
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
      localStorage.removeItem("user");
    },
  },
});
