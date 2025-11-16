<template>
  <md-card class="md-card-profile">
    <div class="md-card-avatar">
      <img class="img" :src="cardUserImage" />
    </div>

    <md-card-content>      
      <h4 class="card-title">
        {{ name }} 
      </h4>

      <p class="card-description">
        {{ userName }}
      </p>
      <!--md-button class="md-round md-success">Follow</md-button-->
    </md-card-content>
  </md-card>
</template>
<script>
export default {
  name: "user-card",

  props: {
    cardUserImage: {
      type: String,
      default: require("@/assets/img/faces/marc.jpg"),
    },
  },

  data() {
    return {
      name: "",
      userName: "",
    };
  },

  mounted() {
    // Ahora sí existe sessionStorage
    this.name = sessionStorage.getItem("name") || "Invitado";
    this.userName = sessionStorage.getItem("username");
  },
};
</script>
