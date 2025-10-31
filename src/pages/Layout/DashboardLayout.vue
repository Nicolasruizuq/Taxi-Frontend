<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/clientprincipal">
        <md-icon>local_taxi</md-icon>
        <p>Solicitud de viaje</p>
      </sidebar-link>
      <sidebar-link to="/driverprincipal">
        <md-icon>emoji_transportation</md-icon>
        <p>Servicios disponibles</p>
      </sidebar-link>
      <sidebar-link to="/user">
        <md-icon>account_circle</md-icon>
        <p>Perfil</p>
      </sidebar-link>
      <sidebar-link to="/table">
        <md-icon>history</md-icon>
        <p>Historial de viajes</p>
      </sidebar-link>
      <sidebar-link to="/typography">
        <md-icon>emoji_events</md-icon>
        <p>Rankings</p>
      </sidebar-link>
      <sidebar-link to="/icons">
        <md-icon>bubble_chart</md-icon>
        <p>Icons</p>
      </sidebar-link>
      <sidebar-link to="/maps">
        <md-icon>location_on</md-icon>
        <p>Maps</p>
      </sidebar-link>
      <sidebar-link to="/notifications">
        <md-icon>notifications</md-icon>
        <p>Notifications</p>
      </sidebar-link>
      <sidebar-link to="/upgrade" class="active-pro">
        <md-icon>unarchive</md-icon>
        <p>Vuelvete VIP</p>
      </sidebar-link>
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
};
</script>
