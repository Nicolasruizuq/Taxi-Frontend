<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="blue">
            <h4 class="title">Historial de viajes</h4>
            <p class="category">¿No recuerdas algo de tu viaje?</p>
          </md-card-header>
          <md-card-content>
            <simple-table table-header-color="blue"></simple-table>
          </md-card-content>
        </md-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card class="md-card-plain">
          <md-card-header data-background-color="orange">
            <h4 class="title">Ranking de mejores conductores</h4>
            <p class="category">Aquellos que dominaron el arte de conducir</p>
          </md-card-header>
          <md-card-content>
            <ordered-table></ordered-table>
          </md-card-content>
        </md-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card class="md-card-plain">
          <md-card-header data-background-color="red">
            <h4 class="title">Ranking de mejores clientes</h4>
            <p class="category">Expertos en que alguien haga las cosas por ellos</p>
          </md-card-header>
          <md-card-content>
            <ranking-table></ranking-table>
          </md-card-content>
        </md-card>
      </div>
      
    </div>
  </div>
</template>

<script>
import { SimpleTable, OrderedTable, RankingTable } from "@/components";

export default {
  components: {
    OrderedTable,
    SimpleTable,
    RankingTable,
  },
};
</script>
