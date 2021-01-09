import Button from 'primevue/button';
import Dropdown from 'primevue/components/dropdown/Dropdown';
import Galleria from 'primevue/galleria';
import Paginator from 'primevue/paginator';
import { createApp } from 'vue';
import App from './App.vue';

/** MOUNT THE APP **/
createApp(App)
  .component('Paginator', Paginator)
  .component('Galleria', Galleria)
  .component('Dropdown', Dropdown)
  .component('Button', Button)
  .mount('#artwork-ui');

/** IMPORT DEPENDENCIES STYLES **/
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.min.css';
