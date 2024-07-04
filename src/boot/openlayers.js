import { boot } from 'quasar/wrappers';

import OpenLayersMap from 'vue3-openlayers';

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  debug: !isProduction,
};

export default boot(({ app }) => {
  app.use(OpenLayersMap, {
    options,
  });
});
