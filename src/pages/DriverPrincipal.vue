<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-25">
        <edit-profile-form data-background-color="purple"> </edit-profile-form>
      </div>
      <div class="md-layout-item md-big-size-100 md-size-70">
        <service-list data-background-color="green"> </service-list>
      </div>
    </div>
  </div>
</template>

<script>
import { EditProfileForm, ServiceList } from "@/pages";

export default {
  components: {
    EditProfileForm,
    ServiceList,
  },
};
</script>
