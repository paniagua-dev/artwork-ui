import Fullscreen from '@/full-screen/Fullscreen.vue';
import Button from 'primevue/button';
import Galleria from 'primevue/galleria';
import Paginator from 'primevue/paginator';
import { createApp } from 'vue';
import App from './App.vue';

/** MOUNT THE APP **/
createApp(App)
  .component('Fullscreen', Fullscreen)
  .component('Paginator', Paginator)
  .component('Galleria', Galleria)
  .component('Button', Button)
  .mount('#artwork-ui');

/** IMPORT DEPENDENCIES STYLES **/
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.min.css';