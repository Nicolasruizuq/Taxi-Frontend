<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/app/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/app/clientprincipal">
        <md-icon>local_taxi</md-icon>
        <p>Solicitud de viaje</p>
      </sidebar-link>
      <sidebar-link to="/app/driverprincipal">
        <md-icon>emoji_transportation</md-icon>
        <p>Servicios disponibles</p>
      </sidebar-link>
      <sidebar-link to="/app/user">
        <md-icon>account_circle</md-icon>
        <p>Perfil</p>
      </sidebar-link>
      <sidebar-link to="/app/table">
        <md-icon>history</md-icon>
        <p>Historial de viajes</p>
      </sidebar-link>
      <sidebar-link to="/app/typography">
        <md-icon>emoji_events</md-icon>
        <p>Rankings</p>
      </sidebar-link>
      <!--sidebar-link to="/app/icons">
        <md-icon>bubble_chart</md-icon>
        <p>Icons</p>
      </sidebar-link-->
      <sidebar-link to="/app/upgrade">
        <md-icon>diamond</md-icon>
        <p>Conviertete en VIP</p>
      </sidebar-link>
      <sidebar-link to="/app/notifications">
        <md-icon>notifications</md-icon>
        <p>Notifications</p>
      </sidebar-link>
      
      <li class="md-list-item logout-item" @click="logout">
        <a class="md-list-item-router md-list-item-container md-button-clean">
          <div class="md-list-item-content">
            <md-icon>exit_to_app</md-icon>
            <p>Cerrar sesión</p>
          </div>
        </a>
      </li>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <fixed-plugin
        :color.sync="sidebarBackground"
        :image.sync="sidebarBackgroundImage"
      >
      </fixed-plugin>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";
import FixedPlugin from "./Extra/FixedPlugin.vue";
import { useUserStore } from "../../storages/userStorage";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
    FixedPlugin,
  },
  data() {
    return {
      sidebarBackground: "purple",
      sidebarBackgroundImage: require("@/assets/img/sidebar-3.jpg"),
    };
  },
  methods: {
    logout() {
      const store = useUserStore();
      store.logout();
      this.$router.push("/login");
    },
  },
};
</script>
