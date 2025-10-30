<template>
  <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Usuario">{{ item.user }}</md-table-cell>
        <md-table-cell md-label="Puntos">{{ item.points }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: "ranking-table",
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
          id: 1,
          user: "gogeta",
          points: "$36,738",
        },
        {
          id: 2,
          user: "vegetto",
          points: "$23,738",
        },
        {
          id: 3,
          user: "gotenks",
          points: "$56,142",
        },
        {
          id: 4,
          user: "kefla",
          points: "$38,735",
        },
      ],
    };
  },
};
</script>
