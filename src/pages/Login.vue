<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="login">
      <div class="input-group">
        <label>Usuario</label>
        <input v-model="username" type="text" placeholder="Ingresa tu usuario" />
      </div>

      <div class="input-group">
        <label>Contraseña</label>
        <input v-model="password" type="password" placeholder="Ingresa tu contraseña" />
      </div>

      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.username === "admin" && this.password === "1234") {
        alert("Login correcto");
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.input-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  width: 100%;
  background: #42b983;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
}
</style>
