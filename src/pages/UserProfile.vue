<template>
  <div class="content">
    <div class="md-layout">
      <!-- 👇 Pasamos los datos del perfil al hijo -->
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-profile-form
          :data-background-color="'purple'"
          :profile-data="profileData"
        />
      </div>

      <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card />
      </div>
    </div>
  </div>
</template>

<script>
import { EditProfileForm, UserCard } from "@/pages";
import { useUserStore } from "@/storages/userStorage";

export default {
  name: "UserProfile",
  components: {
    EditProfileForm,
    UserCard,
  },
  data() {
    return {
      profileData: null,
    };
  },
  async mounted() {
    try {
      const userId = sessionStorage.getItem("user_id");

      if (!userId) {
        console.warn("⚠️ No se encontró el user_id en sessionStorage");
        return;
      }

      console.log("📦 Cargando perfil del usuario con ID:", userId);

      const userProfileStore = useUserStore();

      // Llamada al backend a través del store
      const loadedProfile = await userProfileStore.load(userId);

      if (loadedProfile) {
        this.profileData = loadedProfile.attributes ? loadedProfile.attributes : loadedProfile;
  console.log("✅ Perfil cargado desde el padre (plano):", this.profileData);
      } else {
        console.warn("⚠️ No se obtuvo ningún perfil del store");
      }
    } catch (error) {
      console.error("❌ Error al cargar el perfil desde el padre:", error);
    }
  },
};
</script>
