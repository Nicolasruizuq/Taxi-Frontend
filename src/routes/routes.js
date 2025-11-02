import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Notifications from "@/pages/Notifications.vue";
import UpgradeToPRO from "@/pages/UpgradeToPRO.vue";
import Login from "@/pages/Login.vue";
import ClientPrincipal from "../pages/ClientPrincipal.vue";
import DriverPrincipal from "../pages/DriverPrincipal.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { roles: [1, 2] } // Ambos roles pueden ver
      },
      {
        path: "clientprincipal",
        name: "Solicita tu servicio",
        component: ClientPrincipal,
        meta: { roles: [1] } // Solo cliente
      },
      {
        path: "driverprincipal", 
        name: "Observa tus servicios disponibles",
        component: DriverPrincipal,
        meta: { roles: [2] } // Solo conductor (NO cliente)
      },
      {
        path: "user",
        name: "Perfil", 
        component: UserProfile,
        meta: { roles: [1, 2] }
      },
      {
        path: "table",
        name: "Historial de Viajes",
        component: TableList,
        meta: { roles: [1, 2] }
      },
      {
        path: "typography",
        name: "Rankings",
        component: Typography,
        meta: { roles: [1, 2] }
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons,
        meta: { roles: [1, 2] }
      },
      {
        path: "maps",
        name: "Maps",
        meta: {
          hideFooter: true,
          roles: [1, 2]
        },
        component: Maps,
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
        meta: { roles: [1, 2] }
      },
      {
        path: "upgrade",
        name: "Vuelvete VIP",
        component: UpgradeToPRO,
        meta: { roles: [1, 2] }
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  }
];

export default routes;