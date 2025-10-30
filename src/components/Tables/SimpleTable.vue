<template>
  <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Fecha">{{ item.date }}</md-table-cell>
        <md-table-cell md-label="Cliente">{{ item.client }}</md-table-cell>
        <md-table-cell md-label="Conductor">{{ item.driver }}</md-table-cell>
        <md-table-cell md-label="Origen">{{ item.Origin }}</md-table-cell>
        <md-table-cell md-label="Destino">{{ item.Destiny }}</md-table-cell>
        <md-table-cell md-label="Estado">{{ item.State }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: "simple-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selected: [],
      users: [
        {
          date: "29/10/25",
          client: "Thor",
          driver: "Thanos",
          Origin: "Asgard",
          Destiny: "New Asgard",
          State: "Completado",
        },
        {
          date: "29/9/25",
          client: "Goku",
          driver: "Freezer",
          Origin: "Vegeta",
          Destiny: "Tierra",
          State: "Completado",
        },
        {
          date: "29/6/25",
          client: "Jotaro",
          driver: "DIO",
          Origin: "Japon",
          Destiny: "Egipto",
          State: "Completado",
        },
        {
          date: "29/8/25",
          client: "Itadori",
          driver: "Sukuna",
          Origin: "Japon",
          Destiny: "Vida feliz",
          State: "Incompleto",
        },
        {
          date: "29/7/25",
          client: "Estudiante",
          driver: "Pachco",
          Origin: "Calculo Integral",
          Destiny: "Calculo Vectorial",
          State: "Incompleto",
        },
        {
          date: "29/2/25",
          client: "Estudiante",
          driver: "Matraz",
          Origin: "Fundamentos",
          Destiny: "Fuera de Fundamentos",
          State: "En proceso gracias a Dios",
        },
      ],
    };
  },
};
</script>
