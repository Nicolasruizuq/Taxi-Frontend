<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-40">
        <travel-form data-background-color="orange"> </travel-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <taxi-map> </taxi-map>
      </div>
    </div>
  </div>
</template>

<script>
import { TravelForm, TaxiMap } from "@/pages";

export default {
  components: {
    TravelForm,
    TaxiMap,
  },
};
</script>
