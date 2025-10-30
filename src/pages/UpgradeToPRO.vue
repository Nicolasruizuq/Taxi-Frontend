<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 mx-auto md-small-size-100">
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">Plan premium</h4>
            <p class="category">
              ¿Buscas ganar mas puntos por menos esfuerzo? ¡Suscribete a nuestro plan premium!
            </p>
          </md-card-header>

          <md-card-content>
            <div class="table-responsive table-upgrade">
              <table class="table" cellspacing="0">
                <thead>
                  <tr>
                    <th></th>
                    <th class="text-center">Gratuito</th>
                    <th class="text-center">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Puntos por recorrido</td>
                    <td class="text-center">10-15</td>
                    <td class="text-center">20-30</td>
                  </tr>
                  <tr>
                    <td>Aspectos</td>
                    <td class="text-center">1</td>
                    <td class="text-center">40</td>
                  </tr>
                  <tr>
                    <td>Carrera de temporada</td>
                    <td class="text-center">
                      <i class="fa fa-times text-danger"></i>
                    </td>
                    <td class="text-center">
                      <i class="fa fa-check text-success"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Habilidades exclusivas para tu vehiculo
                    </td>
                    <td class="text-center">
                      <i class="fa fa-times text-danger"></i>
                    </td>
                    <td class="text-center">
                      <i class="fa fa-check text-success"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Posibilidad de adquirir 1 punto por hora jugada</td>
                    <td class="text-center">
                      <i class="fa fa-times text-danger"></i>
                    </td>
                    <td class="text-center">
                      <i class="fa fa-check text-success"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Atencion al cliente prioritaria</td>
                    <td class="text-center">
                      <i class="fa fa-times text-danger"></i>
                    </td>
                    <td class="text-center">
                      <i class="fa fa-check text-success"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Precio</td>
                    <td class="text-center">Gratis</td>
                    <td class="text-center">$20.000.000.000</td>
                  </tr>
                  <tr>
                    <td class="text-center"></td>
                    <td class="text-center">
                      <md-button href="#" class="md-default md-round" disabled
                        >Version actual</md-button
                      >
                    </td>
                    <td class="text-center">
                      <md-button
                        target="_blank"
                        href="https://www.creative-tim.com/product/vue-material-dashboard-pro/?ref=vue-md-free-upgrade-live"
                        class="md-info md-round"
                        >Pasate a premium</md-button
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.mx-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}

.md-card {
  margin-top: 50px;
}

.table-responsive {
  overflow: auto;
}

.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;

  thead tr th {
    font-size: 1.063rem;
    border-top-width: 0;
    font-weight: 300;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  & > tbody > tr > td,
  & > tbody > tr > th,
  & > tfoot > tr > td,
  & > tfoot > tr > th,
  & > thead > tr > td,
  & > thead > tr > th {
    padding: 12px 8px;
    vertical-align: middle;
  }

  & > tbody > tr {
    position: relative;
  }

  td,
  th {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
}
</style>
