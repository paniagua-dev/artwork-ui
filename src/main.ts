import Galleria from 'primevue/galleria';
import Paginator from 'primevue/paginator';
import { createApp } from "vue";
import App from "./App.vue";

/** MOUNT THE APP **/
createApp(App)
  .component('Paginator', Paginator)
  .component('Galleria', Galleria)
  .mount('#artwork-ui');

/** IMPORT DEPENDENCIES STYLES **/
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.min.css';
